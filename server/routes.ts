import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import nodemailer from "nodemailer";
import { storage } from "./storage";
import { insertOrderSchema } from "@shared/schema";
import { z } from "zod";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

// Email configuration
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get seasonal deals
  app.get("/api/seasonal-deals", async (req, res) => {
    try {
      const deals = await storage.getActiveSeasonalDeals();
      res.json(deals);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching seasonal deals: " + error.message });
    }
  });

  // Create order
  app.post("/api/orders", async (req, res) => {
    try {
      const validatedData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(validatedData);
      
      // Send email notification
      const mailOptions = {
        from: process.env.EMAIL_USER || 'your-email@gmail.com',
        to: 'normanbakes38@gmail.com',
        subject: `New Cake Order - ${order.cakeType}`,
        html: `
          <h2>New Cake Order Received</h2>
          <p><strong>Order ID:</strong> ${order.id}</p>
          <p><strong>Customer:</strong> ${order.customerName}</p>
          <p><strong>Email:</strong> ${order.customerEmail}</p>
          <p><strong>Phone:</strong> ${order.customerPhone}</p>
          <p><strong>Collection Date:</strong> ${order.collectionDate}</p>
          <p><strong>Cake Type:</strong> ${order.cakeType}</p>
          <p><strong>Size:</strong> ${order.cakeSize}</p>
          <p><strong>Flavour:</strong> ${order.cakeFlavour || 'Not specified'}</p>
          <p><strong>Theme:</strong> ${order.cakeTheme || 'Not specified'}</p>
          <p><strong>Special Requirements:</strong> ${order.specialRequirements || 'None'}</p>
          <p><strong>Estimated Price:</strong> £${order.estimatedPrice}</p>
          <p><strong>Deposit Required:</strong> £${order.depositAmount}</p>
          <p><strong>Deposit Status:</strong> ${order.depositPaid ? 'Paid' : 'Pending'}</p>
        `
      };

      try {
        await transporter.sendMail(mailOptions);
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
      }

      res.json(order);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Validation error", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error creating order: " + error.message });
      }
    }
  });

  // Create payment intent for deposit
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, orderId } = req.body;
      
      if (!amount || !orderId) {
        return res.status(400).json({ message: "Amount and order ID are required" });
      }

      const order = await storage.getOrder(parseInt(orderId));
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to pence
        currency: "gbp",
        metadata: {
          orderId: orderId.toString(),
          customerEmail: order.customerEmail,
          customerName: order.customerName
        },
        description: `Deposit for ${order.cakeType} - Order #${orderId}`
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Confirm payment and update order
  app.post("/api/confirm-payment", async (req, res) => {
    try {
      const { paymentIntentId, orderId } = req.body;
      
      if (!paymentIntentId || !orderId) {
        return res.status(400).json({ message: "Payment intent ID and order ID are required" });
      }

      const updatedOrder = await storage.updateOrderPaymentStatus(parseInt(orderId), paymentIntentId);
      if (!updatedOrder) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Send confirmation email
      const mailOptions = {
        from: process.env.EMAIL_USER || 'your-email@gmail.com',
        to: 'normanbakes38@gmail.com',
        subject: `Deposit Paid - Order #${orderId}`,
        html: `
          <h2>Deposit Payment Confirmed</h2>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p><strong>Customer:</strong> ${updatedOrder.customerName}</p>
          <p><strong>Email:</strong> ${updatedOrder.customerEmail}</p>
          <p><strong>Deposit Amount:</strong> £${updatedOrder.depositAmount}</p>
          <p><strong>Payment Intent ID:</strong> ${paymentIntentId}</p>
          <p>The customer has successfully paid their deposit.</p>
        `
      };

      try {
        await transporter.sendMail(mailOptions);
      } catch (emailError) {
        console.error('Confirmation email sending failed:', emailError);
      }

      res.json(updatedOrder);
    } catch (error: any) {
      res.status(500).json({ message: "Error confirming payment: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

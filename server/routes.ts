import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import nodemailer from "nodemailer";
import { storage } from "./storage";
import { insertOrderSchema } from "@shared/schema";
import { z } from "zod";

let stripe: Stripe | null = null;

if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
}

// Direct email notifications using formsubmit.co (same as LB Interface approach)
async function sendEmailNotification(orderData: any) {
  try {
    const formData = new FormData();
    formData.append('name', orderData.customerName);
    formData.append('email', orderData.customerEmail);
    formData.append('phone', orderData.customerPhone);
    formData.append('_subject', `New Cake Order - ${orderData.productType}`);
    formData.append('_captcha', 'false');
    formData.append('_template', 'table');
    formData.append('message', `
NEW CAKE ORDER RECEIVED

Order Details:
- Order ID: ${orderData.id}
- Date: ${new Date(orderData.createdAt).toLocaleDateString('en-GB')}

Customer Information:
- Name: ${orderData.customerName}
- Email: ${orderData.customerEmail}
- Phone: ${orderData.customerPhone}

Product Details:
- Product Type: ${orderData.productType}
- Description: ${orderData.productDetails}
- Collection Date: ${orderData.collectionDate}
- Special Requirements: ${orderData.specialRequirements || 'None'}

Payment Information:
- Deposit Amount: £${orderData.depositAmount}
- Payment Status: ${orderData.paymentStatus}

Contact the customer to discuss final details and arrange payment.
    `);

    const response = await fetch('https://formsubmit.co/normanbakes38@gmail.com', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      console.log('Order notification sent to normanbakes38@gmail.com');
      return true;
    } else {
      console.error('Failed to send order notification');
      return false;
    }
  } catch (error) {
    console.error('Email notification failed:', error);
    return false;
  }
}

async function sendPaymentConfirmation(orderData: any, paymentIntentId: string) {
  try {
    const formData = new FormData();
    formData.append('name', orderData.customerName);
    formData.append('email', orderData.customerEmail);
    formData.append('phone', orderData.customerPhone);
    formData.append('_subject', `PAYMENT RECEIVED - Order #${orderData.id}`);
    formData.append('_captcha', 'false');
    formData.append('_template', 'table');
    formData.append('message', `
PAYMENT RECEIVED - DEPOSIT CONFIRMED

Order Information:
- Order ID: ${orderData.id}
- Payment Date: ${new Date().toLocaleDateString('en-GB')}
- Payment Amount: £${orderData.depositAmount}
- Stripe Payment ID: ${paymentIntentId}

Customer Details:
- Name: ${orderData.customerName}
- Email: ${orderData.customerEmail}
- Phone: ${orderData.customerPhone}

Product Details:
- Product Type: ${orderData.productType}
- Collection Date: ${orderData.collectionDate}

STATUS: READY TO START BAKING!

Next Steps:
- Contact customer to confirm final details
- Discuss any customisation requirements
- Arrange collection/delivery logistics
- Calculate and collect remaining balance
    `);

    const response = await fetch('https://formsubmit.co/normanbakes38@gmail.com', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      console.log('Payment confirmation sent to normanbakes38@gmail.com');
      return true;
    } else {
      console.error('Failed to send payment confirmation');
      return false;
    }
  } catch (error) {
    console.error('Payment confirmation failed:', error);
    return false;
  }
}

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
      
      // Send notification using free console logging approach
      try {
        await sendEmailNotification(order);
      } catch (emailError) {
        console.error('Email notification failed:', emailError);
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
      if (!stripe) {
        return res.status(503).json({ message: "Payment processing is temporarily unavailable. Please contact us directly." });
      }

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
        description: `Deposit for ${order.productType} - Order #${orderId}`
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
      // Send payment confirmation notification
      try {
        await sendPaymentConfirmation(updatedOrder, paymentIntentId);
      } catch (error) {
        console.error('Payment confirmation notification failed:', error);
      }

      res.json(updatedOrder);
    } catch (error: any) {
      res.status(500).json({ message: "Error confirming payment: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

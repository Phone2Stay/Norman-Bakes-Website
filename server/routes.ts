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

// Free email solution - will log order details for now
async function sendEmailNotification(orderData: any) {
  try {
    // For now, we'll log the order details - you can set up a free email service later
    console.log('=== NEW CAKE ORDER RECEIVED ===');
    console.log(`Customer: ${orderData.customerName}`);
    console.log(`Email: ${orderData.customerEmail}`);
    console.log(`Phone: ${orderData.customerPhone}`);
    console.log(`Product: ${orderData.productType}`);
    console.log(`Collection Date: ${orderData.collectionDate}`);
    console.log(`Deposit: £${orderData.depositAmount}`);
    console.log(`Order ID: ${orderData.id}`);
    console.log('===============================');
    
    // Option 1: Use a free email service like Formspree
    // You can create a free account at https://formspree.io and get your own form endpoint
    
    // Option 2: Use a webhook service that forwards to email
    // We'll implement this approach
    
    return true; // Return true for now since we're logging
  } catch (error) {
    console.error('Email notification failed:', error);
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
      
      // Send email notification
      const mailOptions = {
        from: process.env.EMAIL_USER || 'your-email@gmail.com',
        to: 'normanbakes38@gmail.com',
        subject: `New Cake Order - ${order.productType}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #000; color: #d97706; padding: 20px; text-align: center;">
              <h2 style="margin: 0; color: #d97706;">New Cake Order Received</h2>
            </div>
            <div style="padding: 20px; background-color: #f9f9f9;">
              <h3 style="color: #000; border-bottom: 2px solid #d97706; padding-bottom: 10px;">Order Details</h3>
              <p><strong>Order ID:</strong> ${order.id}</p>
              <p><strong>Date Submitted:</strong> ${new Date(order.createdAt!).toLocaleDateString('en-GB')}</p>
              
              <h3 style="color: #000; border-bottom: 2px solid #d97706; padding-bottom: 10px;">Customer Information</h3>
              <p><strong>Name:</strong> ${order.customerName}</p>
              <p><strong>Email:</strong> ${order.customerEmail}</p>
              <p><strong>Phone:</strong> ${order.customerPhone}</p>
              <p><strong>Collection Date:</strong> ${order.collectionDate}</p>
              
              <h3 style="color: #000; border-bottom: 2px solid #d97706; padding-bottom: 10px;">Product Details</h3>
              <p><strong>Product Type:</strong> ${order.productType}</p>
              <div style="background-color: #fff; padding: 15px; border-left: 4px solid #d97706; margin: 10px 0;">
                <strong>Product Details:</strong><br>
                ${order.productDetails}
              </div>
              ${order.specialRequirements ? `
              <div style="background-color: #fff; padding: 15px; border-left: 4px solid #d97706; margin: 10px 0;">
                <strong>Special Requirements:</strong><br>
                ${order.specialRequirements}
              </div>
              ` : ''}
              
              <h3 style="color: #000; border-bottom: 2px solid #d97706; padding-bottom: 10px;">Payment Information</h3>
              <p><strong>Deposit Amount:</strong> £${order.depositAmount}</p>
              <p><strong>Payment Status:</strong> ${order.paymentStatus === 'paid' ? '✅ Deposit Paid' : '⏳ Payment Pending'}</p>
              
              <div style="background-color: #d97706; color: #000; padding: 15px; text-align: center; margin-top: 20px;">
                <strong>Contact the customer to discuss full details and arrange final payment</strong>
              </div>
            </div>
          </div>
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
      const mailOptions = {
        from: process.env.EMAIL_USER || 'your-email@gmail.com',
        to: 'normanbakes38@gmail.com',
        subject: `💰 DEPOSIT PAID - Order #${orderId} - ${updatedOrder.customerName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #d97706; color: #000; padding: 20px; text-align: center;">
              <h2 style="margin: 0; color: #000;">✅ DEPOSIT PAYMENT CONFIRMED</h2>
            </div>
            <div style="padding: 20px; background-color: #f0f8f0; border: 2px solid #28a745;">
              <h3 style="color: #28a745; text-align: center; margin-top: 0;">Ready to start baking! 🎂</h3>
              
              <div style="background-color: #fff; padding: 15px; border-radius: 5px; margin: 15px 0;">
                <h4 style="color: #000; margin-top: 0;">Order Information</h4>
                <p><strong>Order ID:</strong> #${orderId}</p>
                <p><strong>Product Type:</strong> ${updatedOrder.productType}</p>
                <p><strong>Product Details:</strong> ${updatedOrder.productDetails}</p>
                <p><strong>Collection Date:</strong> ${updatedOrder.collectionDate}</p>
              </div>
              
              <div style="background-color: #fff; padding: 15px; border-radius: 5px; margin: 15px 0;">
                <h4 style="color: #000; margin-top: 0;">Customer Details</h4>
                <p><strong>Name:</strong> ${updatedOrder.customerName}</p>
                <p><strong>Email:</strong> ${updatedOrder.customerEmail}</p>
                <p><strong>Phone:</strong> ${updatedOrder.customerPhone}</p>
              </div>
              
              <div style="background-color: #28a745; color: #fff; padding: 15px; text-align: center; border-radius: 5px;">
                <h4 style="margin: 5px 0; color: #fff;">💳 Payment Confirmed: £${updatedOrder.depositAmount}</h4>
                <p style="margin: 5px 0;">Stripe Payment ID: ${paymentIntentId}</p>
              </div>
              
              <div style="background-color: #fff; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #d97706;">
                <strong>Next Steps:</strong>
                <ul style="margin: 10px 0;">
                  <li>Contact customer to confirm final details</li>
                  <li>Discuss any customisation requirements</li>
                  <li>Arrange collection/delivery logistics</li>
                  <li>Calculate and collect remaining balance</li>
                </ul>
              </div>
            </div>
          </div>
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

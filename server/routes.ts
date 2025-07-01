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

// Payment confirmation notification
async function sendPaymentConfirmation(orderData: any, paymentIntentId: string) {
  try {
    const formData = new FormData();
    formData.append('_replyto', orderData.customerEmail);
    formData.append('_subject', `Payment Received - Order #${orderData.id}`);
    formData.append('_template', 'table');
    formData.append('Order_ID', orderData.id.toString());
    formData.append('Payment_Status', '✅ DEPOSIT PAID');
    formData.append('Payment_Amount', `£${orderData.depositAmount}`);
    formData.append('Stripe_Payment_ID', paymentIntentId);
    formData.append('Customer_Name', orderData.customerName);
    formData.append('Customer_Email', orderData.customerEmail);
    formData.append('Customer_Phone', orderData.customerPhone);
    formData.append('Product_Type', orderData.productType);
    formData.append('Collection_Date', orderData.collectionDate);
    formData.append('Payment_Date', new Date().toLocaleDateString('en-GB'));

    const response = await fetch('https://formspree.io/f/xpzgrkek', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      console.log('Payment confirmation sent successfully to normanbakes38@gmail.com');
      return true;
    } else {
      console.error('Failed to send payment confirmation:', response.statusText);
      return false;
    }
  } catch (error) {
    console.error('Payment confirmation failed:', error);
    return false;
  }
}

// Permanent free email solution using Formspree
async function sendEmailNotification(orderData: any) {
  try {
    // Use Formspree's free service to send emails directly to your inbox
    const formData = new FormData();
    formData.append('_replyto', orderData.customerEmail);
    formData.append('_subject', `New Cake Order - ${orderData.productType}`);
    formData.append('_template', 'table');
    formData.append('Order_ID', orderData.id.toString());
    formData.append('Customer_Name', orderData.customerName);
    formData.append('Customer_Email', orderData.customerEmail);
    formData.append('Customer_Phone', orderData.customerPhone);
    formData.append('Collection_Date', orderData.collectionDate);
    formData.append('Product_Type', orderData.productType);
    formData.append('Product_Details', orderData.productDetails);
    formData.append('Special_Requirements', orderData.specialRequirements || 'None');
    formData.append('Deposit_Amount', `£${orderData.depositAmount}`);
    formData.append('Payment_Status', orderData.paymentStatus);
    formData.append('Order_Date', new Date(orderData.createdAt).toLocaleDateString('en-GB'));

    const response = await fetch('https://formspree.io/f/xpzgrkek', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      console.log('Order notification sent successfully to normanbakes38@gmail.com');
      return true;
    } else {
      console.error('Failed to send order notification:', response.statusText);
      return false;
    }
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

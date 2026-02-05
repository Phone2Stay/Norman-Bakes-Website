const nodemailer = require('nodemailer');

let orderCounter = Date.now();

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const orderData = JSON.parse(event.body);
    
    const {
      customerName,
      customerEmail,
      customerPhone,
      collectionDate,
      productType,
      productDetails,
      specialRequirements,
      extras,
      totalAmount,
    } = orderData;

    if (!customerName || !customerEmail || !customerPhone || !collectionDate || !productType || !productDetails) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ message: 'Missing required fields' }),
      };
    }

    const orderId = ++orderCounter;
    const order = {
      id: orderId,
      customerName,
      customerEmail,
      customerPhone,
      collectionDate,
      productType,
      productDetails,
      specialRequirements: specialRequirements || '',
      extras: extras || 'none',
      totalAmount,
      stripePaymentIntentId: null,
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
    };

    console.log('Order created:', JSON.stringify(order, null, 2));

    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.formsubmit.co',
        port: 587,
        secure: false,
        auth: {
          user: 'normanbakes38@gmail.com',
          pass: process.env.FORMSUBMIT_TOKEN || '',
        },
      });

      const emailContent = `
New Order Received!

Order ID: ${orderId}
Customer: ${customerName}
Email: ${customerEmail}
Phone: ${customerPhone}
Collection Date: ${collectionDate}
Product: ${productType}
Details: ${productDetails}
Special Requirements: ${specialRequirements || 'None'}
Extras: ${extras || 'None'}
Total Amount: £${totalAmount}

Order placed at: ${order.createdAt}
      `.trim();

      await transporter.sendMail({
        from: 'normanbakes38@gmail.com',
        to: 'normanbakes38@gmail.com',
        subject: `New Order #${orderId} from ${customerName}`,
        text: emailContent,
      });

      console.log('Email notification sent');
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(order),
    };
  } catch (error) {
    console.error('Error creating order:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ message: 'Failed to create order' }),
    };
  }
};

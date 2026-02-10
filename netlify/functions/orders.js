let orderCounter = Date.now();

async function sendEmailNotification(order) {
  const emailBody = `NEW CAKE ORDER RECEIVED

Order ID: ${order.id}
Date Placed: ${new Date(order.createdAt).toLocaleDateString('en-GB')}

Customer Information:
- Name: ${order.customerName}
- Email: ${order.customerEmail}
- Phone: ${order.customerPhone}

Product Details:
- Product Type: ${order.productType}
- Description: ${order.productDetails}
- Collection Date: ${order.collectionDate}
- Special Requirements: ${order.specialRequirements || 'None'}
- Extras: ${order.extras && order.extras !== 'none' ? order.extras : 'None'}

Payment Information:
- Total Amount: £${order.totalAmount}
- Payment Status: ${order.paymentStatus}`;

  const formBody = new URLSearchParams();
  formBody.append('name', order.customerName);
  formBody.append('email', order.customerEmail);
  formBody.append('phone', order.customerPhone);
  formBody.append('message', emailBody);
  formBody.append('_subject', `New Cake Order #${order.id} - ${order.productType}`);
  formBody.append('_captcha', 'false');
  formBody.append('_template', 'table');

  const response = await fetch('https://formsubmit.co/ajax/normanbakes38@gmail.com', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
    },
    body: formBody.toString(),
  });

  const result = await response.json();
  console.log('FormSubmit response:', JSON.stringify(result));
  return response.ok && result.success !== 'false';
}

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

    let emailSent = false;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        emailSent = await sendEmailNotification(order);
        if (emailSent) {
          console.log(`Email sent successfully on attempt ${attempt}`);
          break;
        }
      } catch (emailError) {
        console.error(`Email attempt ${attempt} failed:`, emailError.message);
      }
    }

    if (!emailSent) {
      console.error(`EMAIL FAILED for order #${orderId} - Order details logged above`);
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

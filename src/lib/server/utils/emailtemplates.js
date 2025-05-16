import {ADMIN_PANEL_URL} from "$env/static/private"
import {PUBLIC_WEBSITE_NAME,PUBLIC_WEBSITE_URL} from "$env/static/public"
function formatDate(isoString) {
       if( isoString === undefined) return "NA"
       const [date, time] = isoString.split('T');
       const [year, month, day] = date.split('-');
       return `${day}/${month}/${year}`;
}

export const orderMsgToAdmin = (record,firstname,lastname)=>{
    const {orderid,createdAt,totalprice,currency} = record
    return `
  <table width="100%" cellpadding="0" cellspacing="0" style="padding: 30px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.1); overflow: hidden;">
          <tr>
            <td style="background-color: #ec3916; display: flex; justify-content: space-between; align-items: center; color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 18px; color:white;">New Order Created</h1>
              <p style="margin: 5px 0 0; font-weight: 600;">Order # <strong>3</strong></p>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px;">
              <p style="font-size: 16px;">Hello,</p>
              <p style="font-size: 16px;">A new order has been successfully created in the system.</p>

              <h3 style="margin-top: 20px; color: #ec3916;">Order Details:</h3>
              <ul style="list-style: none; padding-left: 0; font-size: 14px;">
                <li>Order Number :<strong> ${orderid}</strong></li>
                <li>Customer Name :<strong> ${firstname} ${lastname}</strong></li>
                <li>Order Date :<strong> ${formatDate(createdAt)}</strong></li>
                <li>Total Amount :<strong> ${currency === "INR" ? "₹": "$"}${totalprice.toLocaleString("en-IN",{maximumFractionDigits:2,minimumFractionDigits:2})}</strong></li>
              </ul>

              <div style="margin-top: 30px; text-align: center;">
                <a href="${ADMIN_PANEL_URL}/dashboard/orders/${orderid}" style="display: inline-block; padding: 12px 24px; background-color: #ec3916; color: white; text-decoration: none; border-radius: 5px; font-size: 14px; ">View Order Details</a>
              </div>

              <p style="margin-top: 20px; color: #999; font-size: 12px; text-align: center;">This is an automated message. Please do not reply.</p>
              <p style=" color: #ec3916; font-size: 14px; font-weight: 700; text-align: center;">${PUBLIC_WEBSITE_NAME}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`
}

export const orderMsgToUser = (record,firstname,lastname)=>{
    const {orderid,createdAt,totalprice,currency,userEmail} = record
    return `<table width="100%" cellpadding="0" cellspacing="0" style="padding: 30px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.05); overflow: hidden;">
          <!-- Header / Logo -->
          <tr>
            <td style="background-color: #ec3916; padding: 10px; display: flex; justify-content: space-between; align-items: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">${PUBLIC_WEBSITE_NAME}</h1>
              <p style="color: white;">Order Confirmation</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 24px;">
              <p style="font-size: 16px; color: #333;">Hi ${firstname} ${lastname},</p>
              <p style="font-size: 16px; color: #333;">Thank you for your order! We’ve received your order and are now processing it. Here are your order details:</p>

              <!-- Order Summary -->
              <h3 style="color: #ec3916; margin-top: 20px; font-size: 16px;">Order Summary</h3>
              <ul style="margin: 0; padding: 0; list-style: none; font-size: 14px;">
                <li style="height: 25px;  display: flex; justify-content: space-between; align-items: center;">
                  <p><strong>Order Number:</strong></p>
                  <p>#${orderid}</p>
                </li>
                <li style="height: 25px; display: flex; justify-content: space-between; align-items: center;">
                  <p><strong>Order Date:</strong></p>
                  <p>${formatDate(createdAt)}</p>
                </li>
                <li style="height: 25px; display: flex; justify-content: space-between; align-items: center;">
                  <p><strong>Total Amount:</strong></p>
                  <p>${currency === "INR" ? "₹": "$"}${totalprice.toLocaleString("en-IN",{maximumFractionDigits:2,minimumFractionDigits:2})}</p>
                </li>
              </ul>

              <!-- CTA Button -->
              <div style="margin-top: 20px; text-align: center;">
                <a href="${PUBLIC_WEBSITE_URL}/order-status/${orderid}?email=${userEmail}" style="background-color: #ec3916; color: #ffffff; font-size: 15px; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                  View Your Order
                </a>
              </div>

              <!-- Footer -->
              <p style="margin-top: 40px; font-size: 14px; color: #666;">
                If you have any questions, feel free to contact our support team.
              </p>
              <p style="font-size: 12px; color: #aaa;">
                &copy; ${new Date().getFullYear()} ${PUBLIC_WEBSITE_NAME}. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`
}

export const cancelOrderMsgToAdmin = (orderId,firstname,lastname,email,createdAt)=>{

  return `
  <div style="max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
    
    <!-- Header -->
    <div style="background-color: red; color: #ffffff; padding: 10px; text-align: center;">
      <h1 style="margin: 0; font-size: 18px;">Order Cancellation</h1>
    </div>
    
    <!-- Content -->
    <div style="padding: 30px;">
      <h2 style="color: #333333; font-size: 17px; margin-top: 0;">Hello Admin,</h2>
      <p style="margin: 10px 0 20px;">The following order has been <strong>Canceled</strong> by the customer in ${PUBLIC_WEBSITE_NAME}</p>
      
      <!-- Order Details -->
      <div style="margin: 10px 0; background-color: #f1f1f1; padding: 15px; border-radius: 5px;">
        <p style="margin: 5px 0;"><strong>Order ID :</strong> #${orderId}</p>
        <p style="margin: 5px 0;"><strong>Customer Name :</strong> ${firstname} ${lastname}</p>
        <p style="margin: 5px 0;"><strong>Email :</strong> ${email}</p>
        <p style="margin: 5px 0;"><strong>Order Date :</strong> ${formatDate(createdAt)}</p>
      </div>

      <!-- Button -->
      <a href="${ADMIN_PANEL_URL}/dashboard/orders?search=${orderId}" 
         style="display: inline-block; padding: 10px 20px; font-size: 14px; background-color: red; color: #ffffff; text-decoration: none; border-radius: 4px; margin-top: 10px;">
         View Order
      </a>
    </div>

    <!-- Footer -->
    <div style="text-align: center; font-size: 12px; color: #777777; padding: 8px;">
      &copy; ${new Date().getFullYear()} ${PUBLIC_WEBSITE_NAME}. All rights reserved.
    </div>
  </div>`
}


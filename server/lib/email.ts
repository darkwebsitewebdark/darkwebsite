/**
 * Email Notification Module
 * 
 * This module handles all email notifications using Resend API
 * 
 * Email Templates:
 * 1. Welcome Email (new user registration)
 * 2. Order Confirmation (order placed)
 * 3. Payment Confirmation (payment received)
 * 4. Shipping Notification (order shipped)
 * 5. Seller Application (new seller application)
 * 6. Seller Approved (seller approved by admin)
 * 7. Withdrawal Request (seller withdrawal request)
 * 
 * Usage:
 * import { sendWelcomeEmail, sendOrderConfirmation } from './lib/email';
 * await sendWelcomeEmail(user.email, user.name);
 */

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Send email using Resend API
 * Requires RESEND_API_KEY environment variable
 */
async function sendEmail({ to, subject, html }: EmailOptions): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    console.warn('[Email] RESEND_API_KEY not configured. Email not sent.');
    return false;
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'StreetMarket <noreply@streetmarket.com>',
        to,
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[Email] Failed to send:', error);
      return false;
    }

    console.log('[Email] Sent successfully to:', to);
    return true;
  } catch (error) {
    console.error('[Email] Error:', error);
    return false;
  }
}

/**
 * Email Template: Welcome Email
 */
export async function sendWelcomeEmail(email: string, name: string): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔥 ยินดีต้อนรับสู่ StreetMarket!</h1>
        </div>
        <div class="content">
          <h2>สวัสดี ${name}!</h2>
          <p>ขอบคุณที่สมัครสมาชิกกับ StreetMarket - ตลาดออนไลน์สไตล์วัยรุ่น</p>
          <p>คุณสามารถเริ่มซื้อสินค้าได้ทันที หรือสมัครเป็นผู้ขายเพื่อเริ่มต้นธุรกิจของคุณ</p>
          <a href="https://streetmarket.vercel.app/products" class="button">เริ่มช้อปปิ้ง</a>
          <h3>สิ่งที่คุณสามารถทำได้:</h3>
          <ul>
            <li>🛍️ ซื้อสินค้าจากผู้ขายหลากหลายร้าน</li>
            <li>💰 ชำระเงินผ่าน PromptPay QR Code</li>
            <li>💬 แชทกับผู้ขายโดยตรง</li>
            <li>🏪 สมัครเป็นผู้ขายและเริ่มต้นธุรกิจ</li>
          </ul>
        </div>
        <div class="footer">
          <p>© 2025 StreetMarket. All rights reserved.</p>
          <p><a href="https://streetmarket.vercel.app/terms">ข้อกำหนดการใช้งาน</a> | <a href="https://streetmarket.vercel.app/privacy">นโยบายความเป็นส่วนตัว</a></p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: '🔥 ยินดีต้อนรับสู่ StreetMarket!',
    html,
  });
}

/**
 * Email Template: Order Confirmation
 */
export async function sendOrderConfirmation(
  email: string,
  orderData: {
    orderNumber: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    total: number;
    shippingAddress: string;
  }
): Promise<boolean> {
  const itemsHtml = orderData.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">฿${item.price.toLocaleString()}</td>
      </tr>
    `
    )
    .join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #dc2626 0%, #ea580c 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; background: white; }
        th { background: #f3f4f6; padding: 12px; text-align: left; }
        .total { font-size: 20px; font-weight: bold; color: #dc2626; text-align: right; margin-top: 20px; }
        .button { display: inline-block; background: #dc2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ ยืนยันคำสั่งซื้อ</h1>
          <p>คำสั่งซื้อ #${orderData.orderNumber}</p>
        </div>
        <div class="content">
          <h2>ขอบคุณสำหรับคำสั่งซื้อ!</h2>
          <p>เราได้รับคำสั่งซื้อของคุณแล้ว และกำลังดำเนินการจัดส่ง</p>
          
          <h3>รายการสินค้า:</h3>
          <table>
            <thead>
              <tr>
                <th>สินค้า</th>
                <th style="text-align: center;">จำนวน</th>
                <th style="text-align: right;">ราคา</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          
          <div class="total">ยอดรวม: ฿${orderData.total.toLocaleString()}</div>
          
          <h3>ที่อยู่จัดส่ง:</h3>
          <p>${orderData.shippingAddress}</p>
          
          <a href="https://streetmarket.vercel.app/orders" class="button">ดูคำสั่งซื้อ</a>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `✅ ยืนยันคำสั่งซื้อ #${orderData.orderNumber}`,
    html,
  });
}

/**
 * Email Template: Payment Confirmation
 */
export async function sendPaymentConfirmation(
  email: string,
  paymentData: {
    orderNumber: string;
    amount: number;
    paymentMethod: string;
    transactionRef: string;
  }
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .success-icon { font-size: 60px; margin: 20px 0; }
        .amount { font-size: 32px; font-weight: bold; color: #10b981; margin: 20px 0; }
        .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="success-icon">✅</div>
          <h1>ชำระเงินสำเร็จ!</h1>
        </div>
        <div class="content">
          <div class="amount">฿${paymentData.amount.toLocaleString()}</div>
          
          <div class="info-box">
            <p><strong>คำสั่งซื้อ:</strong> #${paymentData.orderNumber}</p>
            <p><strong>วิธีชำระเงิน:</strong> ${paymentData.paymentMethod}</p>
            <p><strong>หมายเลขอ้างอิง:</strong> ${paymentData.transactionRef}</p>
          </div>
          
          <p>เราได้รับการชำระเงินของคุณแล้ว ผู้ขายจะดำเนินการจัดส่งสินค้าในไม่ช้า</p>
          <p>คุณสามารถติดตามสถานะการจัดส่งได้ที่หน้าคำสั่งซื้อ</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `✅ ชำระเงินสำเร็จ - คำสั่งซื้อ #${paymentData.orderNumber}`,
    html,
  });
}

/**
 * Email Template: Shipping Notification
 */
export async function sendShippingNotification(
  email: string,
  shippingData: {
    orderNumber: string;
    trackingNumber: string;
    carrier: string;
    estimatedDelivery: string;
  }
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .tracking-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
        .tracking-number { font-size: 24px; font-weight: bold; color: #3b82f6; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📦 สินค้าของคุณกำลังจัดส่ง!</h1>
        </div>
        <div class="content">
          <p>คำสั่งซื้อ #${shippingData.orderNumber} ของคุณได้ถูกจัดส่งแล้ว</p>
          
          <div class="tracking-box">
            <p><strong>ขนส่ง:</strong> ${shippingData.carrier}</p>
            <p><strong>เลขพัสดุ:</strong></p>
            <div class="tracking-number">${shippingData.trackingNumber}</div>
            <p><strong>วันที่คาดว่าจะได้รับ:</strong> ${shippingData.estimatedDelivery}</p>
          </div>
          
          <p>คุณสามารถติดตามสถานะพัสดุได้ที่เว็บไซต์ของขนส่ง</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `📦 สินค้าของคุณกำลังจัดส่ง - #${shippingData.orderNumber}`,
    html,
  });
}

/**
 * Email Template: Seller Application
 */
export async function sendSellerApplicationEmail(
  email: string,
  name: string
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📝 ได้รับใบสมัครผู้ขายแล้ว</h1>
        </div>
        <div class="content">
          <h2>สวัสดี ${name}!</h2>
          <p>เราได้รับใบสมัครผู้ขายของคุณแล้ว</p>
          <p>ทีมงานจะตรวจสอบข้อมูลและดำเนินการอนุมัติภายใน 1-3 วันทำการ</p>
          <p>คุณจะได้รับอีเมลแจ้งเตือนเมื่อบัญชีผู้ขายของคุณได้รับการอนุมัติ</p>
          
          <h3>ขั้นตอนต่อไป:</h3>
          <ul>
            <li>รอการตรวจสอบจากทีมงาน</li>
            <li>เตรียมข้อมูลร้านค้าและสินค้า</li>
            <li>เตรียมบัญชีธนาคารสำหรับรับเงิน</li>
          </ul>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: '📝 ได้รับใบสมัครผู้ขาย - StreetMarket',
    html,
  });
}

/**
 * Email Template: Seller Approved
 */
export async function sendSellerApprovedEmail(
  email: string,
  name: string
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 ยินดีด้วย! บัญชีผู้ขายได้รับการอนุมัติ</h1>
        </div>
        <div class="content">
          <h2>สวัสดี ${name}!</h2>
          <p>ยินดีด้วย! บัญชีผู้ขายของคุณได้รับการอนุมัติแล้ว</p>
          <p>คุณสามารถเริ่มต้นเพิ่มสินค้าและขายบน StreetMarket ได้ทันที</p>
          
          <a href="https://streetmarket.vercel.app/seller" class="button">ไปที่ Seller Dashboard</a>
          
          <h3>เริ่มต้นขายสินค้า:</h3>
          <ul>
            <li>เพิ่มสินค้าของคุณ</li>
            <li>ตั้งราคาและจัดการสต็อก</li>
            <li>รับคำสั่งซื้อและจัดส่ง</li>
            <li>รับเงินเข้ากระเป๋าเงิน</li>
          </ul>
          
          <p>หากมีคำถาม สามารถติดต่อทีมงานได้ตลอดเวลา</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: '🎉 บัญชีผู้ขายได้รับการอนุมัติ - StreetMarket',
    html,
  });
}

/**
 * Email Template: Withdrawal Request
 */
export async function sendWithdrawalRequestEmail(
  email: string,
  withdrawalData: {
    amount: number;
    bankAccount: string;
    requestDate: string;
  }
): Promise<boolean> {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
        .amount { font-size: 32px; font-weight: bold; color: #8b5cf6; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>💰 ได้รับคำขอถอนเงิน</h1>
        </div>
        <div class="content">
          <p>เราได้รับคำขอถอนเงินของคุณแล้ว</p>
          
          <div class="amount">฿${withdrawalData.amount.toLocaleString()}</div>
          
          <p><strong>บัญชีธนาคาร:</strong> ${withdrawalData.bankAccount}</p>
          <p><strong>วันที่ขอถอน:</strong> ${withdrawalData.requestDate}</p>
          
          <p>ทีมงานจะดำเนินการโอนเงินภายใน 1-3 วันทำการ</p>
          <p>คุณจะได้รับอีเมลแจ้งเตือนเมื่อการโอนเงินสำเร็จ</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: '💰 ได้รับคำขอถอนเงิน - StreetMarket',
    html,
  });
}

// Export all functions
export default {
  sendWelcomeEmail,
  sendOrderConfirmation,
  sendPaymentConfirmation,
  sendShippingNotification,
  sendSellerApplicationEmail,
  sendSellerApprovedEmail,
  sendWithdrawalRequestEmail,
};

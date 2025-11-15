/**
 * Email Notification Module
 * 
 * This module provides email sending functionality using Resend API.
 * 
 * To enable email notifications:
 * 1. Sign up at https://resend.com
 * 2. Get your API key
 * 3. Add RESEND_API_KEY to environment variables
 * 4. Verify your domain (or use onboarding@resend.dev for testing)
 */

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Send email using Resend API
 */
export async function sendEmail({ to, subject, html }: EmailOptions): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey) {
    console.warn('[Email] RESEND_API_KEY not set - email not sent');
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
        from: process.env.EMAIL_FROM || 'StreetMarket <onboarding@resend.dev>',
        to: [to],
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
 * Email Templates
 */

export function orderConfirmationEmail(data: {
  customerName: string;
  orderNumber: string;
  orderTotal: number;
  items: Array<{ name: string; quantity: number; price: number }>;
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .order-details { background: white; padding: 15px; margin: 20px 0; border-radius: 8px; }
        .item { padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
        .total { font-size: 1.2em; font-weight: bold; margin-top: 15px; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 0.9em; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 ยืนยันคำสั่งซื้อ</h1>
        </div>
        
        <div class="content">
          <p>สวัสดีคุณ ${data.customerName},</p>
          <p>ขอบคุณที่ใช้บริการ StreetMarket! เราได้รับคำสั่งซื้อของคุณเรียบร้อยแล้ว</p>
          
          <div class="order-details">
            <h2>รายละเอียดคำสั่งซื้อ #${data.orderNumber}</h2>
            
            ${data.items.map(item => `
              <div class="item">
                <div>${item.name}</div>
                <div>จำนวน: ${item.quantity} x ฿${item.price.toLocaleString()}</div>
              </div>
            `).join('')}
            
            <div class="total">
              ยอดรวมทั้งหมด: ฿${data.orderTotal.toLocaleString()}
            </div>
          </div>
          
          <p>เราจะดำเนินการจัดส่งสินค้าให้คุณโดยเร็วที่สุด</p>
          <p>คุณสามารถติดตามสถานะคำสั่งซื้อได้ที่หน้า "คำสั่งซื้อของฉัน"</p>
        </div>
        
        <div class="footer">
          <p>© 2025 StreetMarket. All rights reserved.</p>
          <p>หากมีคำถามติดต่อเราได้ที่ support@streetmarket.com</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function paymentReceivedEmail(data: {
  customerName: string;
  orderNumber: string;
  amount: number;
  paymentMethod: string;
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #10B981; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .payment-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; }
        .amount { font-size: 2em; font-weight: bold; color: #10B981; margin: 10px 0; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 0.9em; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ ชำระเงินสำเร็จ</h1>
        </div>
        
        <div class="content">
          <p>สวัสดีคุณ ${data.customerName},</p>
          <p>เราได้รับการชำระเงินของคุณเรียบร้อยแล้ว</p>
          
          <div class="payment-box">
            <div>คำสั่งซื้อ #${data.orderNumber}</div>
            <div class="amount">฿${data.amount.toLocaleString()}</div>
            <div>ชำระผ่าน: ${data.paymentMethod}</div>
          </div>
          
          <p>ผู้ขายจะดำเนินการจัดส่งสินค้าให้คุณโดยเร็วที่สุด</p>
          <p>คุณจะได้รับอีเมลแจ้งเตือนเมื่อสินค้าถูกจัดส่งแล้ว</p>
        </div>
        
        <div class="footer">
          <p>© 2025 StreetMarket. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function orderShippedEmail(data: {
  customerName: string;
  orderNumber: string;
  trackingNumber: string;
  shippingProvider: string;
  estimatedDelivery: string;
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #3B82F6; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .tracking-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; }
        .tracking-number { font-size: 1.5em; font-weight: bold; color: #3B82F6; margin: 10px 0; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 0.9em; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📦 สินค้าถูกจัดส่งแล้ว</h1>
        </div>
        
        <div class="content">
          <p>สวัสดีคุณ ${data.customerName},</p>
          <p>ดีข่าว! คำสั่งซื้อของคุณถูกจัดส่งแล้ว</p>
          
          <div class="tracking-box">
            <div>คำสั่งซื้อ #${data.orderNumber}</div>
            <div class="tracking-number">${data.trackingNumber}</div>
            <div>ขนส่งโดย: ${data.shippingProvider}</div>
            <div>กำหนดส่งถึง: ${data.estimatedDelivery}</div>
          </div>
          
          <p>คุณสามารถติดตามพัสดุได้ที่เว็บไซต์ ${data.shippingProvider}</p>
        </div>
        
        <div class="footer">
          <p>© 2025 StreetMarket. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function sellerApplicationStatusEmail(data: {
  sellerName: string;
  status: 'approved' | 'rejected';
  reason?: string;
}): string {
  const isApproved = data.status === 'approved';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: ${isApproved ? '#10B981' : '#EF4444'}; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .status-box { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; text-align: center; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 0.9em; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>${isApproved ? '🎉 ยินดีต้อนรับสู่ StreetMarket!' : '❌ คำขอถูกปฏิเสธ'}</h1>
        </div>
        
        <div class="content">
          <p>สวัสดีคุณ ${data.sellerName},</p>
          
          ${isApproved ? `
            <p>ยินดีด้วย! คำขอเปิดร้านค้าของคุณได้รับการอนุมัติแล้ว</p>
            <div class="status-box">
              <h2>คุณสามารถเริ่มขายสินค้าได้แล้ว!</h2>
              <p>เข้าสู่ระบบและไปที่ "แดชบอร์ดผู้ขาย" เพื่อเริ่มเพิ่มสินค้า</p>
            </div>
          ` : `
            <p>ขออภัย คำขอเปิดร้านค้าของคุณไม่ผ่านการพิจารณา</p>
            ${data.reason ? `
              <div class="status-box">
                <h3>เหตุผล:</h3>
                <p>${data.reason}</p>
              </div>
            ` : ''}
            <p>คุณสามารถส่งคำขอใหม่ได้อีกครั้งหลังจากแก้ไขข้อมูล</p>
          `}
        </div>
        
        <div class="footer">
          <p>© 2025 StreetMarket. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Helper functions to send specific emails
 */

export async function sendOrderConfirmation(
  email: string,
  data: Parameters<typeof orderConfirmationEmail>[0]
): Promise<boolean> {
  return sendEmail({
    to: email,
    subject: `ยืนยันคำสั่งซื้อ #${data.orderNumber} - StreetMarket`,
    html: orderConfirmationEmail(data),
  });
}

export async function sendPaymentReceived(
  email: string,
  data: Parameters<typeof paymentReceivedEmail>[0]
): Promise<boolean> {
  return sendEmail({
    to: email,
    subject: `ชำระเงินสำเร็จ #${data.orderNumber} - StreetMarket`,
    html: paymentReceivedEmail(data),
  });
}

export async function sendOrderShipped(
  email: string,
  data: Parameters<typeof orderShippedEmail>[0]
): Promise<boolean> {
  return sendEmail({
    to: email,
    subject: `สินค้าถูกจัดส่งแล้ว #${data.orderNumber} - StreetMarket`,
    html: orderShippedEmail(data),
  });
}

export async function sendSellerApplicationStatus(
  email: string,
  data: Parameters<typeof sellerApplicationStatusEmail>[0]
): Promise<boolean> {
  return sendEmail({
    to: email,
    subject: data.status === 'approved' 
      ? 'ยินดีต้อนรับสู่ StreetMarket - คำขอได้รับการอนุมัติ'
      : 'คำขอเปิดร้านค้า - StreetMarket',
    html: sellerApplicationStatusEmail(data),
  });
}

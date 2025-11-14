import crypto from 'crypto';

/**
 * Generate PromptPay QR Code payload
 * Based on EMVCo Specification
 */

function crc16(data: string): string {
  let crc = 0xFFFF;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
    }
  }
  return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
}

function formatTag(tag: string, value: string): string {
  const length = value.length.toString().padStart(2, '0');
  return `${tag}${length}${value}`;
}

export interface PromptPayOptions {
  phoneNumber?: string;
  nationalId?: string;
  amount?: number;
  ref1?: string;
  ref2?: string;
}

export function generatePromptPayQR(options: PromptPayOptions): string {
  const { phoneNumber, nationalId, amount, ref1, ref2 } = options;

  if (!phoneNumber && !nationalId) {
    throw new Error('Either phoneNumber or nationalId is required');
  }

  // Build payload
  let payload = '';

  // Payload Format Indicator
  payload += formatTag('00', '01');

  // Point of Initiation Method (Static QR)
  payload += formatTag('01', '12');

  // Merchant Account Information
  let merchantInfo = '';
  merchantInfo += formatTag('00', 'A000000677010111'); // AID
  
  if (phoneNumber) {
    // Remove leading 0 and add country code
    const phone = phoneNumber.replace(/^0/, '66');
    merchantInfo += formatTag('01', phone);
  } else if (nationalId) {
    merchantInfo += formatTag('02', nationalId);
  }

  payload += formatTag('29', merchantInfo);

  // Transaction Currency (THB)
  payload += formatTag('53', '764');

  // Transaction Amount
  if (amount && amount > 0) {
    payload += formatTag('54', amount.toFixed(2));
  }

  // Country Code
  payload += formatTag('58', 'TH');

  // Additional Data Field
  if (ref1 || ref2) {
    let additionalData = '';
    if (ref1) {
      additionalData += formatTag('01', ref1);
    }
    if (ref2) {
      additionalData += formatTag('02', ref2);
    }
    payload += formatTag('62', additionalData);
  }

  // CRC (placeholder)
  payload += '6304';

  // Calculate and append CRC
  const checksum = crc16(payload);
  payload += checksum;

  return payload;
}

/**
 * Generate unique reference number using decimal
 * Format: XXX.YY where XXX = user/transaction ID, YY = random decimal
 */
export function generateRefNumber(userId: number, transactionId?: number): string {
  const baseId = transactionId || userId;
  const decimal = Math.floor(Math.random() * 100);
  return `${baseId}.${decimal.toString().padStart(2, '0')}`;
}

/**
 * Parse reference number to extract user/transaction ID
 */
export function parseRefNumber(refNumber: string): { baseId: number; decimal: number } {
  const parts = refNumber.split('.');
  return {
    baseId: parseInt(parts[0]),
    decimal: parseInt(parts[1] || '0'),
  };
}

/**
 * Verify payment amount with reference number
 * The decimal part should match the reference
 */
export function verifyPaymentAmount(amount: number, refNumber: string): boolean {
  const { decimal } = parseRefNumber(refNumber);
  const amountDecimal = Math.round((amount % 1) * 100);
  return amountDecimal === decimal;
}

/**
 * Generate QR Code data URL using external service
 * In production, you might want to use a proper QR code library
 */
export function generateQRCodeDataURL(payload: string): string {
  // Using Google Charts API for QR code generation
  const size = '300x300';
  const url = `https://chart.googleapis.com/chart?cht=qr&chs=${size}&chl=${encodeURIComponent(payload)}`;
  return url;
}

/**
 * Create PromptPay payment request
 */
export interface PaymentRequest {
  userId: number;
  amount: number;
  refNumber: string;
  qrPayload: string;
  qrCodeUrl: string;
  expiresAt: Date;
}

export function createPaymentRequest(
  userId: number,
  amount: number,
  promptPayId: string
): PaymentRequest {
  // Generate unique reference with decimal
  const refNumber = generateRefNumber(userId);
  
  // Add decimal to amount for verification
  const { decimal } = parseRefNumber(refNumber);
  const finalAmount = amount + (decimal / 100);

  // Generate PromptPay QR
  const qrPayload = generatePromptPayQR({
    phoneNumber: promptPayId,
    amount: finalAmount,
    ref1: refNumber,
  });

  const qrCodeUrl = generateQRCodeDataURL(qrPayload);

  // Payment expires in 15 minutes
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  return {
    userId,
    amount: finalAmount,
    refNumber,
    qrPayload,
    qrCodeUrl,
    expiresAt,
  };
}

/**
 * Shipping Integration Module
 * Supports: Flash Express, Kerry Express, Thailand Post, J&T Express
 */

export interface ShippingRate {
  provider: string;
  serviceName: string;
  price: number; // in cents
  estimatedDays: number;
}

export interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
  province: string;
  district: string;
  subdistrict: string;
  postalCode: string;
}

export interface TrackingInfo {
  provider: string;
  trackingNumber: string;
  status: string;
  statusDescription: string;
  location?: string;
  timestamp: Date;
  history: Array<{
    status: string;
    description: string;
    location: string;
    timestamp: Date;
  }>;
}

/**
 * Calculate shipping rates from multiple providers
 */
export async function calculateShippingRates(
  origin: ShippingAddress,
  destination: ShippingAddress,
  weight: number, // in grams
  dimensions?: { length: number; width: number; height: number } // in cm
): Promise<ShippingRate[]> {
  const rates: ShippingRate[] = [];

  // Flash Express
  rates.push({
    provider: "flash",
    serviceName: "Flash Express Standard",
    price: calculateFlashRate(weight, origin.province, destination.province),
    estimatedDays: 2,
  });

  // Kerry Express
  rates.push({
    provider: "kerry",
    serviceName: "Kerry Express",
    price: calculateKerryRate(weight, origin.province, destination.province),
    estimatedDays: 2,
  });

  // Thailand Post
  rates.push(
    {
      provider: "thailandpost",
      serviceName: "EMS",
      price: calculateThailandPostEMS(weight),
      estimatedDays: 2,
    },
    {
      provider: "thailandpost",
      serviceName: "ลงทะเบียน",
      price: calculateThailandPostRegistered(weight),
      estimatedDays: 5,
    }
  );

  // J&T Express
  rates.push({
    provider: "jnt",
    serviceName: "J&T Express",
    price: calculateJNTRate(weight, origin.province, destination.province),
    estimatedDays: 3,
  });

  return rates.sort((a, b) => a.price - b.price);
}

/**
 * Flash Express rate calculation
 * Base rate: 35 THB for first 1kg, +5 THB per additional kg
 * Bangkok to Bangkok: -10 THB
 */
function calculateFlashRate(weight: number, originProvince: string, destProvince: string): number {
  const kg = Math.ceil(weight / 1000);
  let rate = 3500; // 35 THB in cents

  if (kg > 1) {
    rate += (kg - 1) * 500; // 5 THB per kg
  }

  // Discount for same province
  if (originProvince === destProvince) {
    rate -= 1000; // 10 THB discount
  }

  return rate;
}

/**
 * Kerry Express rate calculation
 * Base rate: 40 THB for first 1kg, +7 THB per additional kg
 */
function calculateKerryRate(weight: number, originProvince: string, destProvince: string): number {
  const kg = Math.ceil(weight / 1000);
  let rate = 4000; // 40 THB in cents

  if (kg > 1) {
    rate += (kg - 1) * 700; // 7 THB per kg
  }

  // Discount for same province
  if (originProvince === destProvince) {
    rate -= 1000; // 10 THB discount
  }

  return rate;
}

/**
 * Thailand Post EMS rate calculation
 * Base rate: 45 THB for first 500g, +15 THB per additional 500g
 */
function calculateThailandPostEMS(weight: number): number {
  const units = Math.ceil(weight / 500);
  let rate = 4500; // 45 THB for first 500g

  if (units > 1) {
    rate += (units - 1) * 1500; // 15 THB per 500g
  }

  return rate;
}

/**
 * Thailand Post Registered rate calculation
 * Base rate: 25 THB for first 1kg, +5 THB per additional kg
 */
function calculateThailandPostRegistered(weight: number): number {
  const kg = Math.ceil(weight / 1000);
  let rate = 2500; // 25 THB in cents

  if (kg > 1) {
    rate += (kg - 1) * 500; // 5 THB per kg
  }

  return rate;
}

/**
 * J&T Express rate calculation
 * Base rate: 38 THB for first 1kg, +6 THB per additional kg
 */
function calculateJNTRate(weight: number, originProvince: string, destProvince: string): number {
  const kg = Math.ceil(weight / 1000);
  let rate = 3800; // 38 THB in cents

  if (kg > 1) {
    rate += (kg - 1) * 600; // 6 THB per kg
  }

  // Discount for same province
  if (originProvince === destProvince) {
    rate -= 800; // 8 THB discount
  }

  return rate;
}

/**
 * Create shipping label (mock implementation)
 * In production, this would call actual provider APIs
 */
export async function createShippingLabel(
  provider: string,
  orderId: number,
  sender: ShippingAddress,
  recipient: ShippingAddress,
  weight: number,
  dimensions?: { length: number; width: number; height: number }
): Promise<{
  trackingNumber: string;
  labelUrl: string;
  cost: number;
}> {
  // Generate mock tracking number
  const prefix = {
    flash: "FLE",
    kerry: "KRY",
    thailandpost: "EMS",
    jnt: "JNT",
  }[provider] || "TRK";

  const trackingNumber = `${prefix}${Date.now()}${orderId}`;

  // In production, call actual API here
  // const response = await fetch(providerAPI, { ... });

  return {
    trackingNumber,
    labelUrl: `https://example.com/labels/${trackingNumber}.pdf`,
    cost: 0, // Would be returned from API
  };
}

/**
 * Track shipment (mock implementation)
 * In production, this would call actual provider APIs
 */
export async function trackShipment(
  provider: string,
  trackingNumber: string
): Promise<TrackingInfo> {
  // Mock tracking data
  const statuses = [
    { status: "pending", description: "รอรับพัสดุ", location: "คลังต้นทาง" },
    { status: "picked_up", description: "รับพัสดุแล้ว", location: "คลังต้นทาง" },
    { status: "in_transit", description: "อยู่ระหว่างการขนส่ง", location: "ศูนย์กระจายสินค้า" },
    { status: "out_for_delivery", description: "อยู่ระหว่างการจัดส่ง", location: "สาขาปลายทาง" },
    { status: "delivered", description: "จัดส่งสำเร็จ", location: "ที่อยู่ปลายทาง" },
  ];

  // Simulate current status (in production, get from API)
  const currentStatusIndex = Math.floor(Math.random() * statuses.length);
  const currentStatus = statuses[currentStatusIndex];

  const history = statuses.slice(0, currentStatusIndex + 1).map((s, i) => ({
    ...s,
    timestamp: new Date(Date.now() - (statuses.length - i) * 24 * 60 * 60 * 1000),
  }));

  return {
    provider,
    trackingNumber,
    status: currentStatus.status,
    statusDescription: currentStatus.description,
    location: currentStatus.location,
    timestamp: new Date(),
    history,
  };
}

/**
 * Get available shipping providers
 */
export function getShippingProviders(): Array<{
  id: string;
  name: string;
  logo: string;
  description: string;
}> {
  return [
    {
      id: "flash",
      name: "Flash Express",
      logo: "/logos/flash.png",
      description: "จัดส่งรวดเร็ว ราคาประหยัด",
    },
    {
      id: "kerry",
      name: "Kerry Express",
      logo: "/logos/kerry.png",
      description: "บริการจัดส่งมาตรฐานสูง",
    },
    {
      id: "thailandpost",
      name: "Thailand Post",
      logo: "/logos/thailandpost.png",
      description: "ไปรษณีย์ไทย บริการทั่วประเทศ",
    },
    {
      id: "jnt",
      name: "J&T Express",
      logo: "/logos/jnt.png",
      description: "จัดส่งรวดเร็ว ครอบคลุมทั่วไทย",
    },
  ];
}

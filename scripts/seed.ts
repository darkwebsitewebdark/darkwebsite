import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Categories data
const categories = [
  { name: 'อิเล็กทรอนิกส์', slug: 'electronics', image_url: '📱', display_order: 1 },
  { name: 'แฟชั่นผู้ชาย', slug: 'mens-fashion', image_url: '👔', display_order: 2 },
  { name: 'แฟชั่นผู้หญิง', slug: 'womens-fashion', image_url: '👗', display_order: 3 },
  { name: 'ความงาม', slug: 'beauty', image_url: '💄', display_order: 4 },
  { name: 'กีฬาและกิจกรรมกลางแจ้ง', slug: 'sports', image_url: '⚽', display_order: 5 },
  { name: 'บ้านและสวน', slug: 'home-garden', image_url: '🏠', display_order: 6 },
  { name: 'หนังสือและสื่อ', slug: 'books-media', image_url: '📚', display_order: 7 },
  { name: 'ของเล่นและงานอดิเรก', slug: 'toys-hobbies', image_url: '🎮', display_order: 8 },
  { name: 'อาหารและเครื่องดื่ม', slug: 'food-drinks', image_url: '🍔', display_order: 9 },
  { name: 'สุขภาพ', slug: 'health', image_url: '💊', display_order: 10 },
];

// Sample products
const products = [
  // Electronics
  {
    name: 'iPhone 15 Pro Max 256GB',
    description: 'iPhone รุ่นล่าสุด จอ 6.7 นิ้ว ชิป A17 Pro กล้อง 48MP พร้อม Titanium Design',
    price: 4499900, // 44,999 บาท
    stock: 50,
    category_slug: 'electronics',
    images: ['https://picsum.photos/seed/iphone15/800/800'],
    condition: 'new',
    brand: 'Apple',
    is_featured: true,
  },
  {
    name: 'Samsung Galaxy S24 Ultra 512GB',
    description: 'Galaxy S24 Ultra พร้อม S Pen ชิป Snapdragon 8 Gen 3 กล้อง 200MP',
    price: 4299900,
    stock: 30,
    category_slug: 'electronics',
    images: ['https://picsum.photos/seed/s24/800/800'],
    condition: 'new',
    brand: 'Samsung',
    is_featured: true,
  },
  {
    name: 'MacBook Air M3 13" 16GB/512GB',
    description: 'MacBook Air ชิป M3 จอ Liquid Retina 13.6 นิ้ว น้ำหนักเบา ทำงานเงียบ',
    price: 4699900,
    stock: 20,
    category_slug: 'electronics',
    images: ['https://picsum.photos/seed/macbookair/800/800'],
    condition: 'new',
    brand: 'Apple',
    is_featured: true,
  },
  {
    name: 'Sony WH-1000XM5 หูฟัง Noise Cancelling',
    description: 'หูฟังไร้สาย Noise Cancelling ระดับพรีเมียม เสียงคุณภาพสูง แบตเตอรี่ 30 ชม.',
    price: 1299000,
    stock: 100,
    category_slug: 'electronics',
    images: ['https://picsum.photos/seed/sony-headphone/800/800'],
    condition: 'new',
    brand: 'Sony',
  },
  {
    name: 'iPad Pro 12.9" M2 256GB',
    description: 'iPad Pro จอ Liquid Retina XDR 12.9 นิ้ว ชิป M2 รองรับ Apple Pencil',
    price: 4199900,
    stock: 25,
    category_slug: 'electronics',
    images: ['https://picsum.photos/seed/ipadpro/800/800'],
    condition: 'new',
    brand: 'Apple',
  },
  
  // Men's Fashion
  {
    name: 'เสื้อเชิ้ตผู้ชาย Oxford สีขาว',
    description: 'เสื้อเชิ้ตผ้า Oxford คุณภาพดี ใส่สบาย เหมาะกับทุกโอกาส',
    price: 59900,
    stock: 200,
    category_slug: 'mens-fashion',
    images: ['https://picsum.photos/seed/shirt1/800/800'],
    condition: 'new',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    name: 'กางเกงยีนส์ขายาว Slim Fit',
    description: 'กางเกงยีนส์ทรงสลิม ผ้ายืดหยุ่น ใส่สบาย ทนทาน',
    price: 89900,
    stock: 150,
    category_slug: 'mens-fashion',
    images: ['https://picsum.photos/seed/jeans1/800/800'],
    condition: 'new',
    sizes: ['28', '30', '32', '34', '36'],
  },
  {
    name: 'รองเท้าผ้าใบผู้ชาย Nike Air Max',
    description: 'รองเท้าผ้าใบ Nike Air Max ใส่สบาย ดีไซน์ทันสมัย',
    price: 349900,
    stock: 80,
    category_slug: 'mens-fashion',
    images: ['https://picsum.photos/seed/nike-shoes/800/800'],
    condition: 'new',
    brand: 'Nike',
    sizes: ['40', '41', '42', '43', '44'],
  },
  {
    name: 'นาฬิกาข้อมือผู้ชาย Seiko Automatic',
    description: 'นาฬิกาออโตเมติก Seiko คุณภาพสูง สายสแตนเลส กันน้ำ',
    price: 1299000,
    stock: 30,
    category_slug: 'mens-fashion',
    images: ['https://picsum.photos/seed/seiko-watch/800/800'],
    condition: 'new',
    brand: 'Seiko',
  },
  {
    name: 'กระเป๋าสะพายหนังแท้ผู้ชาย',
    description: 'กระเป๋าสะพายหนังแท้ ดีไซน์คลาสสิก ใส่ของได้เยอะ',
    price: 249900,
    stock: 50,
    category_slug: 'mens-fashion',
    images: ['https://picsum.photos/seed/leather-bag/800/800'],
    condition: 'new',
  },
  
  // Women's Fashion
  {
    name: 'เดรสผู้หญิง ลายดอกไม้',
    description: 'เดรสผ้าชีฟอง ลายดอกไม้สวย ใส่สบาย เหมาะกับฤดูร้อน',
    price: 79900,
    stock: 100,
    category_slug: 'womens-fashion',
    images: ['https://picsum.photos/seed/dress1/800/800'],
    condition: 'new',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    name: 'กระเป๋าถือผู้หญิง แบรนด์เนม',
    description: 'กระเป๋าถือหนังแท้ ดีไซน์หรูหรา เหมาะกับทุกโอกาส',
    price: 1599000,
    stock: 40,
    category_slug: 'womens-fashion',
    images: ['https://picsum.photos/seed/handbag1/800/800'],
    condition: 'new',
    is_featured: true,
  },
  {
    name: 'รองเท้าส้นสูงผู้หญิง',
    description: 'รองเท้าส้นสูง 3 นิ้ว ใส่สบาย ดีไซน์สวยหรู',
    price: 129900,
    stock: 60,
    category_slug: 'womens-fashion',
    images: ['https://picsum.photos/seed/heels1/800/800'],
    condition: 'new',
    sizes: ['35', '36', '37', '38', '39'],
  },
  {
    name: 'สร้อยคอทองคำ 96.5%',
    description: 'สร้อยคอทองคำแท้ 96.5% น้ำหนัก 2 สลึง ลายสวย',
    price: 3599000,
    stock: 10,
    category_slug: 'womens-fashion',
    images: ['https://picsum.photos/seed/gold-necklace/800/800'],
    condition: 'new',
  },
  {
    name: 'แว่นตากันแดดผู้หญิง',
    description: 'แว่นตากันแดด UV400 ดีไซน์ทันสมัย ใส่สบาย',
    price: 49900,
    stock: 120,
    category_slug: 'womens-fashion',
    images: ['https://picsum.photos/seed/sunglasses1/800/800'],
    condition: 'new',
  },
  
  // Beauty
  {
    name: 'เซรั่มวิตามินซี 20%',
    description: 'เซรั่มวิตามินซีเข้มข้น ช่วยผิวกระจ่างใส ลดจุดด่างดำ',
    price: 89900,
    stock: 200,
    category_slug: 'beauty',
    images: ['https://picsum.photos/seed/serum1/800/800'],
    condition: 'new',
    is_featured: true,
  },
  {
    name: 'ครีมกันแดด SPF50+ PA++++',
    description: 'ครีมกันแดดสูตรน้ำ ซึมซาบเร็ว ไม่เหนียวเหนอะหนะ',
    price: 59900,
    stock: 300,
    category_slug: 'beauty',
    images: ['https://picsum.photos/seed/sunscreen1/800/800'],
    condition: 'new',
  },
  {
    name: 'ลิปสติกเนื้อแมท สีแดง',
    description: 'ลิปสติกเนื้อแมท ติดทน ไม่หลุดลอก สีสวยสด',
    price: 39900,
    stock: 150,
    category_slug: 'beauty',
    images: ['https://picsum.photos/seed/lipstick1/800/800'],
    condition: 'new',
  },
  {
    name: 'น้ำหอมผู้หญิง Chanel No.5',
    description: 'น้ำหอมแบรนด์เนม กลิ่นหอมหรูหรา ติดทนนาน',
    price: 459900,
    stock: 50,
    category_slug: 'beauty',
    images: ['https://picsum.photos/seed/perfume1/800/800'],
    condition: 'new',
    brand: 'Chanel',
    is_featured: true,
  },
  {
    name: 'มาส์กหน้ากระดาษ 10 ชิ้น',
    description: 'มาส์กหน้ากระดาษ สารสกัดจากธรรมชาติ บำรุงผิวหน้า',
    price: 29900,
    stock: 500,
    category_slug: 'beauty',
    images: ['https://picsum.photos/seed/mask1/800/800'],
    condition: 'new',
  },
  
  // Sports
  {
    name: 'ดัมเบล 10kg คู่',
    description: 'ดัมเบลเคลือบยาง น้ำหนัก 10kg คู่ เหมาะสำหรับออกกำลังกาย',
    price: 149900,
    stock: 80,
    category_slug: 'sports',
    images: ['https://picsum.photos/seed/dumbbell/800/800'],
    condition: 'new',
  },
  {
    name: 'เสื้อกีฬา Dri-FIT',
    description: 'เสื้อกีฬาระบายอากาศดี ดูดซับเหงื่อ แห้งเร็ว',
    price: 49900,
    stock: 200,
    category_slug: 'sports',
    images: ['https://picsum.photos/seed/sportshirt/800/800'],
    condition: 'new',
    sizes: ['S', 'M', 'L', 'XL'],
  },
  {
    name: 'ลูกฟุตบอล FIFA Quality',
    description: 'ลูกฟุตบอลมาตรฐาน FIFA ใช้แข่งขันได้',
    price: 89900,
    stock: 100,
    category_slug: 'sports',
    images: ['https://picsum.photos/seed/football/800/800'],
    condition: 'new',
  },
  {
    name: 'เสื่อโยคะ 6mm',
    description: 'เสื่อโยคะหนา 6mm กันลื่น ใช้สบาย',
    price: 39900,
    stock: 150,
    category_slug: 'sports',
    images: ['https://picsum.photos/seed/yogamat/800/800'],
    condition: 'new',
  },
  {
    name: 'จักรยานเสือภูเขา 27.5"',
    description: 'จักรยานเสือภูเขา เกียร์ 21 สปีด เฟรมอลูมิเนียม',
    price: 1299000,
    stock: 30,
    category_slug: 'sports',
    images: ['https://picsum.photos/seed/bicycle/800/800'],
    condition: 'new',
  },
  
  // Home & Garden
  {
    name: 'โซฟา 3 ที่นั่ง ผ้ากำมะหยี่',
    description: 'โซฟา 3 ที่นั่ง ผ้ากำมะหยี่นุ่ม นั่งสบาย ดีไซน์ทันสมัย',
    price: 1599000,
    stock: 20,
    category_slug: 'home-garden',
    images: ['https://picsum.photos/seed/sofa1/800/800'],
    condition: 'new',
    is_featured: true,
  },
  {
    name: 'โต๊ะทำงานไม้โอ๊ค',
    description: 'โต๊ะทำงานไม้โอ๊คแท้ ขนาด 120x60cm มีลิ้นชัก',
    price: 899000,
    stock: 30,
    category_slug: 'home-garden',
    images: ['https://picsum.photos/seed/desk1/800/800'],
    condition: 'new',
  },
  {
    name: 'เครื่องฟอกอากาศ HEPA Filter',
    description: 'เครื่องฟอกอากาศ กรอง PM2.5 99.97% เหมาะกับห้อง 30 ตร.ม.',
    price: 699000,
    stock: 50,
    category_slug: 'home-garden',
    images: ['https://picsum.photos/seed/airpurifier/800/800'],
    condition: 'new',
  },
  {
    name: 'ชุดผ้าปูที่นอน 6 ฟุต',
    description: 'ชุดผ้าปูที่นอน ผ้าคอตตอน 100% นุ่มสบาย',
    price: 129900,
    stock: 100,
    category_slug: 'home-garden',
    images: ['https://picsum.photos/seed/bedsheet/800/800'],
    condition: 'new',
  },
  {
    name: 'ต้นไม้ประดับ มอนสเตอร่า',
    description: 'ต้นมอนสเตอร่า ขนาดกลาง ใบใหญ่สวยงาม',
    price: 59900,
    stock: 80,
    category_slug: 'home-garden',
    images: ['https://picsum.photos/seed/plant1/800/800'],
    condition: 'new',
  },
  
  // Books & Media
  {
    name: 'หนังสือ "ชีวิตดีเริ่มต้นที่ใจ"',
    description: 'หนังสือพัฒนาตนเอง เปลี่ยนชีวิตให้ดีขึ้น',
    price: 29900,
    stock: 200,
    category_slug: 'books-media',
    images: ['https://picsum.photos/seed/book1/800/800'],
    condition: 'new',
  },
  {
    name: 'PlayStation 5 Digital Edition',
    description: 'เครื่องเกม PS5 Digital Edition พร้อมจอย DualSense',
    price: 1699000,
    stock: 40,
    category_slug: 'books-media',
    images: ['https://picsum.photos/seed/ps5/800/800'],
    condition: 'new',
    brand: 'Sony',
    is_featured: true,
  },
  {
    name: 'Nintendo Switch OLED',
    description: 'Nintendo Switch OLED จอใหญ่ 7 นิ้ว สีสันสดใส',
    price: 1299000,
    stock: 50,
    category_slug: 'books-media',
    images: ['https://picsum.photos/seed/switch/800/800'],
    condition: 'new',
    brand: 'Nintendo',
  },
  {
    name: 'กีต้าร์โปร่ง Yamaha F310',
    description: 'กีต้าร์โปร่ง Yamaha เสียงดี เหมาะสำหรับมือใหม่',
    price: 449000,
    stock: 30,
    category_slug: 'books-media',
    images: ['https://picsum.photos/seed/guitar/800/800'],
    condition: 'new',
    brand: 'Yamaha',
  },
  {
    name: 'นิตยสาร National Geographic ฉบับพิเศษ',
    description: 'นิตยสาร National Geographic ฉบับพิเศษ ภาพสวยงาม',
    price: 19900,
    stock: 100,
    category_slug: 'books-media',
    images: ['https://picsum.photos/seed/magazine/800/800'],
    condition: 'new',
  },
  
  // Toys & Hobbies
  {
    name: 'ตุ๊กตาหมี ขนาด 1 เมตร',
    description: 'ตุ๊กตาหมีขนนุ่ม ขนาดใหญ่ กอดสบาย',
    price: 149900,
    stock: 60,
    category_slug: 'toys-hobbies',
    images: ['https://picsum.photos/seed/teddybear/800/800'],
    condition: 'new',
  },
  {
    name: 'LEGO Star Wars Millennium Falcon',
    description: 'LEGO Star Wars ชุด Millennium Falcon 7,500+ ชิ้น',
    price: 2999000,
    stock: 20,
    category_slug: 'toys-hobbies',
    images: ['https://picsum.photos/seed/lego/800/800'],
    condition: 'new',
    brand: 'LEGO',
    is_featured: true,
  },
  {
    name: 'โดรนกล้อง 4K',
    description: 'โดรนถ่ายภาพ 4K บินได้ 30 นาที ระยะไกล 2km',
    price: 1599000,
    stock: 40,
    category_slug: 'toys-hobbies',
    images: ['https://picsum.photos/seed/drone/800/800'],
    condition: 'new',
  },
  {
    name: 'จิ๊กซอว์ 1000 ชิ้น ภาพทิวทัศน์',
    description: 'จิ๊กซอว์ 1000 ชิ้น ภาพทิวทัศน์สวยงาม',
    price: 39900,
    stock: 100,
    category_slug: 'toys-hobbies',
    images: ['https://picsum.photos/seed/puzzle/800/800'],
    condition: 'new',
  },
  {
    name: 'รถบังคับวิทยุ 4WD',
    description: 'รถบังคับวิทยุ 4WD วิ่งเร็ว ทนทาน เล่นสนุก',
    price: 249900,
    stock: 50,
    category_slug: 'toys-hobbies',
    images: ['https://picsum.photos/seed/rccar/800/800'],
    condition: 'new',
  },
  
  // Food & Drinks
  {
    name: 'กาแฟคั่วบด 100% อาราบิก้า',
    description: 'กาแฟคั่วบด 100% อาราบิก้า กลิ่นหอม รสชาติเข้มข้น',
    price: 29900,
    stock: 300,
    category_slug: 'food-drinks',
    images: ['https://picsum.photos/seed/coffee/800/800'],
    condition: 'new',
  },
  {
    name: 'ชาเขียวมัทฉะ ญี่ปุ่น',
    description: 'ชาเขียวมัทฉะแท้จากญี่ปุ่น คุณภาพพรีเมียม',
    price: 59900,
    stock: 200,
    category_slug: 'food-drinks',
    images: ['https://picsum.photos/seed/matcha/800/800'],
    condition: 'new',
  },
  {
    name: 'น้ำผึ้งแท้ 100%',
    description: 'น้ำผึ้งแท้ 100% จากดอกลำไย หวานอร่อย',
    price: 39900,
    stock: 150,
    category_slug: 'food-drinks',
    images: ['https://picsum.photos/seed/honey/800/800'],
    condition: 'new',
  },
  {
    name: 'ขนมไทยโบราณ ชุด 10 ชนิด',
    description: 'ขนมไทยโบราณ ทำสด อร่อย หวานน้อย',
    price: 49900,
    stock: 100,
    category_slug: 'food-drinks',
    images: ['https://picsum.photos/seed/thaidessert/800/800'],
    condition: 'new',
  },
  {
    name: 'ช็อคโกแลตดาร์ก 85%',
    description: 'ช็อคโกแลตดาร์ก 85% ไม่มีน้ำตาล ดีต่อสุขภาพ',
    price: 19900,
    stock: 250,
    category_slug: 'food-drinks',
    images: ['https://picsum.photos/seed/chocolate/800/800'],
    condition: 'new',
  },
  
  // Health
  {
    name: 'วิตามินซี 1000mg',
    description: 'วิตามินซี 1000mg บำรุงผิวพรรณ เสริมภูมิคุ้มกัน',
    price: 39900,
    stock: 500,
    category_slug: 'health',
    images: ['https://picsum.photos/seed/vitaminc/800/800'],
    condition: 'new',
  },
  {
    name: 'โปรตีนเวย์ 2kg',
    description: 'โปรตีนเวย์ 2kg รสช็อคโกแลต เพิ่มกล้ามเนื้อ',
    price: 149900,
    stock: 200,
    category_slug: 'health',
    images: ['https://picsum.photos/seed/protein/800/800'],
    condition: 'new',
  },
  {
    name: 'น้ำมันปลา Omega-3',
    description: 'น้ำมันปลา Omega-3 บำรุงสมอง หัวใจ',
    price: 59900,
    stock: 300,
    category_slug: 'health',
    images: ['https://picsum.photos/seed/fishoil/800/800'],
    condition: 'new',
  },
  {
    name: 'เครื่องวัดความดันโลหิต',
    description: 'เครื่องวัดความดันโลหิตดิจิตอล ใช้งานง่าย แม่นยำ',
    price: 129900,
    stock: 80,
    category_slug: 'health',
    images: ['https://picsum.photos/seed/bloodpressure/800/800'],
    condition: 'new',
  },
  {
    name: 'เครื่องนวดไฟฟ้า',
    description: 'เครื่องนวดไฟฟ้า คลายกล้ามเนื้อ ลดอาการปวด',
    price: 249900,
    stock: 60,
    category_slug: 'health',
    images: ['https://picsum.photos/seed/massager/800/800'],
    condition: 'new',
  },
];

async function seed() {
  console.log('🌱 Starting seed...');
  
  try {
    // 1. Upsert categories
    console.log('\n📁 Upserting categories...');
    const { data: insertedCategories, error: catError } = await supabase
      .from('categories')
      .upsert(categories, { onConflict: 'slug' })
      .select();
    
    if (catError) {
      console.error('Error upserting categories:', catError);
      throw catError;
    }
    
    console.log(`✅ Inserted ${insertedCategories?.length} categories`);
    
    // Create category map
    const categoryMap = new Map();
    insertedCategories?.forEach(cat => {
      categoryMap.set(cat.slug, cat.id);
    });
    
    // 2. Get or create seller user
    console.log('\n👤 Getting/creating seller user...');
    
    // Try to get existing seller
    let { data: existingSeller } = await supabase
      .from('users')
      .select('*')
      .eq('email', 'seller@streetmarket.com')
      .eq('role', 'seller')
      .single();
    
    let sellerId;
    
    if (!existingSeller) {
      // Create new seller
      const { data: newSeller, error: sellerError } = await supabase
        .from('users')
        .insert({
          auth_id: null,
          email: 'seller@streetmarket.com',
          name: 'StreetMarket Seller',
          role: 'seller',
          wallet_balance: 1000000000,
        })
        .select()
        .single();
      
      if (sellerError) {
        console.error('Error creating seller:', sellerError);
        throw sellerError;
      }
      
      sellerId = newSeller.id;
      console.log(`✅ Seller user created (ID: ${sellerId})`);
    } else {
      sellerId = existingSeller.id;
      console.log(`✅ Using existing seller (ID: ${sellerId})`);
    }
    
    // 3. Insert products
    console.log('\n📦 Inserting products...');
    const productsWithSeller = products.map(({ category_slug, sizes, brand, condition, is_featured, ...product }) => ({
      name: product.name,
      slug: product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      description: product.description,
      price: product.price,
      stock: product.stock,
      images: product.images,
      category_id: categoryMap.get(category_slug),
      seller_id: sellerId,
      status: 'active',
    }));
    
    const { data: insertedProducts, error: prodError } = await supabase
      .from('products')
      .insert(productsWithSeller)
      .select();
    
    if (prodError) {
      console.error('Error inserting products:', prodError);
      throw prodError;
    }
    
    console.log(`✅ Inserted ${insertedProducts?.length} products`);
    
    // 4. Skip reviews for now (need order_id)
    console.log('\n⭐ Skipping reviews (need orders first)...');
    
    console.log('\n🎉 Seed completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Categories: ${insertedCategories?.length}`);
    console.log(`   - Products: ${insertedProducts?.length}`);
    console.log(`   - Seller ID: ${sellerId}`);
    
  } catch (error) {
    console.error('\n❌ Seed failed:', error);
    process.exit(1);
  }
}

seed();

import * as dotenv from 'dotenv';
import * as path from 'path';

// Prioritize backend folder's .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding comprehensive Neon database catalog...');

  // 1. Seed Admin Users
  const adminPassword = bcrypt.hashSync('Admin@12345', 10);
  const legacyPassword = bcrypt.hashSync('12345', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@gmail.com' },
    update: {
      role: Role.ADMIN,
      password: adminPassword,
    },
    create: {
      name: 'System Admin',
      email: 'admin@gmail.com',
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: { email: 'md@gmail.com' },
    update: {
      role: Role.ADMIN,
    },
    create: {
      name: 'Md Ramjan Ali',
      email: 'md@gmail.com',
      password: legacyPassword,
      role: Role.ADMIN,
    },
  });

  console.log(`Admin user ready: ${admin.email}`);

  // 2. Comprehensive catalog spanning all categories
  const fullCatalog = [
    // --- AIRPODES / EARBUDS ---
    {
      productName: 'boAt Airdopes 131 Wireless Earbuds',
      brandName: 'boAt',
      category: 'airpodes',
      productImage: [
        'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500',
        'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500',
      ],
      description: 'Sleek design, 60H playback, Bluetooth v5.0, IWP instant pairing technology.',
      price: 2990,
      sellingPrice: 1299,
      stock: 50,
    },
    {
      productName: 'Apple AirPods Pro (2nd Generation)',
      brandName: 'Apple',
      category: 'airpodes',
      productImage: [
        'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=500',
        'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?w=500',
      ],
      description: 'H2 chip, Up to 2x more Active Noise Cancellation, Adaptive Audio, USB-C MagSafe case.',
      price: 249,
      sellingPrice: 199,
      stock: 35,
    },
    {
      productName: 'Sony WF-1000XM5 Noise Cancelling Earbuds',
      brandName: 'Sony',
      category: 'airpodes',
      productImage: [
        'https://images.unsplash.com/photo-1598331668826-20cecc596b86?w=500',
      ],
      description: 'Astonishing sound quality, unmatched noise cancelling with Integrated Processor V2.',
      price: 299,
      sellingPrice: 249,
      stock: 25,
    },
    {
      productName: 'Samsung Galaxy Buds2 Pro',
      brandName: 'Samsung',
      category: 'airpodes',
      productImage: [
        'https://images.unsplash.com/photo-1629367494173-c78a56567877?w=500',
      ],
      description: '24-bit Hi-Fi audio, Intelligent 360 Audio, Enhanced ANC with 3 high SNR mics.',
      price: 229,
      sellingPrice: 159,
      stock: 40,
    },

    // --- WATCHES ---
    {
      productName: 'boAt Wave Call Smart Watch',
      brandName: 'boAt',
      category: 'watches',
      productImage: [
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
        'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500',
      ],
      description: '1.69" HD Curved Display with Bluetooth Calling, Heart Rate & SpO2 Monitor.',
      price: 4999,
      sellingPrice: 1799,
      stock: 45,
    },
    {
      productName: 'Apple Watch Series 9 GPS 45mm',
      brandName: 'Apple',
      category: 'watches',
      productImage: [
        'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500',
      ],
      description: 'S9 SiP chip, Double Tap gesture, 2000 nits brighter display, carbon neutral bands.',
      price: 429,
      sellingPrice: 389,
      stock: 28,
    },
    {
      productName: 'Samsung Galaxy Watch 6 Classic',
      brandName: 'Samsung',
      category: 'watches',
      productImage: [
        'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500',
      ],
      description: 'Rotating bezel, Sapphire crystal glass, Advanced sleep coaching & ECG monitor.',
      price: 399,
      sellingPrice: 339,
      stock: 20,
    },
    {
      productName: 'Garmin Venu 3 Fitness Smartwatch',
      brandName: 'Garmin',
      category: 'watches',
      productImage: [
        'https://images.unsplash.com/photo-1510017803434-a899398421b3?w=500',
      ],
      description: 'AMOLED display, 14-day battery life, Body Battery energy monitoring, 30+ sports apps.',
      price: 449,
      sellingPrice: 399,
      stock: 18,
    },

    // --- MOBILES ---
    {
      productName: 'Apple iPhone 15 Pro Max 256GB',
      brandName: 'Apple',
      category: 'mobiles',
      productImage: [
        'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=500',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
      ],
      description: 'A17 Pro chip, aerospace-grade titanium design, 48MP main camera with 5x telephoto.',
      price: 1399,
      sellingPrice: 1199,
      stock: 20,
    },
    {
      productName: 'Samsung Galaxy S24 Ultra 5G',
      brandName: 'Samsung',
      category: 'mobiles',
      productImage: [
        'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500',
      ],
      description: 'Snapdragon 8 Gen 3, Galaxy AI features, Built-in S Pen, 200MP quad camera setup.',
      price: 1399,
      sellingPrice: 1249,
      stock: 22,
    },
    {
      productName: 'Google Pixel 8 Pro 128GB',
      brandName: 'Google',
      category: 'mobiles',
      productImage: [
        'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500',
      ],
      description: 'Google Tensor G3, Super Actua display, Pro camera controls, 7 years of OS updates.',
      price: 999,
      sellingPrice: 799,
      stock: 15,
    },
    {
      productName: 'OnePlus 12 5G (Silky Black, 16GB RAM)',
      brandName: 'OnePlus',
      category: 'mobiles',
      productImage: [
        'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500',
      ],
      description: '4th Gen Hasselblad Camera, 100W SUPERVOOC charging, 5400 mAh battery.',
      price: 899,
      sellingPrice: 749,
      stock: 30,
    },

    // --- EARPHONES / HEADPHONES ---
    {
      productName: 'Sony WH-1000XM5 Wireless Headphones',
      brandName: 'Sony',
      category: 'earphones',
      productImage: [
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
      ],
      description: 'Industry-leading noise cancellation, two processors, 8 microphones, 30h battery.',
      price: 399,
      sellingPrice: 349,
      stock: 30,
    },
    {
      productName: 'Bose QuietComfort Ultra Headphones',
      brandName: 'Bose',
      category: 'earphones',
      productImage: [
        'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500',
      ],
      description: 'Spatial audio with Bose Immersive Audio, world-class noise cancellation, plush comfort.',
      price: 429,
      sellingPrice: 379,
      stock: 20,
    },
    {
      productName: 'Sennheiser Momentum 4 Wireless',
      brandName: 'Sennheiser',
      category: 'earphones',
      productImage: [
        'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500',
      ],
      description: 'Audiophile-inspired sound, 60-hour battery life, Adaptive ANC, lightweight ergonomic fit.',
      price: 379,
      sellingPrice: 289,
      stock: 16,
    },

    // --- CAMERAS ---
    {
      productName: 'Canon EOS R6 Mark II Mirrorless Camera',
      brandName: 'Canon',
      category: 'camera',
      productImage: [
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500',
        'https://images.unsplash.com/photo-1502982720700-bfff97f2ecac?w=500',
      ],
      description: '24.2MP CMOS sensor, 40 fps electronic shutter, 4K 60p video, Dual Pixel CMOS AF II.',
      price: 2499,
      sellingPrice: 2199,
      stock: 12,
    },
    {
      productName: 'Sony Alpha 7 IV Full-frame Camera',
      brandName: 'Sony',
      category: 'camera',
      productImage: [
        'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=500',
      ],
      description: '33MP Exmor R sensor, BIONZ XR processing, 4K 60p recording, Real-time Eye AF.',
      price: 2699,
      sellingPrice: 2399,
      stock: 10,
    },
    {
      productName: 'Fujifilm X-T5 Mirrorless Digital Camera',
      brandName: 'Fujifilm',
      category: 'camera',
      productImage: [
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500',
      ],
      description: '40.2MP X-Trans CMOS 5 HR sensor, 6.2K/30p video, classic analog dial operation.',
      price: 1799,
      sellingPrice: 1649,
      stock: 14,
    },

    // --- MICE & ACCESSORIES ---
    {
      productName: 'Logitech MX Master 3S Wireless Mouse',
      brandName: 'Logitech',
      category: 'Mouse',
      productImage: [
        'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500',
      ],
      description: 'Quiet Clicks, 8K DPI Any-Surface Tracking, MagSpeed Electromagnetic Scrolling.',
      price: 99,
      sellingPrice: 89,
      stock: 60,
    },
    {
      productName: 'Razer DeathAdder V3 Pro Wireless Gaming Mouse',
      brandName: 'Razer',
      category: 'Mouse',
      productImage: [
        'https://images.unsplash.com/photo-1626778978051-78705c754d5d?w=500',
      ],
      description: '63g ultra-lightweight design, Focus Pro 30K Optical Sensor, Gen-3 Optical Switches.',
      price: 149,
      sellingPrice: 129,
      stock: 40,
    },
    {
      productName: 'Apple Magic Mouse Wireless & Rechargeable',
      brandName: 'Apple',
      category: 'Mouse',
      productImage: [
        'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
      ],
      description: 'Multi-Touch surface for gestures, seamless Mac integration, USB-C woven cable.',
      price: 79,
      sellingPrice: 69,
      stock: 50,
    },

    // --- TELEVISIONS ---
    {
      productName: 'Samsung 55" Crystal 4K UHD Smart TV',
      brandName: 'Samsung',
      category: 'televisions',
      productImage: [
        'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500',
      ],
      description: 'PurColor, Crystal Processor 4K, Smart Hub, HDR10+ support, slim look design.',
      price: 649,
      sellingPrice: 529,
      stock: 15,
    },
    {
      productName: 'LG 65" OLED evo C3 Series 4K Smart TV',
      brandName: 'LG',
      category: 'televisions',
      productImage: [
        'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=500',
      ],
      description: 'Self-lit OLED pixels, Brightness Booster, α9 AI Processor Gen6, Dolby Vision & Atmos.',
      price: 1899,
      sellingPrice: 1549,
      stock: 8,
    },
    {
      productName: 'Sony BRAVIA XR 55" 4K Google TV',
      brandName: 'Sony',
      category: 'televisions',
      productImage: [
        'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=500',
      ],
      description: 'Cognitive Processor XR, Acoustic Surface Audio+, Full Array LED contrast.',
      price: 1299,
      sellingPrice: 1099,
      stock: 10,
    },

    // --- SPEAKERS ---
    {
      productName: 'JBL Charge 5 Waterproof Portable Speaker',
      brandName: 'JBL',
      category: 'speakers',
      productImage: [
        'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500',
      ],
      description: 'Bold JBL Original Pro Sound, 20 hours of playtime, built-in powerbank, IP67 waterproof.',
      price: 179,
      sellingPrice: 139,
      stock: 35,
    },
    {
      productName: 'Marshall Stanmore III Bluetooth Home Speaker',
      brandName: 'Marshall',
      category: 'speakers',
      productImage: [
        'https://images.unsplash.com/photo-1543512214-318c7553f230?w=500',
      ],
      description: 'Re-engineered for wider soundstage, iconic vintage rock design, Bluetooth 5.2.',
      price: 379,
      sellingPrice: 329,
      stock: 15,
    },
    {
      productName: 'Bose SoundLink Flex Bluetooth Speaker',
      brandName: 'Bose',
      category: 'speakers',
      productImage: [
        'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
      ],
      description: 'PositionIQ technology, waterproof and dustproof (IP67), rugged silicone exterior.',
      price: 149,
      sellingPrice: 119,
      stock: 25,
    },

    // --- PRINTERS ---
    {
      productName: 'HP Smart Tank 5105 All-in-One Inkjet Printer',
      brandName: 'HP',
      category: 'printers',
      productImage: [
        'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=500',
      ],
      description: 'High-capacity ink tanks, print, scan, copy, self-healing dual-band Wi-Fi.',
      price: 249,
      sellingPrice: 199,
      stock: 20,
    },
    {
      productName: 'Canon PIXMA G3010 Wireless Ink Tank Printer',
      brandName: 'Canon',
      category: 'printers',
      productImage: [
        'https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=500',
      ],
      description: 'High volume low cost printing, spill-resistant ink bottles, mobile direct printing.',
      price: 219,
      sellingPrice: 179,
      stock: 18,
    },

    // --- PROCESSOR ---
    {
      productName: 'Intel Core i9-14900K 24-Core Desktop CPU',
      brandName: 'Intel',
      category: 'processor',
      productImage: [
        'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=500',
      ],
      description: 'Up to 6.0 GHz max turbo, 24 cores (8 P-cores + 16 E-cores), LGA 1700 socket.',
      price: 599,
      sellingPrice: 539,
      stock: 14,
    },
    {
      productName: 'AMD Ryzen 9 7950X 16-Core Processor',
      brandName: 'AMD',
      category: 'processor',
      productImage: [
        'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=500',
      ],
      description: '5nm Zen 4 architecture, up to 5.7 GHz boost, 32 threads, PCIe 5.0 ready.',
      price: 699,
      sellingPrice: 559,
      stock: 16,
    },

    // --- REFRIGERATOR ---
    {
      productName: 'Samsung 653L Side-by-Side Smart Refrigerator',
      brandName: 'Samsung',
      category: 'refrigerator',
      productImage: [
        'https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500',
      ],
      description: 'SpaceMax Technology, SmartThings AI Energy mode, Twin Cooling Plus, digital inverter.',
      price: 1499,
      sellingPrice: 1249,
      stock: 8,
    },
    {
      productName: 'LG 594L Inverter Frost-Free Multi-Air Fridge',
      brandName: 'LG',
      category: 'refrigerator',
      productImage: [
        'https://images.unsplash.com/photo-1584992236310-6edddc08acff?w=500',
      ],
      description: 'Door Cooling+, Smart Inverter Compressor, Hygiene Fresh+ antibacterial filter.',
      price: 1399,
      sellingPrice: 1149,
      stock: 6,
    },

    // --- TRIMMERS ---
    {
      productName: 'Philips Series 7000 14-in-1 All-in-One Trimmer',
      brandName: 'Philips',
      category: 'trimmers',
      productImage: [
        'https://images.unsplash.com/photo-1621607512214-68297480165e?w=500',
      ],
      description: 'DualCut self-sharpening blades, 120 min cordless runtime, showerproof design.',
      price: 79,
      sellingPrice: 59,
      stock: 45,
    },
    {
      productName: 'Braun Beard Trimmer Series 9 Pro',
      brandName: 'Braun',
      category: 'trimmers',
      productImage: [
        'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500',
      ],
      description: 'Lifetime sharp ProBlade, AutoSense technology adapts to beard density, 180 min runtime.',
      price: 119,
      sellingPrice: 89,
      stock: 30,
    },
  ];

  console.log(`Seeding ${fullCatalog.length} catalog products...`);

  for (const item of fullCatalog) {
    const existing = await prisma.product.findFirst({
      where: { productName: item.productName },
    });

    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: item,
      });
    } else {
      await prisma.product.create({
        data: item,
      });
    }
  }

  const count = await prisma.product.count();
  console.log(`Neon database seeded successfully! Total products in catalog: ${count}`);
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// VyaparAI Preset Data Store for Multi-Profession Customization

const NICHE_PRESETS = {
  grocery: {
    id: 'grocery',
    name: 'Grocery & Kirana Store',
    tagline: 'Daily essentials, packaged goods, and staples',
    icon: 'fa-basket-shopping',
    accentColor: 'emerald',
    badge: 'Popular for Daily Retail',
    currency: '₹',
    categories: ['Grains & Flours', 'Pulses & Dals', 'Oils & Ghee', 'Dairy & Breakfast', 'Spices & Condiments', 'Snacks & Beverages'],
    commonProducts: [
      { id: 'g1', name: 'Aashirvaad Shudh Chakki Atta', category: 'Grains & Flours', unit: '5 kg', costPrice: 210, sellingPrice: 245, stock: 18, reorderLevel: 8, leadTimeDays: 2, dailyVelocity: 3.2, daysIdle: 1, barcode: '890103038101', icon: 'fa-wheat-awn' },
      { id: 'g2', name: 'India Gate Basmati Rice Feast', category: 'Grains & Flours', unit: '5 kg', costPrice: 380, sellingPrice: 460, stock: 6, reorderLevel: 10, leadTimeDays: 3, dailyVelocity: 2.1, daysIdle: 4, barcode: '890103038102', icon: 'fa-bowl-rice' },
      { id: 'g3', name: 'Tata Sampann Toor Dal Unpolished', category: 'Pulses & Dals', unit: '1 kg', costPrice: 145, sellingPrice: 172, stock: 24, reorderLevel: 12, leadTimeDays: 2, dailyVelocity: 4.5, daysIdle: 1, barcode: '890103038103', icon: 'fa-seedling' },
      { id: 'g4', name: 'Fortune Sunlite Refined Sunflower Oil', category: 'Oils & Ghee', unit: '1 L', costPrice: 122, sellingPrice: 144, stock: 32, reorderLevel: 15, leadTimeDays: 3, dailyVelocity: 5.0, daysIdle: 0, barcode: '890103038104', icon: 'fa-bottle-droplet' },
      { id: 'g5', name: 'Amul Butter Salted', category: 'Dairy & Breakfast', unit: '500 gm', costPrice: 242, sellingPrice: 275, stock: 14, reorderLevel: 8, leadTimeDays: 1, dailyVelocity: 3.8, daysIdle: 0, barcode: '890103038105', icon: 'fa-cube' },
      { id: 'g6', name: 'Amul Taaza Homogenised Toned Milk', category: 'Dairy & Breakfast', unit: '1 L', costPrice: 52, sellingPrice: 58, stock: 28, reorderLevel: 10, leadTimeDays: 1, dailyVelocity: 8.0, daysIdle: 0, barcode: '890103038106', icon: 'fa-cow' },
      { id: 'g7', name: 'Tata Salt Vacuum Evaporated', category: 'Spices & Condiments', unit: '1 kg', costPrice: 22, sellingPrice: 28, stock: 45, reorderLevel: 20, leadTimeDays: 2, dailyVelocity: 6.2, daysIdle: 0, barcode: '890103038107', icon: 'fa-mortar-pestle' },
      { id: 'g8', name: 'Everest Turmeric Powder Haldi', category: 'Spices & Condiments', unit: '200 gm', costPrice: 42, sellingPrice: 54, stock: 19, reorderLevel: 10, leadTimeDays: 3, dailyVelocity: 2.0, daysIdle: 2, barcode: '890103038108', icon: 'fa-fire-flame-simple' },
      { id: 'g9', name: 'Maggi 2-Minute Masala Noodles Pack', category: 'Snacks & Beverages', unit: 'Pack of 4', costPrice: 48, sellingPrice: 58, stock: 35, reorderLevel: 15, leadTimeDays: 2, dailyVelocity: 7.4, daysIdle: 0, barcode: '890103038109', icon: 'fa-utensils' },
      { id: 'g10', name: 'Lay\'s India\'s Magic Masala Chips', category: 'Snacks & Beverages', unit: '50 gm', costPrice: 16, sellingPrice: 20, stock: 52, reorderLevel: 20, leadTimeDays: 1, dailyVelocity: 11.0, daysIdle: 0, barcode: '890103038110', icon: 'fa-cookie-bite' },
      { id: 'g11', name: 'Premium Organic Quinoa Superfood', category: 'Grains & Flours', unit: '500 gm', costPrice: 280, sellingPrice: 340, stock: 16, reorderLevel: 5, leadTimeDays: 5, dailyVelocity: 0.1, daysIdle: 48, barcode: '890103038111', icon: 'fa-wheat-awn' }, // Dead stock candidate
      { id: 'g12', name: 'Artisanal Himalayan Rock Salt Grinder', category: 'Spices & Condiments', unit: '250 gm', costPrice: 190, sellingPrice: 260, stock: 22, reorderLevel: 6, leadTimeDays: 6, dailyVelocity: 0.15, daysIdle: 52, barcode: '890103038112', icon: 'fa-gem' } // Dead stock candidate
    ],
    sampleInvoice: {
      vendor: 'Shree Krishna Wholesale & FMCG Distributors',
      invoiceNumber: 'SK-2026-9482',
      date: '2026-10-10',
      totalAmount: 18450,
      items: [
        { name: 'Aashirvaad Shudh Chakki Atta 5kg', invoicedQty: 40, unitPrice: 210, taxPct: 5, total: 8820, damagedQty: 2, note: 'Torn packaging bag' },
        { name: 'Fortune Sunlite Refined Sunflower Oil 1L', invoicedQty: 50, unitPrice: 122, taxPct: 5, total: 6405, damagedQty: 4, note: 'Oil leakage during transit' },
        { name: 'Amul Butter Salted 500gm', invoicedQty: 20, unitPrice: 242, taxPct: 5, total: 5082, damagedQty: 0, note: 'Perfect condition' }
      ]
    },
    aiInsights: [
      { title: 'Dead Capital Alert: Quinoa & Rock Salt', text: '₹8,660 locked in slow-moving Quinoa & Gourmet Grinders (>48 days idle). Bundle with Toor Dal for a 15% weekend health combo.', type: 'warning', action: 'Create Combo Bundle' },
      { title: 'Impulse Counter Placement', text: 'Maggi 4-packs and Lay\'s show a 28% basket correlation. Relocate snack racks near the billing counter to boost AOV.', type: 'growth', action: 'Update Display Plan' },
      { title: 'Reorder Basmati Rice (Feast)', text: 'Basmati Rice stock is down to 6 units with 2.1 units/day velocity (less than 3 days remaining). Restock immediately before weekend peak.', type: 'urgent', action: 'Generate PO' }
    ],
    marketTrends: {
      trendingKeywords: ['Cold-pressed Mustard Oil (+45%)', 'A2 Desi Cow Ghee (+38%)', 'Millets & Ragi Flour (+52%)'],
      regionalHotspots: [{ region: 'Local Neighborhood', demandScore: 94, topItem: 'Sunflower Oil' }, { region: 'Express Society Deliveries', demandScore: 88, topItem: 'Dairy & Atta' }],
      benchmarkMargin: '16.5% - 22.0%',
      consumerShift: 'Consumers are pivoting 30% faster to organic staples and unpolished dals.'
    }
  },

  crochet: {
    id: 'crochet',
    name: 'Crochet & Handmade Crafts',
    tagline: 'Artisanal amigurumi, knitwear, bags, and luxury yarns',
    icon: 'fa-mitten',
    accentColor: 'rose',
    badge: 'Artisanal & Creator Studio',
    currency: '₹',
    categories: ['Amigurumi Plushies', 'Knitwear & Apparel', 'Handmade Bags', 'Accessories', 'Yarn & DIY Kits'],
    commonProducts: [
      { id: 'c1', name: 'Pastel Daisy Amigurumi Bunny', category: 'Amigurumi Plushies', unit: '1 pc', costPrice: 220, sellingPrice: 650, stock: 8, reorderLevel: 4, leadTimeDays: 4, dailyVelocity: 1.2, daysIdle: 2, barcode: 'CRC-AMIG-01', icon: 'fa-heart' },
      { id: 'c2', name: 'Coquette Bow Chunky Crochet Tote Bag', category: 'Handmade Bags', unit: '1 pc', costPrice: 310, sellingPrice: 890, stock: 5, reorderLevel: 3, leadTimeDays: 5, dailyVelocity: 1.5, daysIdle: 1, barcode: 'CRC-BAG-02', icon: 'fa-bag-shopping' },
      { id: 'c3', name: 'Hand-knitted Granny Square Cardigan (Pastel)', category: 'Knitwear & Apparel', unit: '1 pc', costPrice: 650, sellingPrice: 1950, stock: 3, reorderLevel: 2, leadTimeDays: 7, dailyVelocity: 0.6, daysIdle: 3, barcode: 'CRC-WEAR-03', icon: 'fa-shirt' },
      { id: 'c4', name: 'Strawberry Bucket Hat Cotton', category: 'Accessories', unit: '1 pc', costPrice: 140, sellingPrice: 420, stock: 12, reorderLevel: 5, leadTimeDays: 3, dailyVelocity: 1.8, daysIdle: 1, barcode: 'CRC-ACC-04', icon: 'fa-hat-cowboy' },
      { id: 'c5', name: 'Velvet Chenille Soft Yarn Skein (Cream)', category: 'Yarn & DIY Kits', unit: '100 gm', costPrice: 95, sellingPrice: 190, stock: 35, reorderLevel: 10, leadTimeDays: 4, dailyVelocity: 4.0, daysIdle: 0, barcode: 'CRC-YARN-05', icon: 'fa-circle-notch' },
      { id: 'c6', name: 'Beginner DIY Crochet Frog Kit with Hook', category: 'Yarn & DIY Kits', unit: '1 kit', costPrice: 240, sellingPrice: 590, stock: 15, reorderLevel: 6, leadTimeDays: 4, dailyVelocity: 2.2, daysIdle: 2, barcode: 'CRC-KIT-06', icon: 'fa-box-open' },
      { id: 'c7', name: 'Neon Green Chunky Balaclava (Winter)', category: 'Knitwear & Apparel', unit: '1 pc', costPrice: 450, sellingPrice: 1100, stock: 9, reorderLevel: 2, leadTimeDays: 6, dailyVelocity: 0.05, daysIdle: 55, barcode: 'CRC-BALA-07', icon: 'fa-mask' }, // Dead stock
      { id: 'c8', name: 'Giant Floral Macrame Wall Hanging 4ft', category: 'Accessories', unit: '1 pc', costPrice: 850, sellingPrice: 2200, stock: 4, reorderLevel: 1, leadTimeDays: 10, dailyVelocity: 0.08, daysIdle: 62, barcode: 'CRC-MACR-08', icon: 'fa-image' } // Dead stock
    ],
    sampleInvoice: {
      vendor: 'Artisan Threads & Luxury Yarns Co.',
      invoiceNumber: 'ATY-2026-118',
      date: '2026-10-08',
      totalAmount: 14200,
      items: [
        { name: 'Velvet Chenille Soft Yarn Skeins Cream', invoicedQty: 60, unitPrice: 95, taxPct: 5, total: 5985, damagedQty: 4, note: 'Tangled and stained spools' },
        { name: 'Ergonomic Silicone Crochet Hook Sets (8 sizes)', invoicedQty: 30, unitPrice: 110, taxPct: 12, total: 3696, damagedQty: 1, note: 'Missing 3.5mm hook in 1 set' },
        { name: 'Organic Cotton Yarns Pastel Assorted', invoicedQty: 45, unitPrice: 85, taxPct: 5, total: 4016, damagedQty: 0, note: 'Excellent batch' }
      ]
    },
    aiInsights: [
      { title: 'Viral Trend: Coquette Bow Totes +140%', text: 'Pinterest search volume for Coquette Bow bags jumped 140%. Stock is only 5 units. Run a pre-order campaign.', type: 'growth', action: 'Boost Production' },
      { title: 'Capital Locked in Balaclavas & Wall Hangings', text: '₹7,450 locked in unsold Winter Balaclavas & 4ft Wall Hangings (>55 days idle). Launch a 25% Clearance Flash Sale.', type: 'warning', action: 'Apply Clearance Sale' },
      { title: 'High Margin DIY Kits', text: 'Beginner DIY kits deliver a 59% net margin. Bundle with 2 Velvet Skeins for an upsell at checkout.', type: 'urgent', action: 'Enable POS Upsell' }
    ],
    marketTrends: {
      trendingKeywords: ['Coquette aesthetic bows (+140%)', 'Amigurumi keychains (+78%)', 'Chenille yarn cardigans (+64%)'],
      regionalHotspots: [{ region: 'Instagram / Direct Orders', demandScore: 96, topItem: 'Bow Tote Bags' }, { region: 'Local Craft Flea Markets', demandScore: 89, topItem: 'Amigurumi Plushies' }],
      benchmarkMargin: '55% - 68%',
      consumerShift: 'Gen-Z buyers prefer personalized handmade gifts with custom colorways.'
    }
  },

  cosmetic: {
    id: 'cosmetic',
    name: 'Cosmetics & Beauty Boutique',
    tagline: 'Skincare, luxury makeup, fragrances, and clean beauty',
    icon: 'fa-wand-magic-sparkles',
    accentColor: 'purple',
    badge: 'High Margin Retail',
    currency: '₹',
    categories: ['Face Serums', 'Lip Care & Makeup', 'Sun Protection', 'Cleansers & Masks', 'Fragrances'],
    commonProducts: [
      { id: 'cs1', name: '10% Niacinamide & Zinc Clarifying Serum', category: 'Face Serums', unit: '30 ml', costPrice: 220, sellingPrice: 599, stock: 16, reorderLevel: 8, leadTimeDays: 3, dailyVelocity: 2.8, daysIdle: 1, barcode: 'CS-NIAC-01', icon: 'fa-droplet' },
      { id: 'cs2', name: 'Matte Liquid Velvet Lipstick - Ruby Crush', category: 'Lip Care & Makeup', unit: '5 ml', costPrice: 160, sellingPrice: 499, stock: 22, reorderLevel: 10, leadTimeDays: 2, dailyVelocity: 3.5, daysIdle: 0, barcode: 'CS-LIP-02', icon: 'fa-kiss-wink-heart' },
      { id: 'cs3', name: 'Dewy Sunscreen Gel SPF 50+ PA++++', category: 'Sun Protection', unit: '50 gm', costPrice: 195, sellingPrice: 475, stock: 7, reorderLevel: 12, leadTimeDays: 3, dailyVelocity: 3.9, daysIdle: 1, barcode: 'CS-SUN-03', icon: 'fa-sun' },
      { id: 'cs4', name: 'Hydrating Ceramide Deep Moisture Cream', category: 'Face Serums', unit: '50 gm', costPrice: 240, sellingPrice: 649, stock: 14, reorderLevel: 6, leadTimeDays: 4, dailyVelocity: 2.0, daysIdle: 2, barcode: 'CS-CREAM-04', icon: 'fa-jar' },
      { id: 'cs5', name: 'Matcha Green Tea Pore Clarifying Clay Mask', category: 'Cleansers & Masks', unit: '100 gm', costPrice: 180, sellingPrice: 440, stock: 18, reorderLevel: 6, leadTimeDays: 4, dailyVelocity: 1.8, daysIdle: 3, barcode: 'CS-MASK-05', icon: 'fa-spa' },
      { id: 'cs6', name: 'Eau de Parfum - Vanilla Bourbon Noir', category: 'Fragrances', unit: '50 ml', costPrice: 420, sellingPrice: 1250, stock: 9, reorderLevel: 4, leadTimeDays: 5, dailyVelocity: 1.1, daysIdle: 2, barcode: 'CS-PERF-06', icon: 'fa-spray-can-sparkles' },
      { id: 'cs7', name: 'Gold Foil Anti-Aging Sheet Mask (10-Pack)', category: 'Cleansers & Masks', unit: '1 pack', costPrice: 480, sellingPrice: 890, stock: 15, reorderLevel: 4, leadTimeDays: 7, dailyVelocity: 0.1, daysIdle: 46, barcode: 'CS-FOIL-07', icon: 'fa-mask-face' }, // Dead stock
      { id: 'cs8', name: 'Glitter Body Shimmer Mist Galactic Silver', category: 'Fragrances', unit: '120 ml', costPrice: 290, sellingPrice: 590, stock: 18, reorderLevel: 3, leadTimeDays: 6, dailyVelocity: 0.08, daysIdle: 54, barcode: 'CS-SHIM-08', icon: 'fa-sparkles' } // Dead stock
    ],
    sampleInvoice: {
      vendor: 'GlowFormulations Lab & Beauty Supply',
      invoiceNumber: 'GFL-2026-302',
      date: '2026-10-09',
      totalAmount: 26800,
      items: [
        { name: 'Dewy Sunscreen Gel SPF 50+ 50gm', invoicedQty: 50, unitPrice: 195, taxPct: 18, total: 11505, damagedQty: 3, note: 'Cracked cap pump dispenser' },
        { name: '10% Niacinamide Serum 30ml Dropper', invoicedQty: 40, unitPrice: 220, taxPct: 18, total: 10384, damagedQty: 2, note: 'Glass pipette cracked' },
        { name: 'Matte Liquid Velvet Lipstick Ruby', invoicedQty: 30, unitPrice: 160, taxPct: 18, total: 5664, damagedQty: 0, note: 'Sealed & intact' }
      ]
    },
    aiInsights: [
      { title: 'Sunscreen Reorder Urgency', text: 'Dewy Sunscreen Gel has only 7 bottles left with 3.9 units/day sales. Reorder now to avoid 3 days of out-of-stock lost revenue.', type: 'urgent', action: 'Restock Sunscreen' },
      { title: 'Dead Capital in Shimmer Mist & Gold Sheet Masks', text: '₹12,420 tied up in Shimmer Mists and Gold Masks over 46+ days. Run a 20% "Festival Glow" bundle promotion.', type: 'warning', action: 'Launch Festival Bundle' },
      { title: 'Lipstick + Serum Cross-Sell', text: '42% of lipstick buyers also view serums. Enable the cashier one-tap combo to add a ₹100 discount coupon.', type: 'growth', action: 'Enable Cross-Sell' }
    ],
    marketTrends: {
      trendingKeywords: ['Centella Asiatica / Cica (+88%)', 'Peptide lip treatment (+72%)', 'Tinted fluid sunscreen (+95%)'],
      regionalHotspots: [{ region: 'Metro & Tier-1 Salons', demandScore: 92, topItem: 'Niacinamide Serum' }, { region: 'College Campus Area', demandScore: 95, topItem: 'Velvet Lipsticks' }],
      benchmarkMargin: '58% - 72%',
      consumerShift: 'Switch from physical makeup to skincare-infused cosmetics (tinted serums, peptide balms).'
    }
  },

  graphic_tshirt: {
    id: 'graphic_tshirt',
    name: 'Graphic T-Shirts & Apparel',
    tagline: 'Oversized streetwear, anime aesthetics, hoodies, and merch',
    icon: 'fa-shirt',
    accentColor: 'indigo',
    badge: 'Trending Youth Fashion',
    currency: '₹',
    categories: ['Oversized Tees', 'Hoodies & Sweatshirts', 'Acid Wash & Vintage', 'Polo & Basics', 'Headwear & Accessories'],
    commonProducts: [
      { id: 't1', name: 'Cyber Samurai Oversized Graphic Tee', category: 'Oversized Tees', unit: 'Size L', costPrice: 280, sellingPrice: 799, stock: 18, reorderLevel: 8, leadTimeDays: 4, dailyVelocity: 3.1, daysIdle: 1, barcode: 'TSH-CYBER-01', icon: 'fa-shirt' },
      { id: 't2', name: 'Tokyo Drifter Heavyweight 240 GSM Tee', category: 'Oversized Tees', unit: 'Size M', costPrice: 310, sellingPrice: 849, stock: 14, reorderLevel: 6, leadTimeDays: 4, dailyVelocity: 2.7, daysIdle: 1, barcode: 'TSH-TOKYO-02', icon: 'fa-shirt' },
      { id: 't3', name: 'Anime Shinobi Fleece Pullover Hoodie', category: 'Hoodies & Sweatshirts', unit: 'Size XL', costPrice: 580, sellingPrice: 1599, stock: 6, reorderLevel: 6, leadTimeDays: 6, dailyVelocity: 1.8, daysIdle: 2, barcode: 'TSH-HOOD-03', icon: 'fa-vest' },
      { id: 't4', name: 'Vintage Acid Wash Nirvana Rock Tee', category: 'Acid Wash & Vintage', unit: 'Size L', costPrice: 320, sellingPrice: 899, stock: 12, reorderLevel: 5, leadTimeDays: 5, dailyVelocity: 2.2, daysIdle: 1, barcode: 'TSH-ACID-04', icon: 'fa-shirt' },
      { id: 't5', name: 'Minimalist Tokyo Kanji Embroidered Cap', category: 'Headwear & Accessories', unit: 'Free Size', costPrice: 150, sellingPrice: 449, stock: 24, reorderLevel: 8, leadTimeDays: 3, dailyVelocity: 2.9, daysIdle: 1, barcode: 'TSH-CAP-05', icon: 'fa-hat-cowboy' },
      { id: 't6', name: 'Retro 90s Pixel Arcade Tee (Black)', category: 'Oversized Tees', unit: 'Size M', costPrice: 260, sellingPrice: 749, stock: 16, reorderLevel: 6, leadTimeDays: 4, dailyVelocity: 2.0, daysIdle: 2, barcode: 'TSH-PIXEL-06', icon: 'fa-shirt' },
      { id: 't7', name: 'Neon Tie-Dye Long Sleeve Crop Top', category: 'Acid Wash & Vintage', unit: 'Size S', costPrice: 340, sellingPrice: 799, stock: 14, reorderLevel: 3, leadTimeDays: 6, dailyVelocity: 0.08, daysIdle: 49, barcode: 'TSH-TIEDYE-07', icon: 'fa-vest' }, // Dead stock
      { id: 't8', name: 'Reflective Neon Windbreaker Jacket', category: 'Hoodies & Sweatshirts', unit: 'Size L', costPrice: 720, sellingPrice: 1899, stock: 11, reorderLevel: 2, leadTimeDays: 8, dailyVelocity: 0.07, daysIdle: 58, barcode: 'TSH-WIND-08', icon: 'fa-vest-patches' } // Dead stock
    ],
    sampleInvoice: {
      vendor: 'UrbanThreadz Apparel Mills & Screenworks',
      invoiceNumber: 'UTA-2026-772',
      date: '2026-10-09',
      totalAmount: 32400,
      items: [
        { name: 'Cyber Samurai 240 GSM Blank Tees (Printed)', invoicedQty: 50, unitPrice: 280, taxPct: 5, total: 14700, damagedQty: 2, note: 'Misaligned screen print on chest' },
        { name: 'Tokyo Drifter Heavyweight Tees Size M/L', invoicedQty: 40, unitPrice: 310, taxPct: 5, total: 13020, damagedQty: 1, note: 'Small stitching pull at hem' },
        { name: 'Embroidered Streetwear Caps (Cotton Drill)', invoicedQty: 30, unitPrice: 150, taxPct: 12, total: 5040, damagedQty: 0, note: 'Flawless batch' }
      ]
    },
    aiInsights: [
      { title: 'Heavyweight GSM Outperforming', text: '240 GSM Oversized Tees have 65% repeat buy rates. Phase out lighter 180 GSM stock to position as a premium streetwear brand.', type: 'growth', action: 'Upgrade Fabric Line' },
      { title: 'Dead Capital in Tie-Dye & Neon Windbreakers', text: '₹12,680 locked in off-season Tie-Dye and Windbreakers (>49 days idle). Run an End-Of-Season BOGO or 30% markdown.', type: 'warning', action: 'Apply 30% Markdown' },
      { title: 'Low Stock Alert: Anime Fleece Hoodies', text: 'Only 6 units of Shinobi Hoodies remaining ahead of cold weather spike. Lead time is 6 days. Place reorder now.', type: 'urgent', action: 'Reorder Hoodies' }
    ],
    marketTrends: {
      trendingKeywords: ['240 GSM French Terry (+115%)', 'Cyberpunk Kanji graphics (+82%)', 'Boxy drop-shoulder fits (+90%)'],
      regionalHotspots: [{ region: 'College Campus / Cafes', demandScore: 98, topItem: 'Cyber Samurai Tees' }, { region: 'E-commerce Marketplaces', demandScore: 86, topItem: 'Vintage Rock Tees' }],
      benchmarkMargin: '58% - 66%',
      consumerShift: 'Transition from regular slim-fit tees to ultra-heavyweight boxy silhouettes.'
    }
  },

  cafe: {
    id: 'cafe',
    name: 'Artisan Cafe & Bakery',
    tagline: 'Specialty coffee, artisanal pastries, and savory quick bites',
    icon: 'fa-mug-hot',
    accentColor: 'amber',
    badge: 'F&B & Hospitality',
    currency: '₹',
    categories: ['Hot Brews', 'Cold Beverages', 'Bakery & Pastries', 'Savory Bites', 'Retail Coffee Beans'],
    commonProducts: [
      { id: 'cf1', name: 'Signature Cutting Chai (Special Spices)', category: 'Hot Brews', unit: '1 cup', costPrice: 8, sellingPrice: 30, stock: 95, reorderLevel: 25, leadTimeDays: 1, dailyVelocity: 35.0, daysIdle: 0, barcode: 'CAF-CHAI-01', icon: 'fa-mug-saucer' },
      { id: 'cf2', name: 'Creamy Cappuccino Arabica Single Origin', category: 'Hot Brews', unit: '1 cup', costPrice: 28, sellingPrice: 140, stock: 45, reorderLevel: 20, leadTimeDays: 1, dailyVelocity: 16.0, daysIdle: 0, barcode: 'CAF-COFF-02', icon: 'fa-mug-hot' },
      { id: 'cf3', name: 'Crispy Paneer Tikka Samosa (2 pcs)', category: 'Savory Bites', unit: '1 plate', costPrice: 18, sellingPrice: 60, stock: 30, reorderLevel: 15, leadTimeDays: 1, dailyVelocity: 18.0, daysIdle: 0, barcode: 'CAF-SAMO-03', icon: 'fa-bowl-food' },
      { id: 'cf4', name: 'Dark Chocolate Truffle Croissant', category: 'Bakery & Pastries', unit: '1 pc', costPrice: 42, sellingPrice: 130, stock: 16, reorderLevel: 8, leadTimeDays: 1, dailyVelocity: 8.5, daysIdle: 0, barcode: 'CAF-CROI-04', icon: 'fa-bread-slice' },
      { id: 'cf5', name: 'Vietnamese Hazelnut Iced Cold Coffee', category: 'Cold Beverages', unit: '350 ml', costPrice: 35, sellingPrice: 175, stock: 28, reorderLevel: 10, leadTimeDays: 1, dailyVelocity: 12.0, daysIdle: 0, barcode: 'CAF-ICED-05', icon: 'fa-wine-glass' },
      { id: 'cf6', name: 'Walnut Chocolate Fudge Brownie', category: 'Bakery & Pastries', unit: '1 pc', costPrice: 30, sellingPrice: 95, stock: 19, reorderLevel: 8, leadTimeDays: 1, dailyVelocity: 9.0, daysIdle: 0, barcode: 'CAF-BROWN-06', icon: 'fa-cake-candles' },
      { id: 'cf7', name: 'Artisan Matcha Powder Tin (Specialty 100g)', category: 'Retail Coffee Beans', unit: '1 tin', costPrice: 480, sellingPrice: 950, stock: 12, reorderLevel: 3, leadTimeDays: 6, dailyVelocity: 0.1, daysIdle: 42, barcode: 'CAF-MATC-07', icon: 'fa-jar' }, // Dead stock
      { id: 'cf8', name: 'Decaf Dark Roast Whole Bean Pack (500g)', category: 'Retail Coffee Beans', unit: '1 pack', costPrice: 390, sellingPrice: 790, stock: 14, reorderLevel: 3, leadTimeDays: 5, dailyVelocity: 0.08, daysIdle: 50, barcode: 'CAF-DECAF-08', icon: 'fa-boxes-packing' } // Dead stock
    ],
    sampleInvoice: {
      vendor: 'FreshRoast Estate & Dairy Supplies',
      invoiceNumber: 'FRE-2026-601',
      date: '2026-10-10',
      totalAmount: 16500,
      items: [
        { name: 'Single Origin Arabica Beans Grade A (5kg)', invoicedQty: 4, unitPrice: 1800, taxPct: 5, total: 7560, damagedQty: 0, note: 'Hermetic seal good' },
        { name: 'Fresh Amul Full Cream Milk Crates (30L)', invoicedQty: 2, unitPrice: 1650, taxPct: 5, total: 3465, damagedQty: 1, note: 'Leaking pouch in crate 2' },
        { name: 'Pure Belgian Dark Cocoa Solids (2kg)', invoicedQty: 3, unitPrice: 1600, taxPct: 18, total: 5664, damagedQty: 0, note: 'High quality' }
      ]
    },
    aiInsights: [
      { title: 'Chai + Samosa Combo Power', text: '83% of evening orders contain both Chai and Samosas. Auto-bundle them at ₹80 (saving ₹10) to boost check speed by 40%.', type: 'growth', action: 'Enable Evening Combo' },
      { title: 'Capital Tied in Retail Specialty Beans', text: '₹11,220 tied in Decaf and Matcha Retail tins (>42 days). Offer a free cold brew sample with every tin purchase.', type: 'warning', action: 'Create Tasting Promo' },
      { title: 'Peak Rush Hour Coming', text: 'Historical data shows 5:00 PM - 7:30 PM generates 44% of daily bakery volume. Pre-heat display warmers.', type: 'urgent', action: 'Prep Evening Rush' }
    ],
    marketTrends: {
      trendingKeywords: ['Iced Spanish Latte (+94%)', 'Biscoff Croissants (+80%)', 'Cascara Sparkling Soda (+45%)'],
      regionalHotspots: [{ region: 'Morning Commute 8am-10am', demandScore: 92, topItem: 'Cappuccino & Croissant' }, { region: 'Evening Hangout 5pm-8pm', demandScore: 98, topItem: 'Cutting Chai & Samosa' }],
      benchmarkMargin: '68% - 78%',
      consumerShift: 'High demand for specialty flavored cold brews over standard hot filter coffees.'
    }
  },

  decor: {
    id: 'decor',
    name: 'Home Decor & Boutique',
    tagline: 'Artisanal ceramics, candles, planters, and bohemian accents',
    icon: 'fa-couch',
    accentColor: 'teal',
    badge: 'Design & Living',
    currency: '₹',
    categories: ['Ceramics & Vases', 'Scented Candles', 'Indoor Planters', 'Wall Hangings', 'Table Accents'],
    commonProducts: [
      { id: 'd1', name: 'Minimalist Fluted Ceramic Vase (Sandstone)', category: 'Ceramics & Vases', unit: '1 pc', costPrice: 380, sellingPrice: 990, stock: 11, reorderLevel: 4, leadTimeDays: 5, dailyVelocity: 1.4, daysIdle: 2, barcode: 'DEC-VASE-01', icon: 'fa-wine-bottle' },
      { id: 'd2', name: 'French Lavender Soy Wax Candle in Jar', category: 'Scented Candles', unit: '220 gm', costPrice: 140, sellingPrice: 450, stock: 24, reorderLevel: 8, leadTimeDays: 3, dailyVelocity: 2.6, daysIdle: 1, barcode: 'DEC-CAND-02', icon: 'fa-fire' },
      { id: 'd3', name: 'Terracotta Ribbed Indoor Planter 8-inch', category: 'Indoor Planters', unit: '1 pc', costPrice: 190, sellingPrice: 520, stock: 15, reorderLevel: 6, leadTimeDays: 4, dailyVelocity: 1.8, daysIdle: 2, barcode: 'DEC-PLAN-03', icon: 'fa-seedling' },
      { id: 'd4', name: 'Boho Macrame Geometric Wall Hanging', category: 'Wall Hangings', unit: '1 pc', costPrice: 280, sellingPrice: 790, stock: 7, reorderLevel: 3, leadTimeDays: 6, dailyVelocity: 1.0, daysIdle: 3, barcode: 'DEC-WALL-04', icon: 'fa-image' },
      { id: 'd5', name: 'Brushed Brass Incense Cone Burner', category: 'Table Accents', unit: '1 pc', costPrice: 160, sellingPrice: 480, stock: 19, reorderLevel: 5, leadTimeDays: 4, dailyVelocity: 1.5, daysIdle: 1, barcode: 'DEC-BRASS-05', icon: 'fa-ring' },
      { id: 'd6', name: 'Woven Natural Jute Coaster Set of 6', category: 'Table Accents', unit: '1 set', costPrice: 90, sellingPrice: 290, stock: 26, reorderLevel: 10, leadTimeDays: 2, dailyVelocity: 2.3, daysIdle: 1, barcode: 'DEC-COAST-06', icon: 'fa-circle' },
      { id: 'd7', name: 'Gilded Baroque Mirror 24-inch (Heavy)', category: 'Wall Hangings', unit: '1 pc', costPrice: 1200, sellingPrice: 2800, stock: 6, reorderLevel: 2, leadTimeDays: 10, dailyVelocity: 0.05, daysIdle: 68, barcode: 'DEC-MIRR-07', icon: 'fa-square' }, // Dead stock
      { id: 'd8', name: 'Sculptural Marble Bookends (Set of 2)', category: 'Table Accents', unit: '1 set', costPrice: 750, sellingPrice: 1800, stock: 8, reorderLevel: 2, leadTimeDays: 8, dailyVelocity: 0.07, daysIdle: 55, barcode: 'DEC-BOOK-08', icon: 'fa-book-bookmark' } // Dead stock
    ],
    sampleInvoice: {
      vendor: 'Heritage Pottery & Living Accents Ltd',
      invoiceNumber: 'HPL-2026-441',
      date: '2026-10-07',
      totalAmount: 21600,
      items: [
        { name: 'Fluted Ceramic Vases Sandstone 10in', invoicedQty: 25, unitPrice: 380, taxPct: 12, total: 10640, damagedQty: 3, note: 'Chipped rim on 3 vases' },
        { name: 'Soy Wax Scented Candles French Lavender', invoicedQty: 40, unitPrice: 140, taxPct: 18, total: 6608, damagedQty: 1, note: 'Cracked glass container' },
        { name: 'Woven Jute Coasters Sets', invoicedQty: 30, unitPrice: 90, taxPct: 12, total: 3024, damagedQty: 0, note: 'Intact' }
      ]
    },
    aiInsights: [
      { title: 'Vases Search Surge (+34%)', text: 'Ceramic Vases are up 34% in regional search volume this month. Give them front-window display positioning to drive footfall.', type: 'growth', action: 'Feature in Front Display' },
      { title: 'Dead Capital in Heavy Mirrors & Marble Bookends', text: '₹13,200 tied up in Baroque Mirrors & Marble Bookends (>55 days idle). Offer 15% off with free delivery.', type: 'warning', action: 'Apply Clearance Discount' },
      { title: 'Candle + Coaster High Conversion', text: 'Pairing Candles with Jute Coaster sets increases checkout basket value by ₹290. Activate bundling.', type: 'urgent', action: 'Setup Gift Bundle' }
    ],
    marketTrends: {
      trendingKeywords: ['Wabi-Sabi ceramics (+85%)', 'Soy candle sets with wooden wicks (+68%)', 'Brushed brass accents (+52%)'],
      regionalHotspots: [{ region: 'Interior Design Studios', demandScore: 94, topItem: 'Ceramic Vases' }, { region: 'Gifting & Festive Popups', demandScore: 91, topItem: 'Scented Candle Sets' }],
      benchmarkMargin: '55% - 68%',
      consumerShift: 'Move away from plastic home decor toward organic ceramic, terracotta, and earthy jute materials.'
    }
  }
};

window.NICHE_PRESETS = NICHE_PRESETS;

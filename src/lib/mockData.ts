export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subCategory?: string;
  images: string[];
  variants: {
    size: string[];
    color: string[];
  };
  inStock: boolean;
  inventory?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  priceAtTime: number; name?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
  customerName?: string;
  customerEmail?: string;
  paymentMethod?: string;
  shippingAddress?: {
    address: string;
    city: string;
    zip: string;
    country: string;
  };
}

const brands = ["Atelier Sovereign", "Halifax Heritage", "Stockholm Studio", "Sartorial Mill", "Loom & Craft"];
const materials = ["Yak Wool", "Superfine Merino", "Organic Silk", "Raw Selvedge", "Cashmere Blend", "Donegal Tweed", "Alpaca Fleece"];
const fits = ["Oversized", "Tailored", "Relaxed Boxy", "Slim Tapered", "Classic Drape"];

export const mockCategories = [
  "Men", "Women", "Watches", "Classic", "Accessories", "Footwear", 
  "Kids & Youth", "Sportswear", "Loungewear", "Heritage", "Sale"
];

export const mockSubCategories: Record<string, string[]> = {
  "Men": [
    "Atelier Overcoats", "Savile Row Tailoring", "Superfine Knitwear", 
    "Mulberry Silk Shirts", "Egyptian Cotton Tops", "Hand-Dyed Denim", 
    "Travel Loungewear", "Sartorial Blazers", "Vicuña Sweaters", 
    "Fine Leather Jackets", "Chino Trousers", "Active Shells"
  ],
  "Women": [
    "Atelier Capes", "Milanese Tailoring", "Cashmere Cardigans", 
    "Mulberry Silk Blouses", "Sea Island Tops", "Pleated Midi Skirts", 
    "Evening Gowns", "Fine Bouclé Blazers", "Baby Alpaca Knits", 
    "Lambskin Trenches", "Silk Lounge Pants", "Active Sport Sets"
  ],
  "Watches": [
    "Men's Watches", "Women's Watches", "Kids' Watches"
  ],
  "Classic": [
    "Bespoke Tuxedos", "Double-Breasted Blazers", "Flannel Trousers", 
    "Poplin Dress Shirts", "Selvedge Denim", "Tweed Waistcoats", 
    "Cashmere Waistcoats", "Formal Overcoats", "Linen Day Suits", 
    "Velvet Smoking Jackets", "Plissé Separates", "Gabardine Trench"
  ],
  "Accessories": [
    "Exotic Leather Bags", "Mulberry Silk Scarves", "Cashmere Travel Wraps", 
    "Alligator Wallets", "Fine Knit Beanies", "Suede Handbags", 
    "Bridle Leather Belts", "Pashmina Shawls", "Shearling Gloves", 
    "Travel Document Portfolios", "Bespoke Luggage", "Wool Felt Hats"
  ],
  "Footwear": [
    "Cordovan Loafers", "Sartorial Chelsea Boots", "Monk Strap Shoes", 
    "Court Sneakers", "Vibram Mountain Boots", "Vachetta Slippers", 
    "Velvety Slippers", "Dress Oxfords", "Grained Leather Derbies", 
    "Suede Desert Boots", "Loomed Knit Trainers", "Alligator Slippers"
  ],
  "Kids & Youth": [
    "Organic Rompers", "Mini Sherpa Jackets", "Baby Cashmere Hoodies", 
    "Merino Sleep Sacks", "Loomed Cardigans", "Linen Play Dresses", 
    "Soft Fleece Suits", "Toddler Knit Caps", "Infant Silk Booties", 
    "Wool Tailored Coats", "Jersey Essentials", "Holiday Velveteen"
  ],
  "Sportswear": [
    "Alpine Shell Jackets", "Merino Run Tees", "Thermal Compression Pants", 
    "Packable Anoraks", "Ventilated Tops", "Insulated Active Vests", 
    "Waterproof Track Pants", "Stretch Tennis Polos", "Performance Active Hoodies", 
    "Breathable Track Shorts", "Fleece Midlayers", "Seamless Base Layers"
  ],
  "Loungewear": [
    "Waffle Linen Robes", "Cashmere Sleep Joggers", "Shearling Slippers", 
    "Silk Pajama Sets", "Unwind Knit Sweaters", "Plush Fleece Wraps", 
    "Organic Lounge Hoodies", "Mulberry Silk Robes", "Ribbed Culottes", 
    "Cotton Knit Slacks", "Merino Lounge Socks", "Thermal Kimonos"
  ],
  "Heritage": [
    "Harris Tweed Coats", "Aran Hand-Knitted Sweaters", "Gotland Felt Capes", 
    "Fair Isle Cardigans", "Donegal Tweed Jackets", "Bespoke Cable Knits", 
    "Icelandic Lopi Sweaters", "Loom-Woven Shawls", "Celtic Cable Vests", 
    "Highland Wool Kilts", "Archival Indigo Smocks", "Hand-Carded Fleece"
  ],
  "Sale": [
    "Archival Knitwear Sale", "Sartorial Outerwear Sale", "Luxury Accessories Sale", 
    "Bespoke Footwear Sale", "Summer Linen Sale", "Winter Fleece Sale", 
    "Tailoring Archive Sale", "Silk Separates Sale", "Kids Sample Sale", 
    "Leather Goods Sale", "Sport Performance Sale", "Loungewear Sample Sale"
  ]
};

function getCategoryImages(normalizedSubCat: string, category: string): string[] {
  const norm = normalizedSubCat.toLowerCase() + " " + category.toLowerCase();
  
  // 1. Kids & Youth (highest priority to avoid kids clothes matching adult jacket/shoes/knit checks)
  if (category.toLowerCase().includes("kids") || category.toLowerCase().includes("youth") || norm.includes("kid") || norm.includes("youth") || norm.includes("baby") || norm.includes("toddler") || norm.includes("romper")) {
    return ["1519689680058-324335c77ebe", "1519457431-44ccd64a579b", "1522771739844-6a9f6d5f14af", "1503919545889-aef636e10ad4"];
  }

  // 2. Watches
  if (category.toLowerCase().includes("watch") || norm.includes("watch") || norm.includes("timepiece")) {
    return ["1524592094714-0f0654e20314", "1522312346375-d1a52e2b99b3", "1542496658-e33a6d0d50f6", "1587836374828-cb4387061d43", "1508685096489-7aacd43bd3b1", "1509048191080-d2984bad6ae5", "1623998021450-85c29c644e0d", "1614164185128-e4ec99c436d7", "1594535182308-4fd0fc7490f2", "1523170335258-f5ed11844a49"];
  }

  // 3. Footwear
  if (category.toLowerCase().includes("footwear") || norm.includes("footwear") || norm.includes("shoe") || norm.includes("sneaker") || norm.includes("boot") || norm.includes("loafer") || norm.includes("slipper") || norm.includes("derby") || norm.includes("derbies") || norm.includes("oxford") || norm.includes("trainer")) {
    return ["1533867617858-e7b97e060509", "1525966222134-fcfa99b8ae77", "1638247025967-b4e38f787b76", "1542291026-7eec264c27ff", "1614252369475-531eba835eb1", "1520639968763-0adb411874b8", "1549298916-b41d501d3772"];
  }

  // 4. Accessories
  if (category.toLowerCase().includes("accessories") || norm.includes("bag") || norm.includes("wallet") || norm.includes("luggage") || norm.includes("leather") || norm.includes("hat") || norm.includes("beanie") || norm.includes("cap") || norm.includes("glove") || norm.includes("gloves") || norm.includes("belt") || norm.includes("scarf") || norm.includes("scarves") || norm.includes("shawl") || norm.includes("wrap")) {
    return ["1590874103328-eac38a683ce7", "1627123424574-724758594e93", "1618220179428-22790b461013", "1576871337622-98d48d1cf531", "1520903074187-fc58d41df38d", "1601924994987-69e26d50dc26", "1534215754734-18e55d13ce3a", "1516826957135-700dedea698c", "1624378439575-d8705ad7ae80"];
  }

  // 5. Women (explicit check to exclude dress shirts)
  const isDressShirt = norm.includes("dress shirt") || norm.includes("dress shirts");
  if (!isDressShirt && (category.toLowerCase().includes("women") || norm.includes("women") || norm.includes("dress") || norm.includes("skirt") || norm.includes("gown") || norm.includes("blouse") || norm.includes("cape"))) {
    return ["1595777457583-95e059f581ce", "1490481651871-ab68de25d43d", "1509631179647-0177331693ae", "1483985988355-763728e1935b", "1515886657613-9f3515b0c78f"];
  }

  // 6. Overcoats & Outerwear
  if (norm.includes("overcoat") || norm.includes("cape") || norm.includes("trench") || norm.includes("jacket") || norm.includes("vest") || norm.includes("parka") || norm.includes("anorak") || norm.includes("shell") || norm.includes("coat")) {
    return ["1544816155-12df9643f363", "1539571696357-5a69c17a67c6", "1548883354-7622d03aca27", "1591047139829-d91aecb6caea"];
  }

  // 7. Knitwear, Sweaters & Cardigans
  if (norm.includes("knitwear") || norm.includes("sweater") || norm.includes("cardigan") || norm.includes("fleece") || norm.includes("alpaca") || norm.includes("hoodie") || norm.includes("cashmere")) {
    return ["1620799140188-3b2a02fd9a77", "1434389677669-e08b4cac3105", "1614975058789-41316d0e2e9c", "1515886657613-9f3515b0c78f"];
  }

  // 8. Tailoring, Suits & Blazers
  if (norm.includes("tailoring") || norm.includes("suit") || norm.includes("blazer") || norm.includes("tuxedo") || norm.includes("classic")) {
    return ["1507679799987-c73779587ccf", "1591047139829-d91aecb6caea", "1624378439575-d8705ad7ae80", "1583743814966-8936f5b7be1a"];
  }

  // 9. Sportswear
  if (category.toLowerCase().includes("sport") || norm.includes("sport") || norm.includes("active") || norm.includes("run") || norm.includes("compression")) {
    return ["1548883354-7622d03aca27", "1508962914676-134849a727f0", "1550614000431-b6630f78bf8f"];
  }

  // 10. Loungewear
  if (category.toLowerCase().includes("lounge") || norm.includes("lounge") || norm.includes("robe") || norm.includes("sleep") || norm.includes("relax")) {
    return ["1556821840-3a63f95609a7", "1618220179428-22790b461013", "1603561591411-07134e71a2a9"];
  }

  // 11. Shirts/Tops if they fall here
  if (norm.includes("shirt") || norm.includes("shirts") || norm.includes("top") || norm.includes("tops") || norm.includes("tee") || norm.includes("tees") || norm.includes("polo") || norm.includes("polos") || norm.includes("blouse")) {
    return ["1521572163474-6864f9cf17ab", "1581044777550-4cfa60707c03", "1475180098004-ca60009d185b"];
  }

  // 12. Pants, Trousers & Denim if they fall here
  if (norm.includes("pant") || norm.includes("pants") || norm.includes("trouser") || norm.includes("trousers") || norm.includes("chino") || norm.includes("chinos") || norm.includes("denim") || norm.includes("jeans")) {
    return ["1541099649105-f69ad21f3246", "1485462537746-965f33f7f6a7"];
  }
  
  return ["1521572163474-6864f9cf17ab", "1539571696357-5a69c17a67c6", "1485462537746-965f33f7f6a7", "1567113463300-102a92c74d6f", "1581044777550-4cfa60707c03", "1475180098004-ca60009d185b"];
}

export function resolveProductImage(imageSrc: string | undefined): string {
  const defaultFallback = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800';
  if (!imageSrc) {
    return defaultFallback;
  }
  
  if (imageSrc.startsWith('http://') || imageSrc.startsWith('https://') || imageSrc.startsWith('data:')) {
    return imageSrc;
  }

  // It is a clean custom filename like "brand-fit-mat-noun-color-id.jpg"
  const filename = imageSrc.split('/').pop() || imageSrc;
  
  // Extract name for prompt
  let prompt = filename.replace('.jpg', '').replace(/-[0-9]+$/, '').replace(/-/g, ' ');
  if (!prompt) prompt = "clothing product";
  
  // Create a highly detailed prompt
  const fullPrompt = `High quality product photography of ${prompt}, minimalist background, studio lighting`;

  // Use pollinations.ai to generate a unique image based on the prompt
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(fullPrompt)}?width=800&height=800&nologo=true`;
}

export function getMatchingImageForProduct(name: string, category: string, subCategory: string): string {
  let cleanName = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
  if (!cleanName) cleanName = 'product';
  const slugCat = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const sum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return `${slugCat}-${cleanName}-${sum % 10000}.jpg`;
}

const colorsPool = [
  ["Smoked Amber", "Charcoal Black"], ["Oatmeal Melange", "Dark Moss"],
  ["Raw Indigo", "Light Blue Sand"], ["Pure Ivory", "Ember Scarlet"],
  ["Ash Grey", "Camel Tan"], ["Olive Guard", "Midnight Sapphire"]
];

const sizesPool = {
  apparel: ["S", "M", "L", "XL"], pants: ["30", "32", "34", "36"],
  footwear: ["8", "9", "10", "11", "12"], accessories: ["One Size"],
  kids: ["3-6m", "6-12m", "12-18m", "2T", "3T"]
};

const generatedProducts: Product[] = [];
let globalCounter = 0;

for (const category of mockCategories) {
  const subCats = mockSubCategories[category] || [];
  for (const subCat of subCats) {
    // Create 15 items per subcategory
    for (let i = 0; i < 15; i++) {
        globalCounter++;
        const brand = brands[globalCounter % brands.length];
        const mat = materials[globalCounter % materials.length];
        const fit = fits[globalCounter % fits.length];
        const noun = subCat.split(' ').pop() || "Garment";
        
        const name = `${brand} ${fit} ${mat} ${noun}`;
        const desc = `Sourced directly from certified organic collectives, this exceptional piece is crafted from premium ${mat.toLowerCase()}. Finished with a clean ${fit.toLowerCase()} silhouette, embodying our modern heritage.`;
        
        const basePrice = Math.floor(120 + ((globalCounter * 25.5) % 400));
        const finalPrice = Math.round(basePrice / 5) * 5; 
        let originalPrice = category === "Sale" ? finalPrice * 2 : undefined;
        
        let variantSizes = sizesPool.apparel;
        if (category === "Footwear") variantSizes = sizesPool.footwear;
        if (category === "Accessories" || category === "Watches") variantSizes = sizesPool.accessories;
        if (category === "Kids & Youth") variantSizes = sizesPool.kids;
        
        const variantColors = colorsPool[globalCounter % colorsPool.length];
        const primaryColor = variantColors[0];

        // Format clean name parts to lowercase slugs
        const brandSlug = brand.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const fitSlug = fit.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const matSlug = mat.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const nounSlug = noun.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const colorSlug = primaryColor.toLowerCase().replace(/[^a-z0-9]+/g, '-');

        // Formulate a 100% unique beautifully matching image filename!
        const finalImage = `${brandSlug}-${fitSlug}-${matSlug}-${nounSlug}-${colorSlug}-${globalCounter}.jpg`;

        generatedProducts.push({
            id: `p_gen_${globalCounter}`,
            name,
            description: desc,
            price: finalPrice,
            originalPrice,
            category,
            subCategory: subCat,
            images: [finalImage],
            variants: { size: variantSizes, color: variantColors },
            inStock: globalCounter % 20 !== 0,
            inventory: (globalCounter % 20 !== 0) ? Math.floor(10 + ((globalCounter * 7) % 50)) : 0
        });
    }
  }
}

export const mockProducts = generatedProducts;

export const mockUsers: User[] = [
  { id: "u_1", name: "Alex Johnson", email: "alex.johnson@example.com" }
];

export const mockOrders = [
  {
    id: "ord_1", userId: "u_1", total: 440.00, status: "DELIVERED",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    items: [{ id: "oi_1", productId: "p_gen_1", quantity: 2, priceAtTime: 220.00, name: "The Wooltown Standard" }],
    customerName: "Alex Johnson",
    customerEmail: "alex.johnson@example.com",
    paymentMethod: 'VISA',
    shippingAddress: {
      address: "123 Main St",
      city: "Stockholm",
      zip: "111 22",
      country: "SE"
    }
  }
];

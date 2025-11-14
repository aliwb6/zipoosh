export const products = [
  // مردانه - تیشرت
  { 
    id: 1, 
    name: 'تیشرت مشکی ساده', 
    category: 'men', 
    subcategory: 'tshirt', 
    price: 250000, 
    oldPrice: 350000,
    image: '👕',
    images: ['👕', '👕', '👕'],
    description: 'تیشرت مشکی ساده با پارچه نخ پنبه درجه یک مناسب برای استفاده روزمره',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['مشکی', 'سفید', 'خاکستری'],
    inStock: true,
    badge: 'تخفیف',
    rating: 4.5,
    reviews: 23
  },
  { 
    id: 2, 
    name: 'تیشرت آستین کوتاه', 
    category: 'men', 
    subcategory: 'tshirt', 
    price: 280000,
    image: '👕',
    images: ['👕', '👕', '👕'],
    description: 'تیشرت آستین کوتاه با طراحی مدرن',
    sizes: ['S', 'M', 'L'],
    colors: ['آبی', 'خاکستری'],
    inStock: true,
    badge: 'جدید',
    rating: 4.3,
    reviews: 15
  },
  
  // مردانه - پیراهن
  { 
    id: 3, 
    name: 'پیراهن مجلسی سفید', 
    category: 'men', 
    subcategory: 'shirt', 
    price: 450000,
    image: '👔',
    images: ['👔', '👔', '👔'],
    description: 'پیراهن مجلسی سفید با پارچه درجه یک',
    sizes: ['M', 'L', 'XL'],
    colors: ['سفید', 'آبی روشن'],
    inStock: true,
    rating: 4.7,
    reviews: 31
  },
  { 
    id: 4, 
    name: 'پیراهن چهارخانه', 
    category: 'men', 
    subcategory: 'shirt', 
    price: 380000,
    image: '👔',
    images: ['👔', '👔', '👔'],
    description: 'پیراهن چهارخانه کژوال',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['قرمز', 'آبی'],
    inStock: true,
    badge: 'پرفروش',
    rating: 4.6,
    reviews: 28
  },
  
  // مردانه - شلوار
  { 
    id: 5, 
    name: 'شلوار جین آبی', 
    category: 'men', 
    subcategory: 'pants', 
    price: 520000,
    image: '👖',
    images: ['👖', '👖', '👖'],
    description: 'شلوار جین آبی با پارچه مرغوب',
    sizes: ['30', '32', '34'],
    colors: ['آبی'],
    inStock: true,
    rating: 5,
    reviews: 42
  },
  { 
    id: 6, 
    name: 'شلوار کتان', 
    category: 'men', 
    subcategory: 'pants', 
    price: 390000,
    image: '👖',
    images: ['👖', '👖', '👖'],
    description: 'شلوار کتان راحت و خنک',
    sizes: ['M', 'L', 'XL'],
    colors: ['بژ', 'خاکستری'],
    inStock: true,
    rating: 4.4,
    reviews: 19
  },
  
  // مردانه - کت و شلوار
  { 
    id: 7, 
    name: 'کت و شلوار مشکی', 
    category: 'men', 
    subcategory: 'suit', 
    price: 1850000,
    oldPrice: 2200000,
    image: '🤵',
    images: ['🤵', '🤵', '🤵'],
    description: 'کت و شلوار مشکی مجلسی',
    sizes: ['M', 'L', 'XL'],
    colors: ['مشکی', 'سرمه‌ای'],
    inStock: true,
    badge: 'تخفیف',
    rating: 4.8,
    reviews: 37
  },
  { 
    id: 8, 
    name: 'کت و شلوار طوسی', 
    category: 'men', 
    subcategory: 'suit', 
    price: 1650000,
    image: '🤵',
    images: ['🤵', '🤵', '🤵'],
    description: 'کت و شلوار طوسی کلاسیک',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['طوسی'],
    inStock: true,
    rating: 4.7,
    reviews: 25
  },
  
  // زنانه - مانتو
  { 
    id: 9, 
    name: 'مانتو بلند مشکی', 
    category: 'women', 
    subcategory: 'manteau', 
    price: 680000,
    image: '🧥',
    images: ['🧥', '🧥', '🧥'],
    description: 'مانتو بلند مشکی با پارچه درجه یک',
    sizes: ['S', 'M', 'L'],
    colors: ['مشکی', 'سرمه‌ای'],
    inStock: true,
    badge: 'جدید',
    rating: 4.6,
    reviews: 33
  },
  { 
    id: 10, 
    name: 'مانتو کوتاه طوسی', 
    category: 'women', 
    subcategory: 'manteau', 
    price: 590000,
    image: '🧥',
    images: ['🧥', '🧥', '🧥'],
    description: 'مانتو کوتاه طوسی مدرن',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['طوسی', 'بژ'],
    inStock: true,
    rating: 4.5,
    reviews: 29
  },
  
  // زنانه - شلوار
  { 
    id: 11, 
    name: 'شلوار راسته مشکی', 
    category: 'women', 
    subcategory: 'pants', 
    price: 450000,
    image: '👖',
    images: ['👖', '👖', '👖'],
    description: 'شلوار راسته مشکی زنانه',
    sizes: ['S', 'M', 'L'],
    colors: ['مشکی', 'سرمه‌ای'],
    inStock: true,
    rating: 4.7,
    reviews: 21
  },
  { 
    id: 12, 
    name: 'شلوار جین زنانه', 
    category: 'women', 
    subcategory: 'pants', 
    price: 480000,
    image: '👖',
    images: ['👖', '👖', '👖'],
    description: 'شلوار جین زنانه با برش عالی',
    sizes: ['26', '28', '30', '32'],
    colors: ['آبی'],
    inStock: true,
    badge: 'پرفروش',
    rating: 4.8,
    reviews: 45
  },
  
  // زنانه - تونیک
  { 
    id: 13, 
    name: 'تونیک گلدار', 
    category: 'women', 
    subcategory: 'tunic', 
    price: 320000,
    image: '👗',
    images: ['👗', '👗', '👗'],
    description: 'تونیک گلدار با طرح زیبا',
    sizes: ['S', 'M', 'L'],
    colors: ['صورتی', 'آبی'],
    inStock: true,
    rating: 4.4,
    reviews: 18
  },
  { 
    id: 14, 
    name: 'تونیک ساده', 
    category: 'women', 
    subcategory: 'tunic', 
    price: 290000,
    image: '👗',
    images: ['👗', '👗', '👗'],
    description: 'تونیک ساده و شیک',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['مشکی', 'سفید'],
    inStock: true,
    rating: 4.3,
    reviews: 16
  },
  
  // بچگانه - پسرانه
  { 
    id: 15, 
    name: 'ست تیشرت و شلوارک پسرانه', 
    category: 'kids', 
    subcategory: 'boys', 
    price: 280000,
    image: '👦',
    images: ['👦', '👦', '👦'],
    description: 'ست تیشرت و شلوارک پسرانه',
    sizes: ['2', '4', '6', '8'],
    colors: ['آبی', 'قرمز'],
    inStock: true,
    badge: 'جدید',
    rating: 4.6,
    reviews: 22
  },
  { 
    id: 16, 
    name: 'پیراهن پسرانه', 
    category: 'kids', 
    subcategory: 'boys', 
    price: 220000,
    image: '👦',
    images: ['👦', '👦', '👦'],
    description: 'پیراهن پسرانه شیک',
    sizes: ['4', '6', '8'],
    colors: ['سفید', 'آبی'],
    inStock: true,
    rating: 4.5,
    reviews: 14
  },
  
  // بچگانه - دخترانه
  { 
    id: 17, 
    name: 'پیراهن دخترانه', 
    category: 'kids', 
    subcategory: 'girls', 
    price: 260000,
    image: '👧',
    images: ['👧', '👧', '👧'],
    description: 'پیراهن دخترانه زیبا',
    sizes: ['2', '4', '6', '8'],
    colors: ['صورتی', 'بنفش'],
    inStock: true,
    rating: 4.7,
    reviews: 26
  },
  { 
    id: 18, 
    name: 'ست دخترانه', 
    category: 'kids', 
    subcategory: 'girls', 
    price: 310000,
    image: '👧',
    images: ['👧', '👧', '👧'],
    description: 'ست کامل دخترانه',
    sizes: ['4', '6', '8'],
    colors: ['صورتی', 'سفید'],
    inStock: true,
    badge: 'پرفروش',
    rating: 4.8,
    reviews: 31
  }
];

export const getProductById = (id) => {
  return products.find(product => product.id === parseInt(id));
};

export const getProductsByCategory = (category) => {
  if (!category) return products;
  return products.filter(product => product.category === category);
};

export const getProductsByCategoryAndSubcategory = (category, subcategory) => {
  if (!category) return products;
  if (!subcategory) return getProductsByCategory(category);
  return products.filter(product => 
    product.category === category && product.subcategory === subcategory
  );
};

export const getFeaturedProducts = () => {
  return products.filter(product => product.badge).slice(0, 8);
};
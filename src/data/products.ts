// Product images (using string paths; you can later place matching files under /public/products)
const carDragon = "/products/car-dragon.png";
const carNeon = "/products/car-neon.png";
const carIce = "/products/car-ice.png";
const weaponGalaxy = "/products/weapon-galaxy.png";
const weaponPlasma = "/products/weapon-plasma.png";
const weaponShadow = "/products/weapon-shadow.png";
const weaponGold = "/products/weapon-gold.png";
const charNinja = "/products/char-ninja.png";
const charMarine = "/products/char-marine.png";
const charGuardian = "/products/char-guardian.png";
const bundleUltimate = "/products/bundle-ultimate.png";
const bundleStarter = "/products/bundle-starter.png";

export interface Product {
  id: string;
  name: string;
  nameAr: string;
  price: number;
  originalPrice?: number;
  category: string;
  categoryAr: string;
  image: string;
  description: string;
  descriptionAr: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  gradient: string;
}

export const categories = [
  { id: 'all', name: 'الكل', icon: '🎮' },
  { id: 'cars', name: 'سكنات سيارات', icon: '🏎️' },
  { id: 'weapons', name: 'سكنات أسلحة', icon: '🔫' },
  { id: 'characters', name: 'سكنات شخصيات', icon: '👤' },
  { id: 'bundles', name: 'حزم خاصة', icon: '📦' },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Dragon Flame Car',
    nameAr: 'سيارة التنين الناري',
    price: 29.99,
    originalPrice: 49.99,
    category: 'cars',
    categoryAr: 'سكنات سيارات',
    image: carDragon,
    description: 'Legendary dragon-themed car skin with flame effects',
    descriptionAr: 'سكن سيارة أسطوري بتأثيرات اللهب والتنين المضيء',
    rarity: 'legendary',
    gradient: 'from-orange-500 via-red-500 to-yellow-500',
  },
  {
    id: '2',
    name: 'Neon Racer',
    nameAr: 'المتسابق النيوني',
    price: 19.99,
    category: 'cars',
    categoryAr: 'سكنات سيارات',
    image: carNeon,
    description: 'Cyberpunk-style neon racing car skin',
    descriptionAr: 'سكن سيارة سباق بأسلوب سايبربانك نيوني متوهج',
    rarity: 'epic',
    gradient: 'from-cyan-400 via-blue-500 to-purple-600',
  },
  {
    id: '3',
    name: 'Ice Storm',
    nameAr: 'العاصفة الجليدية',
    price: 14.99,
    category: 'cars',
    categoryAr: 'سكنات سيارات',
    image: carIce,
    description: 'Frozen-themed car with ice particle effects',
    descriptionAr: 'سيارة جليدية كريستالية مع تأثيرات جزيئات الثلج',
    rarity: 'rare',
    gradient: 'from-blue-300 via-cyan-400 to-teal-500',
  },
  {
    id: '4',
    name: 'Galaxy Destroyer',
    nameAr: 'مدمر المجرة',
    price: 34.99,
    originalPrice: 59.99,
    category: 'weapons',
    categoryAr: 'سكنات أسلحة',
    image: weaponGalaxy,
    description: 'Legendary weapon skin with galaxy effect',
    descriptionAr: 'سكن سلاح أسطوري بتأثير المجرة والنجوم المتلألئة',
    rarity: 'legendary',
    gradient: 'from-purple-500 via-indigo-600 to-blue-700',
  },
  {
    id: '5',
    name: 'Plasma Rifle',
    nameAr: 'بندقية البلازما',
    price: 24.99,
    category: 'weapons',
    categoryAr: 'سكنات أسلحة',
    image: weaponPlasma,
    description: 'Futuristic plasma weapon skin with glow effects',
    descriptionAr: 'سكن سلاح بلازما مستقبلي مع تأثيرات التوهج الأخضر',
    rarity: 'epic',
    gradient: 'from-green-400 via-emerald-500 to-teal-600',
  },
  {
    id: '6',
    name: 'Shadow Blade',
    nameAr: 'نصل الظلام',
    price: 12.99,
    category: 'weapons',
    categoryAr: 'سكنات أسلحة',
    image: weaponShadow,
    description: 'Dark-themed weapon with shadow particles',
    descriptionAr: 'سيف مظلم غامض مع جزيئات الظل البنفسجية',
    rarity: 'rare',
    gradient: 'from-gray-600 via-slate-700 to-zinc-800',
  },
  {
    id: '7',
    name: 'Cyber Ninja',
    nameAr: 'النينجا السيبراني',
    price: 39.99,
    originalPrice: 69.99,
    category: 'characters',
    categoryAr: 'سكنات شخصيات',
    image: charNinja,
    description: 'Legendary cyberpunk ninja character skin',
    descriptionAr: 'سكن شخصية نينجا سايبربانك أسطوري مع درع متوهج',
    rarity: 'legendary',
    gradient: 'from-red-500 via-pink-500 to-purple-600',
  },
  {
    id: '8',
    name: 'Space Marine',
    nameAr: 'جندي الفضاء',
    price: 22.99,
    category: 'characters',
    categoryAr: 'سكنات شخصيات',
    image: charMarine,
    description: 'Epic space marine character skin with armor',
    descriptionAr: 'سكن شخصية جندي فضاء ملحمي مع درع تكتيكي أزرق',
    rarity: 'epic',
    gradient: 'from-blue-500 via-indigo-500 to-violet-600',
  },
  {
    id: '9',
    name: 'Forest Guardian',
    nameAr: 'حارس الغابة',
    price: 9.99,
    category: 'characters',
    categoryAr: 'سكنات شخصيات',
    image: charGuardian,
    description: 'Nature-themed character skin',
    descriptionAr: 'سكن شخصية حارس الطبيعة مع هالة سحرية خضراء',
    rarity: 'common',
    gradient: 'from-green-500 via-lime-500 to-emerald-600',
  },
  {
    id: '10',
    name: 'Ultimate Bundle',
    nameAr: 'الحزمة المطلقة',
    price: 79.99,
    originalPrice: 149.99,
    category: 'bundles',
    categoryAr: 'حزم خاصة',
    image: bundleUltimate,
    description: 'All legendary skins in one bundle',
    descriptionAr: 'جميع السكنات الأسطورية في حزمة واحدة مذهلة',
    rarity: 'legendary',
    gradient: 'from-yellow-400 via-orange-500 to-red-600',
  },
  {
    id: '11',
    name: 'Starter Pack',
    nameAr: 'حزمة المبتدئين',
    price: 19.99,
    originalPrice: 39.99,
    category: 'bundles',
    categoryAr: 'حزم خاصة',
    image: bundleStarter,
    description: 'Perfect starter pack for new players',
    descriptionAr: 'حزمة مثالية للاعبين الجدد مع مكافآت متنوعة',
    rarity: 'rare',
    gradient: 'from-sky-400 via-blue-500 to-indigo-600',
  },
  {
    id: '12',
    name: 'Golden AK-47',
    nameAr: 'AK-47 الذهبي',
    price: 44.99,
    category: 'weapons',
    categoryAr: 'سكنات أسلحة',
    image: weaponGold,
    description: 'Exclusive golden weapon skin',
    descriptionAr: 'سكن سلاح ذهبي فاخر مرصع بالألماس',
    rarity: 'legendary',
    gradient: 'from-yellow-300 via-amber-400 to-orange-500',
  },
];

export const rarityColors = {
  common: 'border-gray-500/50',      // رصاصي
  rare: 'border-purple-400/50',      // بنفسجي
  epic: 'border-green-400/50',       // أخضر
  legendary: 'border-yellow-400/50', // ذهبي
};

export const rarityLabels = {
  common: 'عادي',
  rare: 'نادر',
  epic: 'متوسط',
  legendary: 'أسطوري',
};

export const rarityGlow = {
  common: 'shadow-[0_0_20px_hsl(220_10%_50%/0.3)]',      // رصاصي
  rare: 'shadow-[0_0_25px_hsl(270_80%_60%/0.4)]',         // بنفسجي
  epic: 'shadow-[0_0_25px_hsl(120_80%_50%/0.4)]',         // أخضر
  legendary: 'shadow-[0_0_30px_hsl(45_100%_50%/0.4)]',    // ذهبي
};

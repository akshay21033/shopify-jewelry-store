import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'aurelia-pearl-necklace',
    name: 'Aurelia Pearl Drop Pendant',
    category: 'Necklaces',
    price: 1450,
    description: 'A timeless expression of organic grace. Featuring a single, hand-selected lustrous South Sea pearl suspended from a delicate, liquid-like 18-karat yellow gold chain. Each pearl is chosen for its exceptional luster, perfectly round contour, and silver-rose undertone, making each pendant entirely unique.',
    details: [
      '18-karat yellow gold chain & mounting',
      'Hand-selected 11-12mm South Sea pearl',
      'Adjustable chain length: 16" to 18"',
      'Lobster clasp with signature Isabella Sofia emblem',
      'Handcrafted in our boutique atelier'
    ],
    materials: ['18k Yellow Gold', 'South Sea Pearl'],
    image: '/src/assets/images/pearl_drop_necklace_1783020800288.jpg',
    rating: 4.9,
    inStock: true,
    featured: true
  },
  {
    id: 'eternity-diamond-ring',
    name: 'Eternity Diamond Band',
    category: 'Rings',
    price: 2800,
    description: 'A continuous, unbroken circle of light. This exquisite eternity band is masterfully set with brilliant-cut conflict-free diamonds. Each diamond is calibrated to perfection and set in a delicate 18-karat gold channel that allows maximum light reflection, delivering an unparalleled sparkle from every angle.',
    details: [
      '18-karat yellow gold eternity setting',
      'Total carat weight: approximately 1.75 ctw (varies by size)',
      'Diamond color: G-H, Clarity: VS2+',
      'Smooth inner comfort-fit design',
      'Accompanied by a certificate of authenticity'
    ],
    materials: ['18k Yellow Gold', 'Round-Cut Diamonds'],
    image: '/src/assets/images/eternity_diamond_ring_1783020787947.jpg',
    rating: 5.0,
    inStock: true,
    featured: true
  },
  {
    id: 'architectural-gold-cuff',
    name: 'Architectural Gold Cuff',
    category: 'Bracelets',
    price: 3200,
    description: 'A modern sculptural masterpiece. This solid 18k gold cuff features clean, architectural curves that wrap around the wrist with graceful fluidity. The high-polish mirror finish reflects light with dramatic intensity, combining mid-century modern shapes with high-fashion luxury.',
    details: [
      'Solid 18-karat yellow gold construction',
      'Flexible, comfort-open design for effortless wear',
      'Mirror-polished finish with brushed inner surface',
      'Width: 15mm at widest point',
      'Weight: 28 grams of premium solid gold'
    ],
    materials: ['18k Yellow Gold'],
    image: '/src/assets/images/modernist_cuff_bracelet_1783020810240.jpg',
    rating: 4.8,
    inStock: true,
    featured: true
  },
  {
    id: 'sapphire-platinum-studs',
    name: 'Sapphire Emerald-Cut Studs',
    category: 'Earrings',
    price: 2100,
    description: 'Uncompromising depth and regal elegance. These minimalist earrings feature matched emerald-cut royal blue sapphires secured in a bespoke platinum bezel setting. The clean, crisp rectangular facets of the step-cut sapphires radiate a serene, timeless sophistication.',
    details: [
      'Solid PT950 Platinum mounting and posts',
      'Matched pair of emerald-cut natural blue sapphires',
      'Total sapphire weight: 2.20 carats total',
      'Secure butterfly push-back posts',
      'Ethically sourced in Sri Lanka'
    ],
    materials: ['PT950 Platinum', 'Blue Sapphire'],
    image: '/src/assets/images/sapphire_stud_earrings_1783020819952.jpg',
    rating: 4.9,
    inStock: true,
    featured: true
  },
  {
    id: 'solstice-gold-hoops',
    name: 'Solstice Statement Hoops',
    category: 'Earrings',
    price: 950,
    description: 'The definitive luxury staple, reimagined. Hand-formed from hollow 18-karat gold tubing, these statements hoops offer bold architectural volume without the weight. The classic circular design is elevated by a warm satin-brushed finish and seamless integrated clasp.',
    details: [
      '18-karat yellow gold',
      'Lightweight hollow-core structure for comfortable all-day wear',
      'Outer diameter: 35mm, thickness: 4mm',
      'Satin-brushed exterior with polished interior details',
      'Hinged clasp closure'
    ],
    materials: ['18k Yellow Gold'],
    image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80&w=800',
    rating: 4.7,
    inStock: true,
    featured: false
  },
  {
    id: 'luna-tennis-bracelet',
    name: 'Luna Diamond Tennis Bracelet',
    category: 'Bracelets',
    price: 4900,
    description: 'An elegant cascade of starlight on the wrist. Designed with ultra-low profile settings, our signature tennis bracelet holds 52 brilliant-cut diamonds in an exceptionally flexible platinum mesh. The close-set four-prong layout maximizes brilliance and provides a seamless, uninterrupted row of light.',
    details: [
      'Solid PT950 Platinum setting and clasp',
      '52 round brilliant diamonds, approximately 4.50 ctw',
      'Diamond quality: F-G color, VS1-VS2 clarity',
      'Double-security hidden box clasp',
      'Length: 7 inches (custom sizing available)'
    ],
    materials: ['PT950 Platinum', 'Round-Cut Diamonds'],
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800',
    rating: 5.0,
    inStock: true,
    featured: false
  }
];

export const PHILOSOPHY = {
  title: 'Our Ethical & Artistic Vision',
  quote: '"True luxury lies in simplicity, permanence, and the quiet integrity of the materials we hold close."',
  paragraphs: [
    'At Isabella Sofia, we reject the disposable pace of modern fashion. Our collections are capsule releases designed to transcend seasonal trends, serving as modern heirlooms that tell a lifetime of stories. Every curve is sculpted with architectural precision; every gem is set to dance with the natural daylight.',
    'We are strictly committed to ethical sourcing and sustainable craftsmanship. 100% of our precious metals are recycled or harmoniously mined, and our diamonds are fully certified conflict-free. Handcrafted in our bespoke boutique atelier, each piece is a labor of dedication, refined beauty, and structural perfection.'
  ]
};

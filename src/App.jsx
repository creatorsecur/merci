import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Share2,
  Sparkles,
  AlertCircle,
  Upload,
  X,
  Users,
  Calendar,
  Truck,
  Store,
  Copy,
  CheckCircle2,
  Plus,
  Minus,
  Clock,
  PenTool,
  Maximize2,
  Minimize2,
  Info
} from 'lucide-react';

// ============================================================================
// КОНСТАНТЫ И КАТАЛОГ КОНДИТЕРСКОЙ «MERCI MON CHÉRI»
// ============================================================================

const PRICE_PER_KG = 3600;
const INSCRIPTION_PRICE = 350;
const DELIVERY_PRICE = 650;
const URGENCY_RATE = 0.2; // +20% за срочный заказ на завтра

const WEIGHT_OPTIONS = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];

const SHAPES = [
  {
    id: 'round',
    name: 'Круг',
    french: 'Classique Rond',
    maxWeight: 5,
    minWeight: 1,
    description: 'Вневременной силуэт для любого повода — от камерного чаепития до большого торжества.',
    sizeHint: 'Диаметр 16–26 см · до 5 кг'
  },
  {
    id: 'heart',
    name: 'Сердце',
    french: 'Cœur Romantique',
    maxWeight: 3.5,
    minWeight: 1,
    description: 'Изящная форма с мягкими линиями. Особенно выразительно смотрится с рюшами Ламбет и бантиками.',
    sizeHint: '18–24 см · до 3,5 кг'
  },
  {
    id: 'oval',
    name: 'Овал',
    french: 'Ovale Parisien',
    maxWeight: 3,
    minWeight: 1,
    description: 'Вытянутый европейский формат, вдохновлённый витринами парижских патиссерий.',
    sizeHint: '20×14 – 26×18 см · до 3 кг'
  }
];

const FLAVOR_FILTERS = ['Все', 'Ягодные', 'Шоколадные', 'Без орехов'];

const FLAVORS = [
  {
    id: 'vanilla-raspberry',
    name: 'Ваниль — Малина с маскарпоне',
    french: 'Vanille & Framboise',
    tags: ['Ягодные', 'Без орехов'],
    profile: 'Воздушный бисквит на стручковой мадагаскарской ванили, шёлковый крем с маскарпоне и живое малиновое конфи.',
    sponge: 'Мука пшеничная в/с, фермерские яйца, сливочное масло 82,5%, молоко, сахар, стручок мадагаскарской ванили.',
    filling: 'Сыр маскарпоне, творожный сыр, сливки 33%, свежая малина, пектин NH, сок сицилийского лимона.',
    allergens: 'Глютен, молочные продукты, яйца. Без орехов.',
    slice: {
      sponge: '#F1DAB0',
      spongeDeep: '#D4B683',
      cream: '#FCF8F0',
      creamShade: '#ECE2D2',
      filling: '#B52949',
      fillingHighlight: '#DA5674',
      type: 'raspberry'
    }
  },
  {
    id: 'pistachio-strawberry',
    name: 'Фисташка — Клубника',
    french: 'Pistache & Fraise',
    tags: ['Ягодные'],
    profile: 'Ароматный бисквит на пасте сицилийской фисташки, сливочный крем-чиз и сочное компоте из спелой клубники.',
    sponge: 'Мука пшеничная, паста 100% обжаренной фисташки, сливки 33%, яйца, сахар, щепотка флёр-де-сель.',
    filling: 'Сливочный сыр, сливки 33%, взбитый фисташковый ганаш, пюре и кусочки клубники, пектин.',
    allergens: 'Орехи (фисташка), глютен, молочные продукты, яйца.',
    slice: {
      sponge: '#C3D3A3',
      spongeDeep: '#98AA75',
      cream: '#F8F4EA',
      creamShade: '#E5DEC9',
      filling: '#C73545',
      fillingHighlight: '#E66370',
      type: 'strawberry'
    }
  },
  {
    id: 'belgian-choco-cherry',
    name: 'Бельгийский шоколад и вишня',
    french: 'Chocolat Noir & Griotte',
    tags: ['Шоколадные', 'Ягодные', 'Без орехов'],
    profile: 'Влажный бисквит на тёмном шоколаде 70%, бархатный шоколадный крем и цельная вишня с лёгкой кислинкой.',
    sponge: 'Бельгийский тёмный шоколад, алкализованное какао, мука пшеничная, яйца, молоко, тростниковый сахар.',
    filling: 'Взбитый ганаш на молочном и тёмном шоколаде, сливки 33%, цельная спелая вишня без косточки.',
    allergens: 'Глютен, молочные продукты, яйца, соевый лецитин. Без орехов.',
    slice: {
      sponge: '#462A20',
      spongeDeep: '#2C1811',
      cream: '#B8957E',
      creamShade: '#94725C',
      filling: '#6C1324',
      fillingHighlight: '#9A2B41',
      type: 'cherry'
    }
  },
  {
    id: 'salted-caramel-snickers',
    name: 'Солёная карамель и Сникерс',
    french: 'Caramel Beurre Salé',
    tags: ['Шоколадные'],
    profile: 'Насыщенный шоколадный бисквит, тягучая бретонская карамель с морской солью, хрустящий арахис и сливочный мусс.',
    sponge: 'Тёмный шоколад, какао Extra Brute, мука пшеничная, яйца, кефир, масло сливочное, сахар.',
    filling: 'Домашняя сливочная карамель с морской солью, обжаренный карамелизированный арахис, крем-чиз на молочном шоколаде.',
    allergens: 'Арахис, глютен, молочные продукты, яйца.',
    slice: {
      sponge: '#4E3124',
      spongeDeep: '#331E15',
      cream: '#DFC7AF',
      creamShade: '#C4A68B',
      filling: '#B66C29',
      fillingHighlight: '#D9934C',
      type: 'caramel-nuts'
    }
  },
  {
    id: 'mango-passion',
    name: 'Манго — Маракуйя',
    french: 'Mangue & Passion',
    tags: ['Ягодные', 'Без орехов'],
    profile: 'Тропическая нежность: ванильно-кокосовый бисквит, лёгкий йогуртовый крем и яркое пюре спелого манго с маракуйей.',
    sponge: 'Мука пшеничная, яйца, сливки, кокосовое молоко, сливочное масло, сахар, ваниль.',
    filling: 'Сливочный сыр, сливки 33%, пюре альфонсо-манго, свежий сок маракуйи, белый бельгийский шоколад.',
    allergens: 'Глютен, молочные продукты, яйца. Без орехов.',
    slice: {
      sponge: '#F5E3BA',
      spongeDeep: '#D8BF89',
      cream: '#FFFDF7',
      creamShade: '#EDE4D3',
      filling: '#E49B26',
      fillingHighlight: '#F7C259',
      type: 'tropical'
    }
  },
  {
    id: 'red-velvet-cherry',
    name: 'Красный бархат с вишней',
    french: 'Velours Rouge',
    tags: ['Ягодные', 'Без орехов'],
    profile: 'Нежный бархатистый бисквит с тонким послевкусием какао, пломбирный крем-чиз и ароматная вишнёвая прослойка.',
    sponge: 'Мука пшеничная, фермерский кефир, какао-порошок, сливочное масло, яйца, сахар, пищевой краситель.',
    filling: 'Творожный сыр, сливки 33%, сахарная пудра, вишнёвое конфи с цельными ягодами.',
    allergens: 'Глютен, молочные продукты, яйца. Без орехов.',
    slice: {
      sponge: '#962634',
      spongeDeep: '#6B1520',
      cream: '#FDFBF7',
      creamShade: '#EAE1D5',
      filling: '#6A1223',
      fillingHighlight: '#96283E',
      type: 'cherry'
    }
  }
];

const COATING_COLORS = [
  { id: 'plombir', name: 'Сливочный пломбир', hex: '#F9F4EA' },
  { id: 'powder-rose', name: 'Пудровая роза', hex: '#E8CDD1' },
  { id: 'lavender', name: 'Прованская лаванда', hex: '#DAD1E3' },
  { id: 'pistachio', name: 'Фисташковый крем', hex: '#D3DFC8' },
  { id: 'champagne', name: 'Нежный шампань', hex: '#EDE1D0' },
  { id: 'silk-blue', name: 'Голубой шёлк', hex: '#CEDDE6' },
  { id: 'warm-peach', name: 'Тёплый персик', hex: '#F1D6C4' },
  { id: 'truffle', name: 'Шоколадный трюфель', hex: '#52382F' }
];

const COATING_TEXTURES = [
  {
    id: 'smooth',
    name: 'Гладкий крем-чиз',
    price: 0,
    desc: 'Шёлковое выравнивание кондитерским шпателем с деликатным сатиновым светом.'
  },
  {
    id: 'velour',
    name: 'Бархатный велюр',
    price: 600,
    desc: 'Тончайшее матовое напыление из какао-масла и бельгийского шоколада.'
  },
  {
    id: 'watercolor',
    name: 'Акварельные мазки',
    price: 500,
    desc: 'Художественная фактура мастихином в пастельных и шампанских полутонах.'
  },
  {
    id: 'lambeth',
    name: 'Винтажные рюши Ламбет',
    price: 1100,
    desc: 'Многоярусные кремовые гирлянды и кружевные оборки в эстетике старинной Франции.'
  }
];

const DECOR_TABS = [
  {
    id: 'berries-sweets',
    label: 'Ягоды и сладости',
    items: [
      {
        id: 'berries',
        name: 'Свежие ягоды',
        price: 850,
        desc: 'Отборная клубника, малина, голубика и нежные листики свежей мяты.'
      },
      {
        id: 'macarons',
        name: 'Французские макаронс',
        price: 650,
        desc: 'Воздушные миндальные пирожные с хрустящей корочкой и ганашем.'
      },
      {
        id: 'drips',
        name: 'Шоколадные подтёки ганаша',
        price: 450,
        desc: 'Глянцевая глазурь из тёмного бельгийского шоколада мягкими каплями по краю.'
      }
    ]
  },
  {
    id: 'accents',
    label: 'Акценты',
    items: [
      {
        id: 'gold',
        name: 'Сусальное золото',
        price: 700,
        desc: 'Невесомые лепестки пищевого золота 24К для благородного сияния.'
      },
      {
        id: 'pearls',
        name: 'Сахарный жемчуг',
        price: 350,
        desc: 'Перламутровые бусины разного калибра, деликатно рассыпанные по крему.'
      },
      {
        id: 'bows',
        name: 'Атласные бантики',
        price: 550,
        desc: 'Тончайшие шёлковые ленточки, завязанные вручную в миниатюрные банты.'
      }
    ]
  },
  {
    id: 'celebration',
    label: 'Для праздника',
    items: [
      {
        id: 'candles',
        name: 'Тонкие восковые свечи',
        price: 300,
        desc: 'Изящные удлинённые свечи пастельных тонов для тёплого сияния.'
      },
      {
        id: 'topper',
        name: 'Акриловый топпер',
        price: 450,
        desc: 'Тонкий золотистый топпер «Mon Amour» с зеркальным переливом.'
      }
    ]
  }
];

const ALL_DECOR_ITEMS = DECOR_TABS.flatMap((t) => t.items);

const INSCRIPTION_CHIPS = [
  'Merci Mon Chéri',
  'С днём рождения!',
  'Mon Amour',
  'Самой прекрасной'
];

const INSCRIPTION_FONTS = [
  {
    id: 'calligraphy',
    name: 'Каллиграфия',
    sample: 'Merci Mon Chéri',
    family: "'Marck Script', 'Bad Script', cursive",
    scale: 1.24
  },
  {
    id: 'serif',
    name: 'Элегантный печатный',
    sample: 'MERCI MON CHÉRI',
    family: "'Cormorant Garamond', Georgia, serif",
    scale: 1.0
  }
];

const INSCRIPTION_COLORS = [
  { id: 'dark-choco', name: 'Тёмный шоколад', hex: '#43281E' },
  { id: 'gold', name: 'Золотой крем', hex: '#B98E4A' },
  { id: 'rose', name: 'Розовый', hex: '#A95567' },
  { id: 'cream-white', name: 'Сливочный белый', hex: '#FFFDF8' }
];

const DELIVERY_SLOTS = ['11:00–14:00', '14:00–17:00', '17:00–20:00'];

const PRESETS = [
  {
    id: 'parisian-morning',
    name: 'Парижское утро',
    subtitle: 'Пломбир, свежие ягоды, макаронс и золото',
    swatch: '#F9F4EA',
    config: {
      shape: 'round',
      weight: 2,
      flavor: 'vanilla-raspberry',
      colorId: 'plombir',
      texture: 'smooth',
      decor: ['berries', 'macarons', 'gold'],
      inscription: 'Merci Mon Chéri',
      font: 'calligraphy',
      textColor: '#43281E'
    }
  },
  {
    id: 'coeur-lambeth',
    name: 'Винтажное сердце',
    subtitle: 'Пудровая роза, рюши Ламбет, атласные бантики',
    swatch: '#E8CDD1',
    config: {
      shape: 'heart',
      weight: 2,
      flavor: 'pistachio-strawberry',
      colorId: 'powder-rose',
      texture: 'lambeth',
      decor: ['bows', 'pearls'],
      inscription: 'Mon Amour',
      font: 'calligraphy',
      textColor: '#FFFDF8'
    }
  },
  {
    id: 'provence-velour',
    name: 'Прованский бархат',
    subtitle: 'Лавандовый велюр, жемчуг и свечи',
    swatch: '#DAD1E3',
    config: {
      shape: 'oval',
      weight: 1.5,
      flavor: 'mango-passion',
      colorId: 'lavender',
      texture: 'velour',
      decor: ['pearls', 'candles', 'gold'],
      inscription: 'С днём рождения!',
      font: 'serif',
      textColor: '#B98E4A'
    }
  },
  {
    id: 'choco-noir',
    name: 'Шоколадный трюфель',
    subtitle: 'Тёмный крем, подтёки ганаша, ягоды и поталь',
    swatch: '#52382F',
    config: {
      shape: 'round',
      weight: 2.5,
      flavor: 'belgian-choco-cherry',
      colorId: 'truffle',
      texture: 'smooth',
      decor: ['drips', 'berries', 'gold'],
      inscription: 'Самой прекрасной',
      font: 'calligraphy',
      textColor: '#B98E4A'
    }
  }
];

const STEPS = [
  { id: 1, code: '01', title: 'Форма торта', short: 'Форма' },
  { id: 2, code: '02', title: 'Гости и вес', short: 'Вес' },
  { id: 3, code: '03', title: 'Вкус и начинка', short: 'Начинка' },
  { id: 4, code: '04', title: 'Покрытие и оттенок', short: 'Покрытие' },
  { id: 5, code: '05', title: 'Декор', short: 'Декор' },
  { id: 6, code: '06', title: 'Надпись на торте', short: 'Надпись' },
  { id: 7, code: '07', title: 'Оформление заказа', short: 'Заказ' }
];

// ============================================================================
// УТИЛИТЫ (ЦВЕТА, ДАТЫ, ФОРМАТЫ, РАЗБИВКА НАДПИСИ)
// ============================================================================

function hexToRgb(hex) {
  const clean = (hex || '#F9F4EA').replace('#', '');
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean.padEnd(6, '0').slice(0, 6);
  const num = parseInt(full, 16);
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
}

function adjustColor(hex, percent) {
  const { r, g, b } = hexToRgb(hex);
  const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
  const shift = (ch) =>
    percent >= 0 ? ch + (255 - ch) * (percent / 100) : ch * (1 + percent / 100);
  return `#${[clamp(shift(r)), clamp(shift(g)), clamp(shift(b))]
    .map((n) => n.toString(16).padStart(2, '0'))
    .join('')}`;
}

function isDarkColor(hex) {
  const { r, g, b } = hexToRgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.45;
}

function formatPrice(val) {
  return `${Math.round(val).toLocaleString('ru-RU')} ₽`;
}

function getIsoDateOffset(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`;
}

function formatDateRu(iso) {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  const months = [
    'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
  ];
  return `${parseInt(d, 10)} ${months[parseInt(m, 10) - 1] || m} ${y}`;
}

function wrapCakeText(text, maxChars = 13) {
  const clean = (text || '').trim();
  if (!clean) return [];
  const words = clean.split(/\s+/);
  const lines = [];
  let line = '';
  for (const w of words) {
    if (!line) {
      line = w;
    } else if ((line + ' ' + w).length <= maxChars) {
      line += ' ' + w;
    } else {
      lines.push(line);
      line = w;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 3);
}

// ============================================================================
// СТУДИЙНЫЙ ФОТОРЕАЛИСТИЧНЫЙ 2D-РЕНДЕР ТОРТА (SVG + ФИЛЬТРЫ + ТЕНИ)
// ============================================================================
function StudioCakeRenderer(props) {
  const wrapRef = useRef(null);
  const uid = useMemo(() => Math.random().toString(36).slice(2, 7), []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    el.querySelectorAll('[id]').forEach((node) => {
      const oldId = node.getAttribute('id');
      if (oldId && !oldId.endsWith(uid)) {
        node.setAttribute('id', `${oldId}-${uid}`);
      }
    });
    el.querySelectorAll('*').forEach((node) => {
      for (const attr of Array.from(node.attributes)) {
        if (attr.value.includes('url(#')) {
          node.setAttribute(
            attr.name,
            attr.value.replace(/url\(#([^)]+)\)/g, (_, id) =>
              id.endsWith(uid) ? `url(#${id})` : `url(#${id}-${uid})`
            )
          );
        }
      }
    });
  });

  return (
    <div ref={wrapRef} className="w-full h-full flex items-center justify-center">
      <RawStudioCakeRenderer {...props} />
    </div>
  );
}

function RawStudioCakeRenderer({
  viewMode,
  shape,
  weight,
  colorHex,
  texture,
  decor,
  inscription,
  fontId,
  textColor,
  flavorObj,
  compact = false
}) {
  const darkBase = isDarkColor(colorHex);

  // Палитра студийного света (без единой грубой тёмной обводки!)
  const cRimLeft = adjustColor(colorHex, darkBase ? 26 : 16);
  const cSpecular = adjustColor(colorHex, darkBase ? 36 : 24);
  const cMidLight = adjustColor(colorHex, darkBase ? 12 : 8);
  const cBase = colorHex;
  const cShadowMid = adjustColor(colorHex, darkBase ? -14 : -9);
  const cShadowDeep = adjustColor(colorHex, darkBase ? -28 : -18);
  const cBounceWarm = adjustColor(colorHex, darkBase ? -8 : -4);
  const cPipingLight = adjustColor(colorHex, darkBase ? 30 : 22);
  const cPipingMid = adjustColor(colorHex, darkBase ? 10 : 5);
  const cPipingShadow = adjustColor(colorHex, darkBase ? -22 : -15);

  // Плавное масштабирование пропорций от веса (1 кг -> 5 кг)
  const wNorm = (weight - 1) / 4; // 0..1
  const baseWidthFactor = shape === 'oval' ? 1.08 : shape === 'heart' ? 0.96 : 1;
  const bodyW = Math.round((168 + wNorm * 76) * baseWidthFactor);
  const bodyH = Math.round(112 + wNorm * 20);
  const cx = 220;
  const baseY = 278;
  const topY = baseY - bodyH;
  const leftX = cx - bodyW / 2;
  const rightX = cx + bodyW / 2;
  const rx = bodyW / 2;
  const ry = shape === 'oval' ? 15 : 21;

  const topScale = 0.8 + wNorm * 0.2; // масштаб на виде сверху

  const has = (id) => decor.includes(id);

  // Точки кремовых рюшей Ламбет (вид сбоку)
  const shellCount = Math.max(10, Math.round(bodyW / 16));
  const sideShells = useMemo(() => {
    return Array.from({ length: shellCount }, (_, i) => {
      const t = shellCount === 1 ? 0.5 : i / (shellCount - 1);
      const x = leftX + 7 + t * (bodyW - 14);
      const arch = Math.sin(t * Math.PI);
      return {
        x,
        topY: topY + arch * (ry * 0.72) + 1.5,
        botY: baseY + arch * (ry * 0.52) - 2,
        scale: 0.86 + arch * 0.24
      };
    });
  }, [shellCount, leftX, bodyW, topY, baseY, ry]);

  const lambethSwags = useMemo(() => {
    const count = weight >= 3 ? 5 : 4;
    const segW = (bodyW - 16) / count;
    return Array.from({ length: count }, (_, i) => {
      const x1 = leftX + 8 + i * segW;
      const x2 = x1 + segW;
      const xm = (x1 + x2) / 2;
      const t1 = (x1 - leftX) / bodyW;
      const t2 = (x2 - leftX) / bodyW;
      const y1 = topY + Math.sin(t1 * Math.PI) * (ry * 0.72) + 14;
      const y2 = topY + Math.sin(t2 * Math.PI) * (ry * 0.72) + 14;
      const ym = Math.max(y1, y2) + 32;
      return { x1, y1, xm, ym, x2, y2 };
    });
  }, [weight, leftX, bodyW, topY, ry]);

  // Органические шоколадные подтёки (вид сбоку)
  const dripData = useMemo(() => {
    const drops = [
      { t: 0.08, len: 32, w: 0.09 },
      { t: 0.19, len: 56, w: 0.1 },
      { t: 0.31, len: 24, w: 0.085 },
      { t: 0.42, len: 64, w: 0.105 },
      { t: 0.55, len: 36, w: 0.09 },
      { t: 0.67, len: 58, w: 0.1 },
      { t: 0.79, len: 26, w: 0.085 },
      { t: 0.9, len: 46, w: 0.095 }
    ];
    let d = `M ${leftX} ${topY} A ${rx} ${ry} 0 0 1 ${rightX} ${topY} L ${rightX} ${topY + 14} `;
    const highlights = [];
    for (let i = drops.length - 1; i >= 0; i--) {
      const dr = drops[i];
      const mx = leftX + dr.t * bodyW;
      const hw = (dr.w * bodyW) / 2;
      const arch = Math.sin(dr.t * Math.PI) * (ry * 0.72);
      const valleyY = topY + arch + 13;
      const tipY = topY + arch + dr.len;
      d += `C ${mx + hw * 1.15} ${valleyY + 3}, ${mx + hw * 0.7} ${tipY - 2}, ${mx} ${tipY} `;
      d += `C ${mx - hw * 0.7} ${tipY - 2}, ${mx - hw * 1.15} ${valleyY + 3}, ${mx - hw * 1.35} ${valleyY} `;
      highlights.push({ x: mx - hw * 0.25, y: tipY - 9, r: Math.max(1.8, hw * 0.26) });
    }
    d += `L ${leftX} ${topY + 12} Z`;
    return { path: d, highlights };
  }, [leftX, rightX, topY, bodyW, rx, ry]);

  // Контур формы для вида сверху (центр 220, 182)
  const topShapePath = useMemo(() => {
    if (shape === 'heart') {
      return 'M 220 278 C 138 236, 94 184, 96 132 C 98 92, 130 70, 166 75 C 192 79, 210 98, 220 116 C 230 98, 248 79, 274 75 C 310 70, 342 92, 344 132 C 346 184, 302 236, 220 278 Z';
    }
    if (shape === 'oval') {
      return 'M 92 182 A 128 88 0 1 0 348 182 A 128 88 0 1 0 92 182 Z';
    }
    return 'M 108 182 A 112 112 0 1 0 332 182 A 112 112 0 1 0 108 182 Z';
  }, [shape]);

  // Точки по периметру вида сверху (для Ламбет и декора)
  const getTopPerimeter = (count, inset = 0) => {
    const pts = [];
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      if (shape === 'round') {
        const r = 107 - inset;
        pts.push({ x: 220 + Math.cos(a) * r, y: 182 + Math.sin(a) * r });
      } else if (shape === 'oval') {
        const orx = 123 - inset;
        const ory = 83 - inset * 0.72;
        pts.push({ x: 220 + Math.cos(a) * orx, y: 182 + Math.sin(a) * ory });
      } else {
        const sc = 7.15 - inset * 0.065;
        const hx = 16 * Math.pow(Math.sin(a), 3);
        const hy = -(13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a));
        pts.push({ x: 220 + hx * sc, y: 170 + hy * sc });
      }
    }
    return pts;
  };

  const topLambethOuter = useMemo(() => getTopPerimeter(40, 3), [shape]);
  const topLambethInner = useMemo(() => getTopPerimeter(32, 13), [shape]);

  const activeFont = INSCRIPTION_FONTS.find((f) => f.id === fontId) || INSCRIPTION_FONTS[0];
  const wrappedLines = wrapCakeText(inscription, shape === 'heart' ? 11 : 14);

  // Вспомогательные фотореалистичные детали ягод (переиспользуемые)
  const renderRealisticStrawberry = (x, y, scale = 1, rot = 0, halved = false, key = '') => (
    <g key={key} transform={`translate(${x}, ${y}) rotate(${rot}) scale(${scale})`}>
      {/* Контактная тень под ягодой */}
      <ellipse cx="1.5" cy="9" rx="11" ry="4.2" fill="#2A1812" opacity="0.22" filter="url(#softShadowBlur)" />
      {halved ? (
        <g>
          {/* Половинка клубники в разрезе */}
          <path
            d="M 0 -11 C 9 -11, 12 -2, 7 6 C 4 10, 1.5 11.5, 0 11.5 C -1.5 11.5, -4 10, -7 6 C -12 -2, -9 -11, 0 -11 Z"
            fill="url(#strawberryOuterGrad)"
          />
          <path
            d="M 0 -8.5 C 6.5 -8.5, 8.8 -1.5, 5 5 C 2.8 8.2, 1 9.2, 0 9.2 C -1 9.2, -2.8 8.2, -5 5 C -8.8 -1.5, -6.5 -8.5, 0 -8.5 Z"
            fill="url(#strawberryHalfGrad)"
          />
          <path
            d="M 0 -5.5 C 3 -5.5, 4 -0.5, 2.2 3.5 C 1.2 5.4, -1.2 5.4, -2.2 3.5 C -4 -0.5, -3 -5.5, 0 -5.5 Z"
            fill="#FDE8EA"
            opacity="0.72"
          />
          {/* Зелёные чашелистики */}
          <path d="M -6 -10 Q -2 -14 0 -10 Q 2 -14 6 -10 Q 2 -8 0 -9.5 Q -2 -8 -6 -10 Z" fill="#467241" />
        </g>
      ) : (
        <g>
          {/* Целая глянцевая клубника */}
          <path
            d="M 0 -11 C 10 -11, 13 -1, 7.5 6.8 C 4.5 10.6, 1.5 12, 0 12 C -1.5 12, -4.5 10.6, -7.5 6.8 C -13 -1, -10 -11, 0 -11 Z"
            fill="url(#strawberryOuterGrad)"
          />
          {/* Зеркальный блик на кожице */}
          <ellipse cx="-4.2" cy="-3.5" rx="2.6" ry="5.2" fill="#FFFFFF" opacity="0.28" transform="rotate(-18 -4.2 -3.5)" />
          {/* Золотистые семечки */}
          {[
            [-4, -4], [0, -5], [4.5, -3.5], [-5.5, 1], [-1, 0.5], [3.5, 1.5], [-2.5, 5.5], [2, 5.5], [0, 8.5]
          ].map(([sx, sy], i) => (
            <ellipse key={i} cx={sx} cy={sy} rx="0.65" ry="1.1" fill="#F2D08B" opacity="0.88" />
          ))}
          {/* Резные зелёные листики */}
          <path
            d="M 0 -10 C -4 -14, -9 -12, -8 -9 C -4 -9, -2 -8.5, 0 -9.5 C 2 -8.5, 4 -9, 8 -9 C 9 -12, 4 -14, 0 -10 Z"
            fill="#487542"
          />
          <path d="M 0 -10 L -1.5 -14.5 L 1.2 -14.2 Z" fill="#5D8F55" />
        </g>
      )}
    </g>
  );

  const renderRealisticRaspberry = (x, y, scale = 1, key = '') => (
    <g key={key} transform={`translate(${x}, ${y}) scale(${scale})`}>
      <ellipse cx="1" cy="7.5" rx="8.5" ry="3.4" fill="#2A1418" opacity="0.24" filter="url(#softShadowBlur)" />
      {/* Гроздь глянцевых костянок */}
      {[
        [-4.5, 3.2, 3.4], [0, 4.4, 3.6], [4.5, 3.2, 3.4],
        [-5.2, -0.5, 3.4], [-1.6, 0.2, 3.6], [2.2, 0.2, 3.6], [5.2, -0.5, 3.3],
        [-3.4, -4, 3.2], [0.2, -4.4, 3.4], [3.6, -4, 3.2],
        [0, -7.2, 2.9]
      ].map(([dx, dy, r], idx) => (
        <g key={idx}>
          <circle cx={dx} cy={dy} r={r} fill="url(#raspberryDrupeGrad)" />
          <circle cx={dx - r * 0.34} cy={dy - r * 0.36} r={r * 0.26} fill="#FFFFFF" opacity="0.38" />
        </g>
      ))}
    </g>
  );

  const renderRealisticBlueberry = (x, y, r = 6.2, key = '') => (
    <g key={key} transform={`translate(${x}, ${y})`}>
      <ellipse cx="1" cy={r * 0.92} rx={r * 0.95} ry={r * 0.4} fill="#1E2033" opacity="0.24" filter="url(#softShadowBlur)" />
      <circle cx="0" cy="0" r={r} fill="url(#blueberryGrad)" />
      {/* Сизый природный восковой налёт */}
      <ellipse cx={-r * 0.18} cy={-r * 0.2} rx={r * 0.56} ry={r * 0.44} fill="#8FA3D4" opacity="0.38" />
      <circle cx={-r * 0.35} cy={-r * 0.38} r={r * 0.18} fill="#FFFFFF" opacity="0.45" />
      {/* Коронка ягоды */}
      <circle cx={r * 0.24} cy={r * 0.18} r={r * 0.2} fill="#1C223B" opacity="0.55" />
    </g>
  );

  const renderMintLeaf = (x, y, rot = 0, scale = 1, key = '') => (
    <g key={key} transform={`translate(${x}, ${y}) rotate(${rot}) scale(${scale})`}>
      <path
        d="M 0 0 C -6 -7, -14 -7, -19 -1 C -13 6, -5 6, 0 0 Z"
        fill="url(#mintLeafGrad)"
      />
      <path d="M -1 0 Q -9 -0.8 -16.5 -0.8" stroke="#9AC792" strokeWidth="0.65" fill="none" opacity="0.65" />
      <path d="M -6 -0.4 L -9 -3.2 M -10 -0.6 L -13 -2.6 M -7 -0.2 L -10 2.6" stroke="#9AC792" strokeWidth="0.45" opacity="0.45" />
    </g>
  );

  const renderRealisticMacaron = (x, y, rot = 0, shellHex = '#E8CDD1', scale = 1, key = '') => {
    const shellLight = adjustColor(shellHex, 20);
    const shellDark = adjustColor(shellHex, -18);
    const gradId = `macGrad-${key.replace(/[^a-zA-Z0-9]/g, '')}`;
    return (
      <g key={key} transform={`translate(${x}, ${y}) rotate(${rot}) scale(${scale})`}>
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={shellLight} />
            <stop offset="55%" stopColor={shellHex} />
            <stop offset="100%" stopColor={shellDark} />
          </linearGradient>
        </defs>
        {/* Мягкая контактная тень на креме */}
        <ellipse cx="2" cy="11" rx="16" ry="5" fill="#3B2B24" opacity="0.22" filter="url(#softShadowBlur)" />
        {/* Нижняя крышечка */}
        <ellipse cx="0" cy="6.2" rx="15.5" ry="5.8" fill={shellDark} />
        <ellipse cx="0" cy="5.2" rx="15" ry="5.2" fill={`url(#${gradId})`} />
        {/* Рифлёная «юбочка» (pied) */}
        <path
          d="M -14.8 3.2 Q -12 5.4 -9.5 3.4 Q -7 5.5 -4.5 3.4 Q -2 5.5 0.5 3.4 Q 3 5.5 5.5 3.4 Q 8 5.5 10.5 3.4 Q 13 5.2 14.8 3.2 L 14.2 1.2 L -14.2 1.2 Z"
          fill={shellLight}
          opacity="0.9"
        />
        {/* Начинка ганаш */}
        <rect x="-14.2" y="-1.5" width="28.4" height="3.8" rx="1.9" fill="#FFFBF4" />
        {/* Верхняя рифлёная юбочка */}
        <path
          d="M -14.8 -1.2 Q -12 -3.4 -9.5 -1.4 Q -7 -3.5 -4.5 -1.4 Q -2 -3.5 0.5 -1.4 Q 3 -3.5 5.5 -1.4 Q 8 -3.5 10.5 -1.4 Q 13 -3.2 14.8 -1.2 L 14.2 0.2 L -14.2 0.2 Z"
          fill={shellLight}
          opacity="0.88"
        />
        {/* Верхняя глянцевая крышечка */}
        <ellipse cx="0" cy="-4.6" rx="15.8" ry="6.6" fill={`url(#${gradId})`} />
        {/* Глянцевый студийный блик */}
        <ellipse cx="-4.8" cy="-7" rx="5.5" ry="1.9" fill="#FFFFFF" opacity="0.45" transform="rotate(-10 -4.8 -7)" />
      </g>
    );
  };

  // Общие SVG-определения (фильтры микротекстур, реалистичные градиенты ягод, золота, фарфора)
  const renderSharedDefs = () => (
    <defs>
      {/* Мягкое студийное размытие теней */}
      <filter id="softShadowBlur" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="2.6" />
      </filter>
      <filter id="deepShadowBlur" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="6.5" />
      </filter>
      <filter id="watercolorBlur" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="3.2" />
      </filter>
      <filter id="pipedTextShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0.8" dy="1.8" stdDeviation="1.2" floodColor="#2A1E19" floodOpacity="0.26" />
      </filter>

      {/* Настоящий бархатный микрорельеф велюра из какао-масла */}
      <filter id="velourTextureFilter" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" seed="12" result="noise" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.22
                  0 0 0 0 0.16
                  0 0 0 0 0.13
                  0 0 0 0.16 0"
          in="noise"
          result="coloredNoise"
        />
        <feComposite in="coloredNoise" in2="SourceGraphic" operator="in" />
      </filter>

      {/* Пористая текстура бисквитного мякиша для разреза */}
      <filter id="spongeCrumbFilter" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.42" numOctaves="3" seed="7" result="crumb" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0.35
                  0 0 0 0 0.22
                  0 0 0 0 0.12
                  0 0 0 0.24 0"
          in="crumb"
          result="tintedCrumb"
        />
        <feComposite in="tintedCrumb" in2="SourceGraphic" operator="in" />
      </filter>

      {/* 7-ступенчатый цилиндрический градиент студийного света */}
      <linearGradient id="studioCylinderGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor={cRimLeft} />
        <stop offset="14%" stopColor={cSpecular} />
        <stop offset="30%" stopColor={cMidLight} />
        <stop offset="54%" stopColor={cBase} />
        <stop offset="78%" stopColor={cShadowMid} />
        <stop offset="93%" stopColor={cShadowDeep} />
        <stop offset="100%" stopColor={cBounceWarm} />
      </linearGradient>

      {/* Градиент верхушки торта */}
      <radialGradient id="studioTopGrad" cx="35%" cy="35%" r="72%">
        <stop offset="0%" stopColor={cSpecular} />
        <stop offset="48%" stopColor={cBase} />
        <stop offset="86%" stopColor={cShadowMid} />
        <stop offset="100%" stopColor={cShadowDeep} />
      </radialGradient>

      {/* Фарфоровая тортовница */}
      <linearGradient id="porcelainStandGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#E4DBD1" />
        <stop offset="22%" stopColor="#FFFFFF" />
        <stop offset="52%" stopColor="#F8F3EC" />
        <stop offset="82%" stopColor="#E7DED4" />
        <stop offset="100%" stopColor="#D6CAC0" />
      </linearGradient>

      <linearGradient id="champagneGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FBEAB8" />
        <stop offset="35%" stopColor="#DFBA73" />
        <stop offset="70%" stopColor="#C19449" />
        <stop offset="100%" stopColor="#8E6728" />
      </linearGradient>

      {/* Бельгийский шоколадный ганаш */}
      <linearGradient id="ganacheGrad" x1="15%" y1="0%" x2="88%" y2="100%">
        <stop offset="0%" stopColor="#613B2C" />
        <stop offset="32%" stopColor="#3D2116" />
        <stop offset="72%" stopColor="#2A150E" />
        <stop offset="100%" stopColor="#42261B" />
      </linearGradient>

      {/* Реалистичные ягодные градиенты */}
      <radialGradient id="strawberryOuterGrad" cx="32%" cy="28%" r="72%">
        <stop offset="0%" stopColor="#E23B4B" />
        <stop offset="52%" stopColor="#B81D31" />
        <stop offset="100%" stopColor="#6D0B19" />
      </radialGradient>
      <radialGradient id="strawberryHalfGrad" cx="45%" cy="45%" r="65%">
        <stop offset="0%" stopColor="#F9CED2" />
        <stop offset="55%" stopColor="#DF5566" />
        <stop offset="100%" stopColor="#B11E32" />
      </radialGradient>
      <radialGradient id="raspberryDrupeGrad" cx="32%" cy="30%" r="68%">
        <stop offset="0%" stopColor="#DE4067" />
        <stop offset="58%" stopColor="#AC1B41" />
        <stop offset="100%" stopColor="#690B24" />
      </radialGradient>
      <radialGradient id="blueberryGrad" cx="30%" cy="28%" r="72%">
        <stop offset="0%" stopColor="#56699F" />
        <stop offset="55%" stopColor="#2F3B66" />
        <stop offset="100%" stopColor="#181F3B" />
      </radialGradient>
      <linearGradient id="mintLeafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#6BA062" />
        <stop offset="58%" stopColor="#467841" />
        <stop offset="100%" stopColor="#2D5229" />
      </linearGradient>
      <radialGradient id="pearlSphereGrad" cx="32%" cy="28%" r="70%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="42%" stopColor="#F8F1E8" />
        <stop offset="80%" stopColor="#DFD3C6" />
        <stop offset="100%" stopColor="#C1B3A4" />
      </radialGradient>
      <radialGradient id="candleHaloGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#FDE6A8" stopOpacity="0.65" />
        <stop offset="50%" stopColor="#F7C97E" stopOpacity="0.18" />
        <stop offset="100%" stopColor="#F7C97E" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="studioWallGlow" cx="50%" cy="44%" r="55%">
        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
        <stop offset="65%" stopColor="#F7EFE7" stopOpacity="0.55" />
        <stop offset="100%" stopColor="#F5EDE4" stopOpacity="0" />
      </radialGradient>
    </defs>
  );

  // ==========================================================================
  // 1. ВИД СБОКУ (СТУДИЙНАЯ КОМПОЗИЦИЯ НА ФАРФОРОВОЙ ТОРТОВНИЦЕ)
  // ==========================================================================
  const renderSideView = () => (
    <svg
      viewBox="0 0 440 365"
      className={`w-full h-full select-none transition-all duration-500 ${
        compact ? 'max-h-[195px]' : 'max-h-[370px]'
      }`}
      role="img"
      aria-label="Студийное превью торта вид сбоку"
    >
      {renderSharedDefs()}

      <defs>
        <clipPath id="cakeBodySideClip">
          <path
            d={`M ${leftX} ${topY} A ${rx} ${ry} 0 0 1 ${rightX} ${topY} L ${rightX} ${baseY} A ${rx} ${ry * 0.72} 0 0 1 ${leftX} ${baseY} Z`}
          />
        </clipPath>
      </defs>

      {/* Студийный рассеянный свет на стене */}
      <ellipse cx="220" cy="185" rx="195" ry="155" fill="url(#studioWallGlow)" />

      {/* Линия студийного стола */}
      <ellipse cx="220" cy="336" rx="168" ry="20" fill="#E5D9CD" opacity="0.48" filter="url(#deepShadowBlur)" />
      <ellipse cx="220" cy="334" rx="108" ry="11" fill="#A69586" opacity="0.28" filter="url(#softShadowBlur)" />

      {/* БЛАГОРОДНАЯ ФАРФОРОВАЯ ТОРТОВНИЦА НА НОЖКЕ */}
      <g>
        {/* Ножка тортовницы */}
        <path
          d="M 201 292 C 204 312, 192 320, 166 329 L 274 329 C 248 320, 236 312, 239 292 Z"
          fill="url(#porcelainStandGrad)"
        />
        {/* Блик на ножке */}
        <path d="M 209 295 C 210 310, 204 319, 192 325" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" opacity="0.65" fill="none" />
        {/* Основание ножки */}
        <ellipse cx="220" cy="330" rx="54" ry="7" fill="#E1D7CD" />
        <ellipse cx="220" cy="328" rx="54" ry="6.5" fill="url(#porcelainStandGrad)" />
        <ellipse cx="220" cy="328" rx="48" ry="4.5" fill="none" stroke="url(#champagneGoldGrad)" strokeWidth="0.9" opacity="0.7" />

        {/* Тень под тарелкой на ножке */}
        <ellipse cx="220" cy="295" rx="22" ry="5" fill="#9E8E80" opacity="0.32" filter="url(#softShadowBlur)" />

        {/* Толщина края фарфоровой тарелки */}
        <ellipse cx="220" cy="288" rx={rx + 36} ry={ry + 8} fill="#DCD2C7" />
        {/* Верхняя глянцевая плоскость тортовницы */}
        <ellipse cx="220" cy="284" rx={rx + 36} ry={ry + 7.5} fill="url(#porcelainStandGrad)" />
        {/* Тончайший золотой кант */}
        <ellipse
          cx="220"
          cy="284"
          rx={rx + 31}
          ry={ry + 5.2}
          fill="none"
          stroke="url(#champagneGoldGrad)"
          strokeWidth="1.2"
          opacity="0.82"
        />
        {/* Контактная окклюзия (тень прямо под основанием торта) */}
        <ellipse cx="224" cy={baseY + 4} rx={rx + 6} ry={ry * 0.8} fill="#5C493D" opacity="0.24" filter="url(#softShadowBlur)" />
        <ellipse cx="220" cy={baseY + 2} rx={rx + 1} ry={ry * 0.72} fill="#46362C" opacity="0.22" />
      </g>

      {/* АКРИЛОВЫЙ ЗОЛОТОЙ ТОППЕР (позади переднего декора) */}
      {has('topper') && (
        <g>
          {/* Прозрачно-золотые шпажки */}
          <line x1={cx - 18} y1={topY - 2} x2={cx - 18} y2={topY - 58} stroke="url(#champagneGoldGrad)" strokeWidth="2.1" opacity="0.9" />
          <line x1={cx + 18} y1={topY - 2} x2={cx + 18} y2={topY - 58} stroke="url(#champagneGoldGrad)" strokeWidth="2.1" opacity="0.9" />
          {/* Каллиграфическая надпись топпера с объёмом */}
          <g filter="url(#pipedTextShadow)">
            <text
              x={cx}
              y={topY - 72}
              textAnchor="middle"
              fill="url(#champagneGoldGrad)"
              style={{ fontFamily: "'Marck Script', cursive", fontSize: '30px' }}
            >
              Mon Amour
            </text>
          </g>
        </g>
      )}

      {/* ТОНКИЕ ВОСКОВЫЕ СВЕЧИ С МЯГКИМ СИЯНИЕМ */}
      {has('candles') && (
        <g>
          {[
            { dx: -44, h: 48, col: '#F5E4E6' },
            { dx: -16, h: 60, col: '#F6ECD8' },
            { dx: 18, h: 55, col: '#ECE2EE' },
            { dx: 46, h: 44, col: '#F5E4E6' }
          ].map((c, idx) => {
            const x = cx + c.dx;
            const y0 = topY - 4 - (idx === 1 || idx === 2 ? 4 : 0);
            const yTop = y0 - c.h;
            return (
              <g key={`candle-${idx}`}>
                {/* Тёплое свечение воздуха */}
                <circle cx={x} cy={yTop - 12} r="28" fill="url(#candleHaloGrad)" />
                {/* Тонкая свеча */}
                <rect x={x - 2.6} y={yTop} width="5.2" height={c.h} rx="2" fill={c.col} />
                {/* Объём свечи */}
                <rect x={x - 2.6} y={yTop} width="1.8" height={c.h} rx="1" fill="#FFFFFF" opacity="0.55" />
                <rect x={x + 1.1} y={yTop} width="1.5" height={c.h} rx="1" fill="#9E8A7C" opacity="0.22" />
                {/* Фитиль */}
                <line x1={x} y1={yTop} x2={x} y2={yTop - 4.5} stroke="#3B2E26" strokeWidth="0.9" />
                {/* Живое многослойное пламя */}
                <g className="mmc-flame" style={{ transformOrigin: `${x}px ${yTop - 5}px`, animationDelay: `${idx * 0.22}s` }}>
                  <path
                    d={`M ${x} ${yTop - 20} C ${x + 5.2} ${yTop - 12}, ${x + 3.8} ${yTop - 4.5}, ${x} ${yTop - 4.5} C ${x - 3.8} ${yTop - 4.5}, ${x - 5.2} ${yTop - 12}, ${x} ${yTop - 20} Z`}
                    fill="#F39C2A"
                    opacity="0.92"
                  />
                  <path
                    d={`M ${x} ${yTop - 15.5} C ${x + 2.8} ${yTop - 10.5}, ${x + 2} ${yTop - 5.2}, ${x} ${yTop - 5.2} C ${x - 2} ${yTop - 5.2}, ${x - 2.8} ${yTop - 10.5}, ${x} ${yTop - 15.5} Z`}
                    fill="#FFF7D6"
                  />
                  <ellipse cx={x} cy={yTop - 6.2} rx="1.4" ry="1.8" fill="#6AA8E8" opacity="0.55" />
                </g>
              </g>
            );
          })}
        </g>
      )}

      {/* ОСНОВНОЙ ОБЪЁМНЫЙ КОРПУС ТОРТА */}
      <g>
        {/* Боковая стенка с 7-ступенчатым градиентом */}
        <path
          d={`M ${leftX} ${topY} L ${leftX} ${baseY} A ${rx} ${ry * 0.72} 0 0 0 ${rightX} ${baseY} L ${rightX} ${topY} Z`}
          fill="url(#studioCylinderGrad)"
        />

        {/* Скульптурная ложбинка и двойной силуэт для формы СЕРДЦЕ */}
        {shape === 'heart' && (
          <g clipPath="url(#cakeBodySideClip)">
            <path
              d={`M ${cx} ${topY + ry * 0.4} Q ${cx - 2} ${topY + bodyH * 0.5} ${cx} ${baseY + 14}`}
              stroke={cShadowDeep}
              strokeWidth="16"
              fill="none"
              opacity="0.22"
              filter="url(#softShadowBlur)"
            />
            <path
              d={`M ${cx - 12} ${topY + ry * 0.35} Q ${cx - 14} ${topY + bodyH * 0.5} ${cx - 12} ${baseY + 12}`}
              stroke={cSpecular}
              strokeWidth="9"
              fill="none"
              opacity="0.26"
              filter="url(#softShadowBlur)"
            />
          </g>
        )}

        {/* Верхняя плоскость торта */}
        <ellipse cx={cx} cy={topY} rx={rx} ry={ry} fill="url(#studioTopGrad)" />

        {/* Естественная светлая фаска верхнего края крема */}
        <path
          d={`M ${leftX + 2} ${topY + 1} A ${rx - 2} ${ry - 1} 0 0 0 ${rightX - 2} ${topY + 1}`}
          fill="none"
          stroke={cSpecular}
          strokeWidth="2.2"
          opacity={texture === 'velour' ? '0.28' : '0.68'}
        />

        {/* ТЕКСТУРА: ГЛАДКИЙ КРЕМ-ЧИЗ (тонкие следы шпателя + сатиновый блик) */}
        {texture === 'smooth' && (
          <g clipPath="url(#cakeBodySideClip)">
            <rect
              x={leftX + bodyW * 0.12}
              y={topY + 6}
              width={bodyW * 0.14}
              height={bodyH + 14}
              fill="#FFFFFF"
              opacity={darkBase ? '0.09' : '0.22'}
              filter="url(#deepShadowBlur)"
            />
            {[0.24, 0.5, 0.74].map((ratio, idx) => {
              const yLine = topY + bodyH * ratio;
              return (
                <path
                  key={idx}
                  d={`M ${leftX} ${yLine} Q ${cx} ${yLine + ry * 0.52} ${rightX} ${yLine}`}
                  fill="none"
                  stroke={idx % 2 === 0 ? cSpecular : cShadowMid}
                  strokeWidth="1.2"
                  opacity="0.22"
                />
              );
            })}
          </g>
        )}

        {/* ТЕКСТУРА: БАРХАТНЫЙ ВЕЛЮР (реальный SVG-шум какао-масла) */}
        {texture === 'velour' && (
          <g clipPath="url(#cakeBodySideClip)">
            <rect
              x={leftX - 4}
              y={topY - ry - 4}
              width={bodyW + 8}
              height={bodyH + ry * 2 + 12}
              fill={cShadowDeep}
              filter="url(#velourTextureFilter)"
              opacity={darkBase ? '0.95' : '0.85'}
            />
            {/* Мягкое матовое рассеивание */}
            <rect
              x={leftX}
              y={topY - ry}
              width={bodyW}
              height={bodyH + ry * 2}
              fill={cBase}
              opacity="0.08"
            />
          </g>
        )}

        {/* ТЕКСТУРА: АКВАРЕЛЬНЫЕ МАЗКИ МАСТИХИНОМ */}
        {texture === 'watercolor' && (
          <g clipPath="url(#cakeBodySideClip)">
            <path
              d={`M ${leftX - 10} ${topY + 38} Q ${cx - 32} ${topY + 24} ${cx + 18} ${topY + 46} T ${rightX + 10} ${topY + 34} L ${rightX + 10} ${topY + 66} Q ${cx} ${topY + 80} ${leftX - 10} ${topY + 60} Z`}
              fill={darkBase ? '#B8848E' : adjustColor(colorHex, -12)}
              opacity="0.46"
              filter="url(#watercolorBlur)"
            />
            <path
              d={`M ${leftX - 10} ${baseY - 46} Q ${cx - 42} ${baseY - 60} ${cx + 22} ${baseY - 32} T ${rightX + 10} ${baseY - 48} L ${rightX + 10} ${baseY - 12} Q ${cx - 10} ${baseY + 2} ${leftX - 10} ${baseY - 18} Z`}
              fill={darkBase ? '#C4A47C' : '#E3C3C9'}
              opacity="0.42"
              filter="url(#watercolorBlur)"
            />
            <path
              d={`M ${leftX + 14} ${topY + 68} Q ${cx - 12} ${topY + 54} ${rightX - 18} ${topY + 70}`}
              stroke="#D8BC89"
              strokeWidth="4.5"
              strokeLinecap="round"
              fill="none"
              opacity="0.44"
              filter="url(#watercolorBlur)"
            />
          </g>
        )}

        {/* ШОКОЛАДНЫЕ ПОДТЁКИ ГАНАША (с индивидуальной тенью и зеркальным бликом) */}
        {has('drips') && (
          <g>
            {/* Мягкая тень под всеми подтёками на креме */}
            <path
              d={dripData.path}
              transform="translate(1.5, 3.2)"
              fill="#2B150E"
              opacity="0.24"
              filter="url(#softShadowBlur)"
            />
            {/* Глянцевый ганаш */}
            <path d={dripData.path} fill="url(#ganacheGrad)" />
            <ellipse cx={cx} cy={topY} rx={rx} ry={ry} fill="url(#ganacheGrad)" />
            {/* Студийный блик на верхней глазури */}
            <ellipse cx={cx - rx * 0.28} cy={topY - 3} rx={rx * 0.42} ry={ry * 0.42} fill="#875A46" opacity="0.28" />
            {/* Зеркальные блики на каплях */}
            {dripData.highlights.map((h, i) => (
              <ellipse
                key={`dh-${i}`}
                cx={h.x}
                cy={h.y}
                rx={h.r * 0.55}
                ry={h.r * 1.4}
                fill="#FFFFFF"
                opacity="0.34"
              />
            ))}
          </g>
        )}

        {/* ВИНТАЖНЫЕ РЮШИ ЛАМБЕТ (многослойные кремовые гирлянды и бусины) */}
        {texture === 'lambeth' && (
          <g>
            {/* Нижний кружевной кант из ракушек */}
            {sideShells.map((sh, idx) => (
              <g key={`bot-sh-${idx}`} transform={`translate(${sh.x}, ${sh.botY}) scale(${sh.scale})`}>
                <ellipse cx="0.8" cy="2.6" rx="9" ry="5.6" fill="#46342B" opacity="0.16" filter="url(#softShadowBlur)" />
                <ellipse cx="0" cy="0" rx="8.8" ry="5.6" fill={cPipingShadow} />
                <ellipse cx="-0.8" cy="-0.8" rx="7.6" ry="4.6" fill={cPipingLight} />
                <ellipse cx="-2.4" cy="-2" rx="2.6" ry="1.2" fill="#FFFFFF" opacity="0.52" />
              </g>
            ))}

            {/* Верхние резные рюши */}
            {sideShells.map((sh, idx) => (
              <g key={`top-sh-${idx}`} transform={`translate(${sh.x}, ${sh.topY}) scale(${sh.scale * 0.96})`}>
                <ellipse cx="0.8" cy="2.6" rx="8.6" ry="5.2" fill="#46342B" opacity="0.16" filter="url(#softShadowBlur)" />
                <ellipse cx="0" cy="0" rx="8.4" ry="5.2" fill={cPipingShadow} />
                <ellipse cx="-0.7" cy="-0.8" rx="7.2" ry="4.2" fill={cPipingLight} />
                <ellipse cx="-2.2" cy="-1.8" rx="2.3" ry="1.1" fill="#FFFFFF" opacity="0.58" />
              </g>
            ))}

            {/* Многоярусные боковые гирлянды (swags) */}
            {lambethSwags.map((sw, idx) => (
              <g key={`sw-${idx}`}>
                {/* Тень под гирляндой */}
                <path
                  d={`M ${sw.x1} ${sw.y1 + 3} Q ${sw.xm} ${sw.ym + 17} ${sw.x2} ${sw.y2 + 3}`}
                  fill="none"
                  stroke="#46332A"
                  strokeWidth="8"
                  strokeLinecap="round"
                  opacity="0.14"
                  filter="url(#softShadowBlur)"
                />
                {/* Нижняя ажурная оборка */}
                <path
                  d={`M ${sw.x1} ${sw.y1} Q ${sw.xm} ${sw.ym + 14} ${sw.x2} ${sw.y2}`}
                  fill="none"
                  stroke={cPipingShadow}
                  strokeWidth="7"
                  strokeLinecap="round"
                />
                <path
                  d={`M ${sw.x1} ${sw.y1 - 0.8} Q ${sw.xm} ${sw.ym + 12.5} ${sw.x2} ${sw.y2 - 0.8}`}
                  fill="none"
                  stroke={cPipingLight}
                  strokeWidth="5.2"
                  strokeLinecap="round"
                  strokeDasharray="1 5.5"
                />
                {/* Верхняя плавная нить крема */}
                <path
                  d={`M ${sw.x1} ${sw.y1} Q ${sw.xm} ${sw.ym} ${sw.x2} ${sw.y2}`}
                  fill="none"
                  stroke={cPipingMid}
                  strokeWidth="4.4"
                  strokeLinecap="round"
                />
                <path
                  d={`M ${sw.x1} ${sw.y1 - 0.8} Q ${sw.xm} ${sw.ym - 1.2} ${sw.x2} ${sw.y2 - 0.8}`}
                  fill="none"
                  stroke={cPipingLight}
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
                {/* Розетка на стыке */}
                <circle cx={sw.x1} cy={sw.y1} r="5.2" fill={cPipingShadow} />
                <circle cx={sw.x1 - 0.6} cy={sw.y1 - 0.7} r="4.2" fill={cPipingLight} />
                <circle cx={sw.x1 - 1.6} cy={sw.y1 - 1.5} r="1.2" fill="#FFFFFF" opacity="0.6" />
                {idx === lambethSwags.length - 1 && (
                  <>
                    <circle cx={sw.x2} cy={sw.y2} r="5.2" fill={cPipingShadow} />
                    <circle cx={sw.x2 - 0.6} cy={sw.y2 - 0.7} r="4.2" fill={cPipingLight} />
                  </>
                )}
              </g>
            ))}
          </g>
        )}

        {/* СУСАЛЬНОЕ ЗОЛОТО 24К (рваные органические лепестки) */}
        {has('gold') && (
          <g clipPath="url(#cakeBodySideClip)">
            <path
              d={`M ${leftX + 24} ${topY + 42} L ${leftX + 36} ${topY + 35} L ${leftX + 43} ${topY + 41} L ${leftX + 47} ${topY + 51} L ${leftX + 34} ${topY + 58} L ${leftX + 26} ${topY + 52} Z`}
              fill="url(#champagneGoldGrad)"
              opacity="0.92"
            />
            <path
              d={`M ${cx + 22} ${baseY - 48} L ${cx + 38} ${baseY - 56} L ${cx + 46} ${baseY - 46} L ${cx + 41} ${baseY - 33} L ${cx + 27} ${baseY - 37} Z`}
              fill="url(#champagneGoldGrad)"
              opacity="0.9"
            />
            <path
              d={`M ${cx - 18} ${topY + 62} L ${cx - 5} ${topY + 57} L ${cx - 2} ${topY + 67} L ${cx - 13} ${topY + 71} Z`}
              fill="url(#champagneGoldGrad)"
              opacity="0.86"
            />
            <path
              d={`M ${rightX - 38} ${topY + 38} L ${rightX - 24} ${topY + 32} L ${rightX - 19} ${topY + 44} L ${rightX - 31} ${topY + 48} Z`}
              fill="url(#champagneGoldGrad)"
              opacity="0.88"
            />
          </g>
        )}

        {/* САХАРНЫЙ ЖЕМЧУГ (перламутровые сферы разного калибра с микротенью) */}
        {has('pearls') && (
          <g>
            {[
              { x: cx - bodyW * 0.34, y: topY + 34, r: 3.6 },
              { x: cx - bodyW * 0.21, y: topY + 58, r: 2.5 },
              { x: cx - bodyW * 0.05, y: topY + 42, r: 3.9 },
              { x: cx + bodyW * 0.14, y: topY + 54, r: 2.8 },
              { x: cx + bodyW * 0.31, y: topY + 36, r: 3.5 },
              { x: cx - bodyW * 0.29, y: baseY - 26, r: 2.9 },
              { x: cx + bodyW * 0.06, y: baseY - 32, r: 2.4 },
              { x: cx + bodyW * 0.24, y: baseY - 22, r: 3.4 },
              { x: cx - bodyW * 0.12, y: baseY - 19, r: 2.2 }
            ].map((p, idx) => (
              <g key={`pearl-${idx}`}>
                <ellipse cx={p.x + 1.1} cy={p.y + p.r * 0.72} rx={p.r * 0.9} ry={p.r * 0.55} fill="#3E2D24" opacity="0.2" />
                <circle cx={p.x} cy={p.y} r={p.r} fill="url(#pearlSphereGrad)" />
                <circle cx={p.x - p.r * 0.34} cy={p.y - p.r * 0.34} r={p.r * 0.3} fill="#FFFFFF" opacity="0.95" />
              </g>
            ))}
          </g>
        )}

        {/* АТЛАСНЫЕ БАНТИКИ (шёлковые тонкие ленточки с переливом и тенью) */}
        {has('bows') && (
          <g>
            {[
              { x: leftX + bodyW * 0.23, y: topY + 42 },
              { x: rightX - bodyW * 0.23, y: topY + 42 }
            ].map((b, idx) => {
              const ribBase = darkBase ? '#EED7DA' : '#B26775';
              const ribLight = darkBase ? '#FFF5F6' : '#D593A0';
              const ribDark = darkBase ? '#C7A3A8' : '#7E3E4B';
              return (
                <g key={`bow-${idx}`} transform={`translate(${b.x}, ${b.y})`}>
                  {/* Мягкая тень банта на стенке торта */}
                  <g transform="translate(2, 3.5)" opacity="0.2" filter="url(#softShadowBlur)">
                    <path d="M -2 2 Q -9 24 -15 44" stroke="#2D1B18" strokeWidth="4" fill="none" />
                    <path d="M 2 2 Q 9 25 14 45" stroke="#2D1B18" strokeWidth="4" fill="none" />
                    <path d="M 0 0 C -17 -13, -24 5, -2 3 Z" fill="#2D1B18" />
                    <path d="M 0 0 C 17 -13, 24 5, 2 3 Z" fill="#2D1B18" />
                  </g>
                  {/* Хвостики ленты */}
                  <path d="M -1.5 2 Q -8 24 -14 44" stroke={ribBase} strokeWidth="3.6" strokeLinecap="round" fill="none" />
                  <path d="M -2 4 Q -8.5 22 -13 40" stroke={ribLight} strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.7" />
                  <path d="M 1.5 2 Q 8.5 25 13.5 45" stroke={ribDark} strokeWidth="3.6" strokeLinecap="round" fill="none" />
                  <path d="M 1.8 4 Q 8 23 12.2 41" stroke={ribBase} strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.85" />
                  {/* Шёлковые петли */}
                  <path d="M 0 0 C -17 -14, -24 5, -2 3.2 Z" fill={ribBase} />
                  <path d="M -2 0.2 C -13 -8.5, -18 2, -3 2.2 Z" fill={ribLight} opacity="0.55" />
                  <path d="M 0 0 C 17 -14, 24 5, 2 3.2 Z" fill={ribBase} />
                  <path d="M 2 0.2 C 13 -8.5, 18 2, 3 2.2 Z" fill={ribDark} opacity="0.35" />
                  {/* Узелок */}
                  <ellipse cx="0" cy="1.2" rx="3.4" ry="3.8" fill={ribDark} />
                  <ellipse cx="-0.7" cy="0.3" rx="1.4" ry="1.8" fill={ribLight} opacity="0.7" />
                </g>
              );
            })}
          </g>
        )}

        {/* ФРАНЦУЗСКИЕ МАКАРОНС НА ВЕРХУ ТОРТА */}
        {has('macarons') && (
          <g>
            {renderRealisticMacaron(cx - 38, topY - 8, -14, '#E8CDD1', 0.96, 'sideMac1')}
            {renderRealisticMacaron(cx + 36, topY - 10, 12, '#EDE1D0', 0.94, 'sideMac2')}
            {renderRealisticMacaron(cx + 2, topY - 14, -4, '#D3DFC8', 0.98, 'sideMac3')}
          </g>
        )}

        {/* СВЕЖИЕ ЯГОДЫ (КЛУБНИКА, МАЛИНА, ГОЛУБИКА, МЯТА) */}
        {has('berries') && (
          <g>
            {/* Мята позади ягод */}
            {renderMintLeaf(cx - 54, topY - 5, -22, 1.05, 'ml1')}
            {renderMintLeaf(cx + 56, topY - 5, 198, 1.05, 'ml2')}
            {renderMintLeaf(cx - 4, topY - 14, -68, 0.92, 'ml3')}

            {/* Клубника целая и в разрезе */}
            {renderRealisticStrawberry(cx - 26, topY - 11, 0.98, -12, false, 'sb1')}
            {renderRealisticStrawberry(cx + 24, topY - 10, 0.95, 16, true, 'sb2')}

            {/* Малина */}
            {renderRealisticRaspberry(cx - 50, topY - 6, 0.92, 'rb1')}
            {renderRealisticRaspberry(cx + 4, topY - 11, 0.96, 'rb2')}
            {renderRealisticRaspberry(cx + 48, topY - 6, 0.9, 'rb3')}

            {/* Голубика */}
            {renderRealisticBlueberry(cx - 62, topY - 2, 5.4, 'bb1')}
            {renderRealisticBlueberry(cx - 12, topY - 4, 6.0, 'bb2')}
            {renderRealisticBlueberry(cx + 38, topY - 3, 5.8, 'bb3')}
            {renderRealisticBlueberry(cx + 14, topY - 2, 5.1, 'bb4')}
          </g>
        )}
      </g>
    </svg>
  );

  // ==========================================================================
  // 2. ВИД СВЕРХУ (С ОБЪЁМНОЙ КРЕМОВОЙ НАДПИСЬЮ И ВЕНКОМ ДЕКОРА)
  // ==========================================================================
  const renderTopView = () => {
    const textCenterY = shape === 'heart' ? 174 : 184;
    const fontSize = Math.round(23 * activeFont.scale * (wrappedLines.length >= 3 ? 0.82 : 1));
    const lineHeight = fontSize * 1.24;

    return (
      <svg
        viewBox="0 0 440 365"
        className={`w-full h-full select-none transition-all duration-500 ${
          compact ? 'max-h-[195px]' : 'max-h-[370px]'
        }`}
        role="img"
        aria-label="Студийное превью торта вид сверху"
      >
        {renderSharedDefs()}

        <defs>
          <clipPath id="topCakeClip">
            <path d={topShapePath} />
          </clipPath>
        </defs>

        <ellipse cx="220" cy="182" rx="190" ry="158" fill="url(#studioWallGlow)" />

        <g transform={`translate(220, 182) scale(${topScale}) translate(-220, -182)`}>
          {/* Фарфоровая тарелка сверху */}
          {shape === 'oval' ? (
            <>
              <ellipse cx="224" cy="190" rx="160" ry="120" fill="#8C7A6B" opacity="0.18" filter="url(#deepShadowBlur)" />
              <ellipse cx="220" cy="182" rx="158" ry="118" fill="url(#porcelainStandGrad)" />
              <ellipse cx="220" cy="182" rx="147" ry="109" fill="none" stroke="url(#champagneGoldGrad)" strokeWidth="1.2" opacity="0.72" />
            </>
          ) : (
            <>
              <circle cx="224" cy="190" r="146" fill="#8C7A6B" opacity="0.18" filter="url(#deepShadowBlur)" />
              <circle cx="220" cy="182" r="144" fill="url(#porcelainStandGrad)" />
              <circle cx="220" cy="182" r="134" fill="none" stroke="url(#champagneGoldGrad)" strokeWidth="1.2" opacity="0.72" />
            </>
          )}

          {/* Мягкая студийная тень торта на тарелке */}
          <path d={topShapePath} transform="translate(5, 8)" fill="#59463A" opacity="0.2" filter="url(#deepShadowBlur)" />

          {/* Корпус торта сверху */}
          <path d={topShapePath} fill="url(#studioTopGrad)" />

          {/* Мягкая светлая фаска по краю торта */}
          <path d={topShapePath} fill="none" stroke={cSpecular} strokeWidth="2.4" opacity="0.45" />

          {/* Внутренние текстуры и покрытия */}
          <g clipPath="url(#topCakeClip)">
            {texture === 'velour' && (
              <rect x="70" y="50" width="300" height="270" fill={cShadowDeep} filter="url(#velourTextureFilter)" opacity="0.85" />
            )}

            {texture === 'watercolor' && (
              <g opacity="0.52" filter="url(#watercolorBlur)">
                <circle cx="220" cy="182" r="102" fill="none" stroke={adjustColor(colorHex, darkBase ? 20 : -14)} strokeWidth="20" strokeDasharray="85 40" />
                <circle cx="220" cy="182" r="68" fill="none" stroke="#E5C7CD" strokeWidth="14" strokeDasharray="60 32" />
                <circle cx="220" cy="182" r="38" fill="none" stroke={cSpecular} strokeWidth="10" strokeDasharray="45 25" />
              </g>
            )}

            {/* Глянцевый ганаш сверху при выборе подтёков */}
            {has('drips') && (
              <g>
                <path
                  d={topShapePath}
                  fill="url(#ganacheGrad)"
                  transform="translate(220, 182) scale(0.955) translate(-220, -182)"
                />
                <ellipse cx="178" cy="140" rx="38" ry="18" fill="#8D614D" opacity="0.22" transform="rotate(-24 178 140)" filter="url(#watercolorBlur)" />
              </g>
            )}

            {/* Сусальное золото по периметру */}
            {has('gold') && (
              <g opacity="0.92">
                <polygon points="134,132 152,122 156,136 140,142" fill="url(#champagneGoldGrad)" />
                <polygon points="286,122 304,132 298,144 282,135" fill="url(#champagneGoldGrad)" />
                <polygon points="282,232 298,224 302,238 286,244" fill="url(#champagneGoldGrad)" />
                <polygon points="138,228 153,222 156,235 142,238" fill="url(#champagneGoldGrad)" />
              </g>
            )}
          </g>

          {/* Кружевной двойной венок Ламбет сверху */}
          {texture === 'lambeth' && (
            <g>
              {topLambethOuter.map((pt, i) => (
                <g key={`tlo-${i}`}>
                  <circle cx={pt.x + 1} cy={pt.y + 1.5} r="8" fill="#46342B" opacity="0.14" />
                  <circle cx={pt.x} cy={pt.y} r="7.8" fill={cPipingShadow} />
                  <circle cx={pt.x - 0.8} cy={pt.y - 0.8} r="6.6" fill={cPipingLight} />
                  <circle cx={pt.x - 2.4} cy={pt.y - 2.4} r="1.6" fill="#FFFFFF" opacity="0.58" />
                </g>
              ))}
              {topLambethInner.map((pt, i) => (
                <circle key={`tli-${i}`} cx={pt.x} cy={pt.y} r="3.2" fill={cPipingLight} opacity="0.9" />
              ))}
            </g>
          )}

          {/* Жемчужины россыпью сверху */}
          {has('pearls') && (
            <g>
              {[
                { x: 158, y: 114, r: 3.6 },
                { x: 282, y: 118, r: 3.4 },
                { x: 300, y: 184, r: 3.0 },
                { x: 138, y: 186, r: 3.1 },
                { x: 174, y: 248, r: 3.4 },
                { x: 266, y: 246, r: 3.3 },
                { x: 220, y: 260, r: 2.8 },
                { x: 220, y: 102, r: 2.9 }
              ].map((p, i) => (
                <g key={`tp-${i}`}>
                  <circle cx={p.x + 1} cy={p.y + 1.2} r={p.r} fill="#3A2820" opacity="0.18" />
                  <circle cx={p.x} cy={p.y} r={p.r} fill="url(#pearlSphereGrad)" />
                  <circle cx={p.x - p.r * 0.32} cy={p.y - p.r * 0.32} r={p.r * 0.3} fill="#FFFFFF" />
                </g>
              ))}
            </g>
          )}

          {/* Верхний полумесяц из макаронс (не перекрывает надпись в центре) */}
          {has('macarons') && (
            <g>
              {renderRealisticMacaron(174, shape === 'heart' ? 104 : 106, -24, '#E8CDD1', 0.85, 'topMac1')}
              {renderRealisticMacaron(266, shape === 'heart' ? 104 : 106, 22, '#EDE1D0', 0.85, 'topMac2')}
              {renderRealisticMacaron(220, shape === 'heart' ? 124 : 94, 4, '#D3DFC8', 0.86, 'topMac3')}
            </g>
          )}

          {/* Ягодный венок в верхней дуге */}
          {has('berries') && (
            <g>
              {renderMintLeaf(148, 120, -34, 0.95, 'tml1')}
              {renderMintLeaf(292, 120, 214, 0.95, 'tml2')}
              {renderRealisticStrawberry(156, 114, 0.84, -32, false, 'tsb1')}
              {renderRealisticStrawberry(284, 114, 0.84, 30, true, 'tsb2')}
              {renderRealisticRaspberry(192, shape === 'heart' ? 106 : 98, 0.82, 'trb1')}
              {renderRealisticRaspberry(248, shape === 'heart' ? 106 : 98, 0.82, 'trb2')}
              {renderRealisticBlueberry(174, 108, 5.2, 'tbb1')}
              {renderRealisticBlueberry(266, 108, 5.2, 'tbb2')}
              {renderRealisticBlueberry(142, 134, 4.8, 'tbb3')}
              {renderRealisticBlueberry(298, 134, 4.8, 'tbb4')}
            </g>
          )}

          {/* Бантики по бокам на виде сверху */}
          {has('bows') && (
            <g>
              {[
                { x: 118, y: 162, rot: -20 },
                { x: 322, y: 162, rot: 20 }
              ].map((b, i) => {
                const col = darkBase ? '#EED7DA' : '#B26775';
                const dk = darkBase ? '#C7A3A8' : '#7E3E4B';
                return (
                  <g key={`tbw-${i}`} transform={`translate(${b.x}, ${b.y}) rotate(${b.rot})`}>
                    <path d="M 0 0 C -13 -11, -18 4, -2 3 Z" fill={col} />
                    <path d="M 0 0 C 13 -11, 18 4, 2 3 Z" fill={col} />
                    <circle cx="0" cy="1" r="2.8" fill={dk} />
                  </g>
                );
              })}
            </g>
          )}

          {/* Свечи (вид сверху в нижней дуге) */}
          {has('candles') && (
            <g>
              {[
                { x: 186, y: 244 },
                { x: 220, y: 252 },
                { x: 254, y: 244 }
              ].map((c, i) => (
                <g key={`tc-${i}`}>
                  <circle cx={c.x} cy={c.y} r="14" fill="url(#candleHaloGrad)" />
                  <circle cx={c.x} cy={c.y} r="4.5" fill="#FAF4EC" />
                  <circle cx={c.x} cy={c.y} r="2.2" fill="#F39C2A" />
                </g>
              ))}
            </g>
          )}

          {/* ОБЪЁМНАЯ КРЕМОВАЯ НАДПИСЬ ИЗ КОНДИТЕРСКОГО МЕШКА */}
          {wrappedLines.length > 0 && (
            <g filter="url(#pipedTextShadow)">
              {wrappedLines.map((line, idx) => {
                const offsetY = (idx - (wrappedLines.length - 1) / 2) * lineHeight;
                return (
                  <g key={idx}>
                    {/* Основной слой отсаженного крема */}
                    <text
                      x="220"
                      y={textCenterY + offsetY}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={textColor}
                      style={{
                        fontFamily: activeFont.family,
                        fontSize: `${fontSize}px`,
                        fontWeight: fontId === 'serif' ? 600 : 400,
                        letterSpacing: fontId === 'serif' ? '0.06em' : '0.01em'
                      }}
                    >
                      {line}
                    </text>
                    {/* Тонкий верхний блик объёма крема */}
                    <text
                      x="219.5"
                      y={textCenterY + offsetY - 0.6}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#FFFFFF"
                      opacity={textColor === '#FFFDF8' ? '0.2' : '0.16'}
                      style={{
                        fontFamily: activeFont.family,
                        fontSize: `${fontSize}px`,
                        fontWeight: fontId === 'serif' ? 600 : 400,
                        letterSpacing: fontId === 'serif' ? '0.06em' : '0.01em'
                      }}
                    >
                      {line}
                    </text>
                  </g>
                );
              })}
            </g>
          )}
        </g>
      </svg>
    );
  };

  // ==========================================================================
  // 3. ВИД В РАЗРЕЗЕ (АППЕТИТНЫЙ СТУДИЙНЫЙ КУСОЧЕК НА ФАРФОРОВОЙ ТАРЕЛКЕ)
  // ==========================================================================
  const renderSliceView = () => {
    const s = flavorObj.slice;
    const outerCoat = has('drips') ? '#3A1F15' : colorHex;
    const outerLight = adjustColor(outerCoat, 16);
    const outerDark = adjustColor(outerCoat, -18);

    return (
      <svg
        viewBox="0 0 440 365"
        className={`w-full h-full select-none transition-all duration-500 ${
          compact ? 'max-h-[195px]' : 'max-h-[370px]'
        }`}
        role="img"
        aria-label={`Аппетитный разрез начинки ${flavorObj.name}`}
      >
        {renderSharedDefs()}

        <defs>
          <clipPath id="sliceBodyClip">
            <rect x="98" y="108" width="218" height="162" rx="5" />
          </clipPath>
          <linearGradient id="sliceCreamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={s.cream} />
            <stop offset="100%" stopColor={s.creamShade} />
          </linearGradient>
          <linearGradient id="sliceFillingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={s.fillingHighlight} />
            <stop offset="55%" stopColor={s.filling} />
            <stop offset="100%" stopColor={adjustColor(s.filling, -22)} />
          </linearGradient>
        </defs>

        <ellipse cx="220" cy="188" rx="188" ry="140" fill="url(#studioWallGlow)" />

        {/* Десертная фарфоровая тарелка с мягкой тенью */}
        <ellipse cx="220" cy="296" rx="156" ry="28" fill="#8C7A6B" opacity="0.22" filter="url(#deepShadowBlur)" />
        <ellipse cx="220" cy="286" rx="154" ry="27" fill="url(#porcelainStandGrad)" />
        <ellipse cx="220" cy="286" rx="124" ry="20" fill="none" stroke="url(#champagneGoldGrad)" strokeWidth="1.1" opacity="0.68" />

        {/* Контактная тень кусочка на тарелке */}
        <ellipse cx="216" cy="274" rx="118" ry="12" fill="#4E3B30" opacity="0.24" filter="url(#softShadowBlur)" />

        {/* Верхняя перспектива кусочка (треугольный верх в цвете покрытия) */}
        <path
          d="M 98 108 L 254 66 Q 318 78 330 108 L 98 108 Z"
          fill={outerLight}
        />
        <path
          d="M 98 108 L 254 66 Q 290 72 308 86 L 145 108 Z"
          fill="#FFFFFF"
          opacity="0.16"
        />

        {/* Задняя скруглённая стенка покрытия */}
        <path
          d="M 314 108 L 330 108 L 330 264 Q 322 273 312 269 Z"
          fill={outerDark}
        />

        {/* СЛОИ СРЕЗА */}
        <g clipPath="url(#sliceBodyClip)">
          {/* Базовый крем-чиз */}
          <rect x="98" y="108" width="218" height="162" fill="url(#sliceCreamGrad)" />

          {/* Верхний тонкий слой наружного крема */}
          <rect x="98" y="108" width="218" height="12" fill={outerCoat} />

          {/* КОРЖ 1 (верхний бисквит) */}
          <rect x="98" y="121" width="206" height="33" rx="2" fill={s.sponge} />
          <rect x="98" y="121" width="206" height="33" fill={s.spongeDeep} filter="url(#spongeCrumbFilter)" />

          {/* ПРОСЛОЙКА 1 (крем + глянцевая начинка) */}
          <rect x="98" y="154" width="206" height="24" fill="url(#sliceCreamGrad)" />
          <path
            d="M 102 163 Q 140 156 182 164 T 256 161 T 300 164 L 300 174 Q 250 178 198 173 T 102 175 Z"
            fill="url(#sliceFillingGrad)"
          />
          <path
            d="M 110 165 Q 152 161 194 166"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            fill="none"
            opacity="0.28"
          />

          {/* КОРЖ 2 (средний бисквит) */}
          <rect x="98" y="178" width="206" height="33" rx="2" fill={s.sponge} />
          <rect x="98" y="178" width="206" height="33" fill={s.spongeDeep} filter="url(#spongeCrumbFilter)" />

          {/* ПРОСЛОЙКА 2 (крем + начинка) */}
          <rect x="98" y="211" width="206" height="24" fill="url(#sliceCreamGrad)" />
          <path
            d="M 102 220 Q 146 213 190 221 T 264 218 T 300 221 L 300 231 Q 252 235 198 230 T 102 232 Z"
            fill="url(#sliceFillingGrad)"
          />
          <path
            d="M 114 222 Q 160 218 206 223"
            stroke="#FFFFFF"
            strokeWidth="1.2"
            fill="none"
            opacity="0.28"
          />

          {/* КОРЖ 3 (нижний бисквит) */}
          <rect x="98" y="235" width="206" height="35" rx="2" fill={s.sponge} />
          <rect x="98" y="235" width="206" height="35" fill={s.spongeDeep} filter="url(#spongeCrumbFilter)" />

          {/* Боковая стенка внешнего крема справа */}
          <rect x="304" y="108" width="12" height="162" fill={outerCoat} />

          {/* Вкрапления по типу начинки (вишни, дроблёный орех, семена малины/маракуйи) */}
          {s.type === 'cherry' && (
            <g>
              {[128, 178, 228, 276].map((x, idx) => (
                <g key={`ch-${idx}`}>
                  <ellipse cx={x} cy={idx % 2 === 0 ? 168 : 226} rx="9" ry="5.5" fill="#470A16" />
                  <ellipse cx={x - 2.5} cy={(idx % 2 === 0 ? 168 : 226) - 1.6} rx="3" ry="1.3" fill="#B53850" opacity="0.65" />
                </g>
              ))}
            </g>
          )}
          {s.type === 'caramel-nuts' && (
            <g>
              {[122, 158, 198, 238, 276].map((x, idx) => (
                <g key={`cn-${idx}`}>
                  <ellipse cx={x} cy="169" rx="6.2" ry="3.4" fill="#E8C698" />
                  <ellipse cx={x + 12} cy="226" rx="5.6" ry="3.2" fill="#DFB782" />
                </g>
              ))}
            </g>
          )}
          {(s.type === 'raspberry' || s.type === 'strawberry' || s.type === 'tropical') && (
            <g>
              {[118, 148, 184, 218, 252, 282].map((x, idx) => (
                <g key={`sd-${idx}`}>
                  <circle cx={x} cy={168 + (idx % 2) * 2} r="1.4" fill={s.type === 'tropical' ? '#4A2B12' : '#FFF3F5'} opacity="0.68" />
                  <circle cx={x - 6} cy={226 + (idx % 2) * 2} r="1.4" fill={s.type === 'tropical' ? '#4A2B12' : '#FFF3F5'} opacity="0.68" />
                </g>
              ))}
            </g>
          )}

          {/* Мягкое студийное затенение по правой кромке среза */}
          <rect x="268" y="108" width="48" height="162" fill="#2A1D16" opacity="0.06" />
        </g>

        {/* Аппетитный гарнир на макушке кусочка */}
        {renderMintLeaf(252, 79, -28, 0.9, 'slm')}
        {s.type === 'cherry' || s.type === 'raspberry' ? (
          renderRealisticRaspberry(266, 76, 0.92, 'slb')
        ) : (
          renderRealisticStrawberry(266, 75, 0.86, 14, true, 'sls')
        )}
        {renderRealisticBlueberry(244, 83, 5.2, 'slbl')}

        {/* Элегантная подпись вкуса */}
        <text
          x="220"
          y="336"
          textAnchor="middle"
          fill="#7B6C64"
          style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '16px', fontStyle: 'italic' }}
        >
          {flavorObj.name}
        </text>
      </svg>
    );
  };

  return (
    <div className="w-full flex items-center justify-center transition-all duration-300">
      {viewMode === 'side' && renderSideView()}
      {viewMode === 'top' && renderTopView()}
      {viewMode === 'slice' && renderSliceView()}
    </div>
  );
}

// ============================================================================
// ГЛАВНЫЙ КОМПОНЕНТ КОНСТРУКТОРА «MERCI MON CHÉRI»
// ============================================================================

export default function App() {
  // Текущий микро-шаг (1..7)
  const [step, setStep] = useState(1);

  // Режим просмотра 2D-превью ('side' | 'top' | 'slice')
  const [viewMode, setViewMode] = useState('side');

  // Компактность sticky-превью на мобильных устройствах
  const [mobilePreviewCompact, setMobilePreviewCompact] = useState(false);

  // Параметры собираемого торта
  const [shape, setShape] = useState('round');
  const [weight, setWeight] = useState(2);
  const [flavor, setFlavor] = useState('vanilla-raspberry');
  const [colorId, setColorId] = useState('plombir');
  const [texture, setTexture] = useState('smooth');
  const [decor, setDecor] = useState(['berries']);
  const [inscription, setInscription] = useState('');
  const [fontId, setFontId] = useState('calligraphy');
  const [textColor, setTextColor] = useState('#43281E');

  // Внутренние состояния шагов
  const [flavorFilter, setFlavorFilter] = useState('Все');
  const [openCompositionId, setOpenCompositionId] = useState(null);
  const [activeDecorTab, setActiveDecorTab] = useState(DECOR_TABS[0].id);
  const [weightLimitNotice, setWeightLimitNotice] = useState('');

  // Данные оформления заказа (Шаг 07)
  const tomorrowIso = useMemo(() => getIsoDateOffset(1), []);
  const defaultDateIso = useMemo(() => getIsoDateOffset(3), []);
  const [eventDate, setEventDate] = useState(defaultDateIso);
  const [deliveryMethod, setDeliveryMethod] = useState('delivery');
  const [deliverySlot, setDeliverySlot] = useState(DELIVERY_SLOTS[0]);
  const [address, setAddress] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [orderComment, setOrderComment] = useState('');
  const [formErrors, setFormErrors] = useState({});

  // Модалки, детализация цены и тосты
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showPresetsModal, setShowPresetsModal] = useState(false);
  const [showSketchModal, setShowSketchModal] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [toast, setToast] = useState(null);

  // Форма модалки «Свой эскиз»
  const [sketchForm, setSketchForm] = useState({
    name: '',
    contact: '',
    notes: '',
    fileName: '',
    previewUrl: ''
  });
  const [sketchError, setSketchError] = useState('');
  const [sketchSent, setSketchSent] = useState(false);

  const toastTimer = useRef(null);

  // Подключение изысканной типографики Google Fonts
  useEffect(() => {
    const id = 'merci-mon-cheri-fonts';
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href =
        'https://fonts.googleapis.com/css2?family=Bad+Script&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,600&family=Manrope:wght@400;500;600;700&family=Marck+Script&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  const notify = (message, tone = 'dark') => {
    setToast({ message, tone });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  };

  // Восстановление сборки из URL hash при открытии ссылки
  useEffect(() => {
    try {
      const h = window.location.hash || '';
      if (!h.startsWith('#mmc=')) return;
      const p = new URLSearchParams(h.slice(5));

      const s = p.get('s');
      const foundShape = SHAPES.find((item) => item.id === s);
      if (foundShape) setShape(foundShape.id);

      const w = parseFloat(p.get('w'));
      const maxW = foundShape ? foundShape.maxWeight : 5;
      if (!Number.isNaN(w) && WEIGHT_OPTIONS.includes(w)) {
        setWeight(Math.min(w, maxW));
      }

      const f = p.get('f');
      if (FLAVORS.some((item) => item.id === f)) setFlavor(f);

      const c = p.get('c');
      if (COATING_COLORS.some((item) => item.id === c)) setColorId(c);

      const t = p.get('t');
      if (COATING_TEXTURES.some((item) => item.id === t)) setTexture(t);

      const d = p.get('d');
      if (d !== null) {
        const list = d.split(',').filter((id) => ALL_DECOR_ITEMS.some((it) => it.id === id));
        setDecor(list);
      }

      const txt = p.get('txt');
      if (txt !== null) setInscription(txt.slice(0, 36));

      const fn = p.get('fn');
      if (INSCRIPTION_FONTS.some((item) => item.id === fn)) setFontId(fn);

      const tc = p.get('tc');
      if (tc && /^#[0-9A-Fa-f]{6}$/.test(tc)) setTextColor(tc);

      notify('Сборка торта восстановлена по ссылке');
    } catch {
      // Игнорируем повреждённый hash
    }
  }, []);

  // Производные объекты выбранной конфигурации
  const shapeObj = useMemo(() => SHAPES.find((s) => s.id === shape) || SHAPES[0], [shape]);
  const flavorObj = useMemo(() => FLAVORS.find((f) => f.id === flavor) || FLAVORS[0], [flavor]);
  const colorObj = useMemo(() => COATING_COLORS.find((c) => c.id === colorId) || COATING_COLORS[0], [colorId]);
  const textureObj = useMemo(
    () => COATING_TEXTURES.find((t) => t.id === texture) || COATING_TEXTURES[0],
    [texture]
  );
  const selectedDecorObjs = useMemo(
    () => ALL_DECOR_ITEMS.filter((item) => decor.includes(item.id)),
    [decor]
  );
  const activeStepObj = STEPS[step - 1];

  // Гости (200 г на порцию -> 1 кг = 5 гостей)
  const guestsCount = Math.max(4, Math.round(weight * 5));
  const maxGuests = Math.round(shapeObj.maxWeight * 5);
  const isUrgent = eventDate === tomorrowIso;

  // Живой расчёт стоимости с прозрачной разбивкой
  const pricing = useMemo(() => {
    const base = weight * PRICE_PER_KG;
    const textureFee = textureObj.price;
    const decorFee = selectedDecorObjs.reduce((acc, item) => acc + item.price, 0);
    const hasText = inscription.trim().length > 0;
    const textFee = hasText ? INSCRIPTION_PRICE : 0;

    const subtotal = base + textureFee + decorFee + textFee;
    const urgencyFee = isUrgent ? Math.round(subtotal * URGENCY_RATE) : 0;
    const deliveryFee = deliveryMethod === 'delivery' ? DELIVERY_PRICE : 0;
    const total = subtotal + urgencyFee + deliveryFee;

    const lines = [
      { label: `Торт ${shapeObj.name}, ${String(weight).replace('.', ',')} кг`, amount: base }
    ];
    if (textureFee > 0) lines.push({ label: textureObj.name, amount: textureFee });
    selectedDecorObjs.forEach((d) => lines.push({ label: d.name, amount: d.price }));
    if (textFee > 0) lines.push({ label: 'Кремовая надпись', amount: textFee });
    if (urgencyFee > 0) {
      lines.push({ label: 'Срочный заказ на завтра (+20%)', amount: urgencyFee, urgent: true });
    }
    if (deliveryFee > 0) lines.push({ label: 'Бережная доставка', amount: deliveryFee });

    return { base, subtotal, urgencyFee, deliveryFee, total, lines };
  }, [weight, shapeObj, textureObj, selectedDecorObjs, inscription, isUrgent, deliveryMethod]);

  const filteredFlavors = useMemo(() => {
    if (flavorFilter === 'Все') return FLAVORS;
    return FLAVORS.filter((f) => f.tags.includes(flavorFilter));
  }, [flavorFilter]);

  // Переход между шагами с умным автопереключением ракурсов
  const navigateToStep = (nextStep) => {
    const target = Math.max(1, Math.min(STEPS.length, nextStep));
    setStep(target);
    if (target === 3) {
      setViewMode('slice');
    } else if (target === 4) {
      setViewMode('side');
    } else if (target === 6) {
      setViewMode('top');
    } else if (target === 5 && viewMode === 'slice') {
      setViewMode('side');
    }
  };

  // Выбор формы с автокоррекцией веса
  const handleSelectShape = (newShapeId) => {
    const found = SHAPES.find((s) => s.id === newShapeId);
    if (!found) return;
    setShape(newShapeId);
    if (weight > found.maxWeight) {
      setWeight(found.maxWeight);
      setWeightLimitNotice(
        `Для формы «${found.name}» максимальный вес — ${String(found.maxWeight).replace('.', ',')} кг. Вес мягко скорректирован.`
      );
      notify(`Вес скорректирован до ${String(found.maxWeight).replace('.', ',')} кг`);
    } else {
      setWeightLimitNotice('');
    }
  };

  // Изменение количества гостей (4–25 чел.)
  const handleGuestsChange = (val) => {
    const bounded = Math.max(4, Math.min(maxGuests, val));
    const kg = Math.round((bounded * 0.2) * 2) / 2;
    setWeight(Math.max(1, Math.min(shapeObj.maxWeight, kg)));
    setWeightLimitNotice('');
  };

  const toggleDecorItem = (id) => {
    setDecor((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
    if (viewMode === 'slice') setViewMode('side');
  };

  // Применение готового пресета из модалки «Вдохновение»
  const handleApplyPreset = (preset) => {
    const c = preset.config;
    setShape(c.shape);
    setWeight(c.weight);
    setFlavor(c.flavor);
    setColorId(c.colorId);
    setTexture(c.texture);
    setDecor(c.decor);
    setInscription(c.inscription);
    setFontId(c.font);
    setTextColor(c.textColor);
    setWeightLimitNotice('');
    setShowPresetsModal(false);
    setViewMode('side');
    notify(`Образ «${preset.name}» применён — настройте детали по желанию`);
  };

  // Поделиться сборкой через URL hash
  const handleShareUrl = async () => {
    const params = new URLSearchParams({
      s: shape,
      w: String(weight),
      f: flavor,
      c: colorId,
      t: texture,
      d: decor.join(','),
      txt: inscription,
      fn: fontId,
      tc: textColor
    });
    const hash = `#mmc=${params.toString()}`;
    try {
      window.history.replaceState(null, '', hash);
    } catch {
      // Безопасно для iframe
    }
    const url = `${window.location.origin}${window.location.pathname}${hash}`;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        notify('Ссылка на вашу сборку скопирована');
        return;
      }
    } catch {
      // Fallback ниже
    }
    try {
      const ta = document.createElement('textarea');
      ta.value = url;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      notify('Ссылка на вашу сборку скопирована');
    } catch {
      notify('Параметры сборки сохранены в адресной строке');
    }
  };

  // Загрузка референса в модалке «Свой эскиз»
  const handleSketchFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setSketchError('Загрузите изображение в формате JPG, PNG или WEBP.');
      return;
    }
    setSketchError('');
    const reader = new FileReader();
    reader.onload = () => {
      setSketchForm((prev) => ({
        ...prev,
        fileName: file.name,
        previewUrl: typeof reader.result === 'string' ? reader.result : ''
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSketchSubmit = (e) => {
    e.preventDefault();
    if (!sketchForm.name.trim() || !sketchForm.contact.trim()) {
      setSketchError('Укажите имя и телефон или Telegram для связи.');
      return;
    }
    setSketchError('');
    setSketchSent(true);
  };

  // Оформление заказа (Шаг 07)
  const handleSubmitOrder = () => {
    const errs = {};
    if (!customerName.trim() || customerName.trim().length < 2) {
      errs.name = 'Пожалуйста, укажите ваше имя';
    }
    if (customerPhone.replace(/\D/g, '').length < 10) {
      errs.phone = 'Введите корректный номер телефона';
    }
    if (deliveryMethod === 'delivery' && !address.trim()) {
      errs.address = 'Укажите адрес доставки';
    }
    if (!eventDate) {
      errs.date = 'Выберите дату торжества';
    }

    setFormErrors(errs);
    if (Object.keys(errs).length > 0) {
      notify('Проверьте заполнение обязательных полей', 'error');
      return;
    }

    const orderNum = `MMC-${Math.floor(1000 + Math.random() * 9000)}`;
    const payload = [
      `🎀 ЗАЯВКА MERCI MON CHÉRI · ${orderNum}`,
      `───────────────────────`,
      `• Форма и вес: ${shapeObj.name}, ${String(weight).replace('.', ',')} кг (~${guestsCount} гостей)`,
      `• Начинка: ${flavorObj.name}`,
      `• Покрытие: ${colorObj.name} · ${textureObj.name}`,
      `• Декор: ${selectedDecorObjs.length ? selectedDecorObjs.map((d) => d.name).join(', ') : 'Без дополнительного декора'}`,
      `• Надпись: ${inscription.trim() ? `«${inscription.trim()}» (${INSCRIPTION_FONTS.find((f) => f.id === fontId)?.name})` : 'Без надписи'}`,
      `───────────────────────`,
      `• Дата: ${formatDateRu(eventDate)}${isUrgent ? ' (СРОЧНЫЙ +20%)' : ''}`,
      `• Получение: ${deliveryMethod === 'delivery' ? `Доставка (${deliverySlot}), ${address.trim()}` : 'Самовывоз из ателье Merci Mon Chéri'}`,
      `• Клиент: ${customerName.trim()}, ${customerPhone.trim()}`,
      orderComment.trim() ? `• Пожелания: ${orderComment.trim()}` : null,
      `───────────────────────`,
      `Итого предварительно: ${formatPrice(pricing.total)}`
    ]
      .filter(Boolean)
      .join('\n');

    setOrderSuccess({ orderNum, payload });
  };

  const handleCopyOrder = async () => {
    if (!orderSuccess) return;
    try {
      await navigator.clipboard.writeText(orderSuccess.payload);
      notify('Заявка скопирована — можно отправить в Telegram');
    } catch {
      notify('Выделите и скопируйте текст заявки вручную');
    }
  };

  // Компактная строка-резюме под подиумом торта
  const compactSummary = `${shapeObj.name} · ${String(weight).replace('.', ',')} кг · ${colorObj.name} · ${textureObj.name}`;

  // ==========================================================================
  // РЕНДЕР 7 ПОСЛЕДОВАТЕЛЬНЫХ МИКРО-ШАГОВ
  // ==========================================================================

  const renderStepContent = () => {
    switch (step) {
      // ШАГ 01 · ФОРМА ТОРТА
      case 1:
        return (
          <div className="space-y-4">
            <p className="text-sm text-[#7B6C64] leading-relaxed">
              Начнём с силуэта. Выберите форму, которая лучше всего подчеркнёт настроение вашего торжества.
            </p>

            <div className="space-y-3 pt-1">
              {SHAPES.map((item) => {
                const active = shape === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectShape(item.id)}
                    className={`w-full group flex items-center gap-4 p-4 sm:p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                      active
                        ? 'border-[#B86B77] bg-[#FDF8F9] shadow-[0_8px_24px_-12px_rgba(184,107,119,0.28)]'
                        : 'border-[#EAE0D5] bg-white hover:border-[#D4C3B4]'
                    }`}
                  >
                    {/* Тонкий силуэт */}
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${
                        active ? 'bg-[#F7E9EC]' : 'bg-[#F8F3EC] group-hover:bg-[#F3EBE1]'
                      }`}
                    >
                      {item.id === 'round' && (
                        <svg viewBox="0 0 44 44" className="w-9 h-9">
                          <circle
                            cx="22"
                            cy="22"
                            r="15"
                            fill={active ? '#EAD0D5' : '#EFE6DC'}
                            stroke={active ? '#B86B77' : '#A9998C'}
                            strokeWidth="1.4"
                          />
                        </svg>
                      )}
                      {item.id === 'heart' && (
                        <svg viewBox="0 0 44 44" className="w-9 h-9">
                          <path
                            d="M22 36 C12 29, 7 21.5, 7 15 C7 10, 11 7, 15.5 7.5 C18.8 7.9, 20.8 10, 22 12.2 C23.2 10, 25.2 7.9, 28.5 7.5 C33 7, 37 10, 37 15 C37 21.5, 32 29, 22 36 Z"
                            fill={active ? '#EAD0D5' : '#EFE6DC'}
                            stroke={active ? '#B86B77' : '#A9998C'}
                            strokeWidth="1.4"
                          />
                        </svg>
                      )}
                      {item.id === 'oval' && (
                        <svg viewBox="0 0 48 44" className="w-10 h-9">
                          <ellipse
                            cx="24"
                            cy="22"
                            rx="18.5"
                            ry="12"
                            fill={active ? '#EAD0D5' : '#EFE6DC'}
                            stroke={active ? '#B86B77' : '#A9998C'}
                            strokeWidth="1.4"
                          />
                        </svg>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-serif text-xl font-semibold text-[#2A211E]">
                          {item.name}
                        </span>
                        <span className="text-[11px] font-medium tracking-wide text-[#B86B77]">
                          {item.sizeHint}
                        </span>
                      </div>
                      <p className="text-xs sm:text-[13px] text-[#7B6C64] mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition ${
                        active ? 'bg-[#B86B77] border-[#B86B77] text-white' : 'border-[#D9CCBF]'
                      }`}
                    >
                      {active && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {weightLimitNotice && (
              <div className="flex items-start gap-2.5 rounded-2xl bg-[#FBF5EC] border border-[#EADBC6] px-4 py-3 text-xs text-[#7F5C36]">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#C4A47C]" />
                <span>{weightLimitNotice}</span>
              </div>
            )}
          </div>
        );

      // ШАГ 02 · ГОСТИ И ВЕС
      case 2:
        return (
          <div className="space-y-6">
            <p className="text-sm text-[#7B6C64] leading-relaxed">
              Укажите число гостей — мы рассчитаем идеальный вес торта по норме 200 г на порцию.
            </p>

            {/* Карточка ползунка гостей */}
            <div className="rounded-2xl bg-[#FCF9F5] border border-[#EAE0D5] p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-white border border-[#EAE0D5] flex items-center justify-center text-[#B86B77]">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#2A211E]">Количество гостей</div>
                    <div className="text-xs text-[#7B6C64]">Оптимально для {guestsCount} гостей (200 г/порция)</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-white border border-[#EAE0D5] rounded-full p-1">
                  <button
                    type="button"
                    onClick={() => handleGuestsChange(guestsCount - 2)}
                    disabled={guestsCount <= 4}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[#2A211E] hover:bg-[#F5EDE4] disabled:opacity-35 transition cursor-pointer"
                    aria-label="Уменьшить гостей"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="min-w-[60px] text-center font-serif text-lg font-semibold text-[#2A211E]">
                    {guestsCount} чел.
                  </span>
                  <button
                    type="button"
                    onClick={() => handleGuestsChange(guestsCount + 2)}
                    disabled={guestsCount >= maxGuests}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[#2A211E] hover:bg-[#F5EDE4] disabled:opacity-35 transition cursor-pointer"
                    aria-label="Увеличить гостей"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <input
                type="range"
                min={4}
                max={maxGuests}
                step={1}
                value={guestsCount}
                onChange={(e) => handleGuestsChange(Number(e.target.value))}
                className="w-full accent-[#B86B77] h-1.5 bg-[#E7DCD0] rounded-lg cursor-pointer"
              />

              <div className="flex justify-between text-[11px] text-[#8E7F76]">
                <span>4 гостя</span>
                <span>Лимит формы «{shapeObj.name}»: до {maxGuests} гостей</span>
              </div>
            </div>

            {/* Сетка выбора веса */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#8E7F76]">
                  Точный вес торта
                </span>
                <span className="text-xs text-[#7B6C64]">{formatPrice(PRICE_PER_KG)} / кг</span>
              </div>
              <div className="grid grid-cols-3 gap-2.5">
                {WEIGHT_OPTIONS.map((w) => {
                  const locked = w > shapeObj.maxWeight;
                  const active = weight === w;
                  return (
                    <button
                      key={w}
                      type="button"
                      disabled={locked}
                      onClick={() => setWeight(w)}
                      className={`flex flex-col items-start p-3.5 rounded-2xl border text-left transition-all ${
                        locked
                          ? 'border-[#F0E8DF] bg-[#FAF6F1] text-[#BFB3A9] cursor-not-allowed opacity-65'
                          : active
                          ? 'border-[#B86B77] bg-[#FDF8F9] shadow-xs cursor-pointer'
                          : 'border-[#EAE0D5] bg-white hover:border-[#D4C3B4] cursor-pointer'
                      }`}
                    >
                      <div className="flex items-baseline justify-between w-full">
                        <span className={`font-serif text-lg font-semibold ${locked ? 'text-[#B9ACA2]' : 'text-[#2A211E]'}`}>
                          {String(w).replace('.', ',')} кг
                        </span>
                        {locked && <span className="text-[10px] text-[#B9ACA2]">макс. {shapeObj.maxWeight}</span>}
                      </div>
                      <span className={`text-xs mt-0.5 ${locked ? 'text-[#C6BAB0]' : active ? 'text-[#B86B77] font-semibold' : 'text-[#7B6C64]'}`}>
                        {formatPrice(w * PRICE_PER_KG)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );

      // ШАГ 03 · ВКУС И НАЧИНКА
      case 3:
        return (
          <div className="space-y-4">
            <p className="text-sm text-[#7B6C64] leading-relaxed">
              Мы переключили превью на <strong className="font-medium text-[#2A211E]">вид в разрезе</strong>, чтобы вы сразу увидели слои бисквита и начинки.
            </p>

            {/* Тонкие фильтры-табы */}
            <div className="flex flex-wrap gap-2">
              {FLAVOR_FILTERS.map((tag) => {
                const active = flavorFilter === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setFlavorFilter(tag)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                      active
                        ? 'bg-[#2A211E] text-white'
                        : 'bg-[#F5EDE4] text-[#6E5F57] hover:bg-[#ECE0D3]'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>

            {/* Карточки 6 авторских начинок */}
            <div className="space-y-2.5">
              {filteredFlavors.map((item) => {
                const active = flavor === item.id;
                const open = openCompositionId === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setFlavor(item.id);
                      setViewMode('slice');
                    }}
                    className={`rounded-2xl border p-4 transition-all cursor-pointer ${
                      active
                        ? 'border-[#B86B77] bg-[#FDF8F9] shadow-[0_6px_20px_-12px_rgba(184,107,119,0.28)]'
                        : 'border-[#EAE0D5] bg-white hover:border-[#D4C3B4]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        {/* Цветовая мини-полоска слоёв */}
                        <div className="w-3.5 h-11 rounded-full overflow-hidden border border-[#EAE0D5] shrink-0 mt-0.5 flex flex-col">
                          <span className="flex-1" style={{ backgroundColor: item.slice.sponge }} />
                          <span className="h-2.5" style={{ backgroundColor: item.slice.filling }} />
                          <span className="h-2" style={{ backgroundColor: item.slice.cream }} />
                          <span className="flex-1" style={{ backgroundColor: item.slice.sponge }} />
                        </div>

                        <div>
                          <div className="flex flex-wrap items-baseline gap-x-2">
                            <h3 className="font-serif text-lg font-semibold text-[#2A211E] leading-snug">
                              {item.name}
                            </h3>
                            <span className="font-serif italic text-xs text-[#A99588]">{item.french}</span>
                          </div>
                          <p className="text-xs sm:text-[13px] text-[#7B6C64] mt-1 leading-relaxed">
                            {item.profile}
                          </p>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-1 transition ${
                          active ? 'bg-[#B86B77] border-[#B86B77] text-white' : 'border-[#D9CCBF]'
                        }`}
                      >
                        {active && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-2 pl-6">
                      <div className="flex flex-wrap gap-1.5">
                        {item.tags.map((t) => (
                          <span
                            key={t}
                            className={`text-[11px] px-2 py-0.5 rounded-full ${
                              t === 'Без орехов'
                                ? 'bg-[#EFF5EE] text-[#456D49]'
                                : 'bg-[#F5EDE4] text-[#7B6C64]'
                            }`}
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenCompositionId(open ? null : item.id);
                        }}
                        className="inline-flex items-center gap-1 text-xs font-medium text-[#B86B77] hover:text-[#9F5662] cursor-pointer"
                      >
                        Состав и аллергены
                        {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {/* Аккордеон честного состава */}
                    {open && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="mt-3 pt-3 border-t border-[#EFE5DB] space-y-2 text-xs bg-white/90 rounded-xl p-3"
                      >
                        <div>
                          <span className="font-semibold text-[#2A211E]">Бисквит: </span>
                          <span className="text-[#7B6C64]">{item.sponge}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-[#2A211E]">Крем и начинка: </span>
                          <span className="text-[#7B6C64]">{item.filling}</span>
                        </div>
                        <div className="pt-1 text-[11px] text-[#8D5F3D] flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>
                            <strong>Аллергены:</strong> {item.allergens}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );

      // ШАГ 04 · ПОКРЫТИЕ И ОТТЕНОК
      case 4:
        return (
          <div className="space-y-6">
            <p className="text-sm text-[#7B6C64] leading-relaxed">
              Выберите натуральный оттенок крема и благородную фактуру покрытия.
            </p>

            {/* Палитра 8 оттенков в виде объёмных «мазков крема» */}
            <div>
              <div className="flex items-baseline justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-widest text-[#8E7F76]">
                  Оттенок крема
                </span>
                <span className="font-serif italic text-base text-[#2A211E]">{colorObj.name}</span>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {COATING_COLORS.map((c) => {
                  const active = colorId === c.id;
                  const dark = isDarkColor(c.hex);
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setColorId(c.id);
                        if (viewMode === 'slice') setViewMode('side');
                      }}
                      className={`group flex flex-col items-center gap-2 p-2.5 rounded-2xl border transition-all cursor-pointer ${
                        active
                          ? 'border-[#B86B77] bg-[#FDF8F9] shadow-xs'
                          : 'border-transparent hover:bg-[#FAF5EF]'
                      }`}
                    >
                      {/* Объёмный мазок крема */}
                      <span
                        className="relative w-11 h-11 rounded-full flex items-center justify-center transition-transform group-hover:scale-105"
                        style={{
                          background: `radial-gradient(circle at 32% 28%, ${adjustColor(c.hex, 24)}, ${c.hex} 58%, ${adjustColor(c.hex, -16)} 100%)`,
                          boxShadow: active
                            ? '0 4px 12px rgba(184,107,119,0.32), inset 0 2px 3px rgba(255,255,255,0.65)'
                            : '0 3px 8px rgba(42,33,30,0.12), inset 0 2px 3px rgba(255,255,255,0.6)'
                        }}
                      >
                        {active && (
                          <Check className={`w-4 h-4 stroke-[2.8] ${dark ? 'text-white' : 'text-[#2A211E]'}`} />
                        )}
                      </span>
                      <span className="text-[11px] text-center leading-tight text-[#5F524B] font-medium">
                        {c.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4 фактуры покрытия */}
            <div>
              <span className="block text-xs font-semibold uppercase tracking-widest text-[#8E7F76] mb-3">
                Фактура поверхности
              </span>
              <div className="space-y-2.5">
                {COATING_TEXTURES.map((item) => {
                  const active = texture === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setTexture(item.id);
                        if (viewMode === 'slice') setViewMode('side');
                      }}
                      className={`w-full flex items-start justify-between gap-3 p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        active
                          ? 'border-[#B86B77] bg-[#FDF8F9] shadow-xs'
                          : 'border-[#EAE0D5] bg-white hover:border-[#D4C3B4]'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-sm text-[#2A211E]">{item.name}</div>
                        <p className="text-xs text-[#7B6C64] mt-1 leading-relaxed">{item.desc}</p>
                      </div>
                      <span
                        className={`text-xs font-semibold shrink-0 mt-0.5 ${
                          item.price === 0 ? 'text-[#527A56]' : 'text-[#B86B77]'
                        }`}
                      >
                        {item.price === 0 ? 'Включено' : `+${formatPrice(item.price)}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );

      // ШАГ 05 · ДЕКОР (3 СПОКОЙНЫЕ ВКЛАДКИ)
      case 5: {
        const currentTab = DECOR_TABS.find((t) => t.id === activeDecorTab) || DECOR_TABS[0];
        return (
          <div className="space-y-5">
            <p className="text-sm text-[#7B6C64] leading-relaxed">
              Добавьте финальные штрихи. Можно сочетать элементы из разных категорий — всё мгновенно появится на торте.
            </p>

            {/* 3 вкладки декора */}
            <div className="flex p-1 rounded-2xl bg-[#F5EDE4] border border-[#EAE0D5]">
              {DECOR_TABS.map((tab) => {
                const active = activeDecorTab === tab.id;
                const countInTab = tab.items.filter((i) => decor.includes(i.id)).length;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveDecorTab(tab.id)}
                    className={`flex-1 py-2 px-2 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                      active
                        ? 'bg-white text-[#2A211E] shadow-xs'
                        : 'text-[#7B6C64] hover:text-[#2A211E]'
                    }`}
                  >
                    <span className="truncate">{tab.label}</span>
                    {countInTab > 0 && (
                      <span className="w-4 h-4 rounded-full bg-[#B86B77] text-white text-[10px] flex items-center justify-center shrink-0">
                        {countInTab}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Элементы активной вкладки */}
            <div className="space-y-2.5">
              {currentTab.items.map((item) => {
                const active = decor.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleDecorItem(item.id)}
                    className={`w-full flex items-center justify-between gap-4 p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      active
                        ? 'border-[#B86B77] bg-[#FDF8F9] shadow-xs'
                        : 'border-[#EAE0D5] bg-white hover:border-[#D4C3B4]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-[#2A211E]">{item.name}</span>
                        <span className="text-xs font-semibold text-[#B86B77]">
                          +{formatPrice(item.price)}
                        </span>
                      </div>
                      <p className="text-xs text-[#7B6C64] mt-1 leading-relaxed">{item.desc}</p>
                    </div>

                    <span
                      className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition ${
                        active ? 'bg-[#B86B77] border-[#B86B77] text-white' : 'border-[#D9CCBF] bg-white'
                      }`}
                    >
                      {active ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : <Plus className="w-3.5 h-3.5 text-[#A49489]" />}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Выбранный декор сводкой */}
            {selectedDecorObjs.length > 0 && (
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <span className="text-xs text-[#8E7F76]">Выбрано:</span>
                {selectedDecorObjs.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => toggleDecorItem(d.id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F7ECEE] text-[#9F5662] text-xs font-medium hover:bg-[#EFE0E3] transition cursor-pointer"
                  >
                    {d.name}
                    <X className="w-3 h-3" />
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      }

      // ШАГ 06 · НАДПИСЬ НА ТОРТЕ
      case 6:
        return (
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm text-[#7B6C64] leading-relaxed">
                Мы открыли <strong className="font-medium text-[#2A211E]">вид сверху</strong>, чтобы вы сразу видели живую каллиграфию кремом.
              </p>
            </div>

            {/* Поле ввода надписи */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-[#8E7F76]">
                  Текст на торте (+{formatPrice(INSCRIPTION_PRICE)})
                </label>
                <span className="text-xs text-[#8E7F76]">{inscription.length} / 36</span>
              </div>
              <input
                type="text"
                maxLength={36}
                value={inscription}
                onChange={(e) => {
                  setInscription(e.target.value);
                  setViewMode('top');
                }}
                placeholder="Напишите нежное поздравление..."
                className="w-full rounded-2xl border border-[#E4D8CC] bg-white px-4 py-3 text-sm text-[#2A211E] placeholder:text-[#AFA096] focus:outline-none focus:border-[#B86B77] focus:ring-2 focus:ring-[#B86B77]/15"
              />

              {/* Чипсы вдохновения */}
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {INSCRIPTION_CHIPS.map((phrase) => (
                  <button
                    key={phrase}
                    type="button"
                    onClick={() => {
                      setInscription(phrase);
                      setViewMode('top');
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs border transition cursor-pointer ${
                      inscription === phrase
                        ? 'border-[#B86B77] bg-[#FDF8F9] text-[#B86B77] font-medium'
                        : 'border-[#EAE0D5] bg-[#FCF9F5] text-[#6E5F57] hover:border-[#D4C3B4]'
                    }`}
                  >
                    {phrase}
                  </button>
                ))}
              </div>
            </div>

            {/* Почерк */}
            <div>
              <span className="block text-xs font-semibold uppercase tracking-widest text-[#8E7F76] mb-2.5">
                Почерк кондитера
              </span>
              <div className="grid grid-cols-2 gap-3">
                {INSCRIPTION_FONTS.map((f) => {
                  const active = fontId === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => {
                        setFontId(f.id);
                        setViewMode('top');
                      }}
                      className={`p-3.5 rounded-2xl border text-center transition cursor-pointer ${
                        active
                          ? 'border-[#B86B77] bg-[#FDF8F9] shadow-xs'
                          : 'border-[#EAE0D5] bg-white hover:border-[#D4C3B4]'
                      }`}
                    >
                      <div
                        style={{ fontFamily: f.family }}
                        className="text-xl text-[#2A211E] leading-tight"
                      >
                        {f.sample}
                      </div>
                      <div className="text-[11px] text-[#7B6C64] mt-1">{f.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4 оттенка крема для надписи */}
            <div>
              <span className="block text-xs font-semibold uppercase tracking-widest text-[#8E7F76] mb-2.5">
                Оттенок крема для надписи
              </span>
              <div className="flex flex-wrap gap-2">
                {INSCRIPTION_COLORS.map((ic) => {
                  const active = textColor.toLowerCase() === ic.hex.toLowerCase();
                  return (
                    <button
                      key={ic.id}
                      type="button"
                      onClick={() => {
                        setTextColor(ic.hex);
                        setViewMode('top');
                      }}
                      className={`inline-flex items-center gap-2 px-3 py-2 rounded-full border text-xs font-medium transition cursor-pointer ${
                        active
                          ? 'border-[#B86B77] bg-[#FDF8F9] text-[#2A211E]'
                          : 'border-[#EAE0D5] bg-white text-[#6E5F57] hover:border-[#D4C3B4]'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-black/15"
                        style={{ backgroundColor: ic.hex }}
                      />
                      {ic.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Быстрый пропуск без надписи */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => {
                  setInscription('');
                  navigateToStep(7);
                }}
                className="text-xs font-medium text-[#7B6C64] hover:text-[#2A211E] underline underline-offset-4 cursor-pointer"
              >
                Оставить торт без надписи и перейти к оформлению →
              </button>
            </div>
          </div>
        );

      // ШАГ 07 · ОФОРМЛЕНИЕ ЗАКАЗА
      case 7:
        return (
          <div className="space-y-5">
            {/* Сводная карточка собранного торта */}
            <div className="rounded-2xl bg-[#FCF9F5] border border-[#EAE0D5] p-4 space-y-2 text-xs sm:text-[13px]">
              <div className="flex items-center justify-between pb-2 border-b border-[#EAE0D5]">
                <span className="font-serif text-base font-semibold text-[#2A211E]">Ваш торт</span>
                <button
                  type="button"
                  onClick={() => navigateToStep(1)}
                  className="text-xs text-[#B86B77] hover:underline cursor-pointer"
                >
                  Изменить
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1.5 pt-1">
                <div className="flex justify-between gap-2">
                  <span className="text-[#7B6C64]">Форма и вес:</span>
                  <span className="font-medium text-[#2A211E] text-right">
                    {shapeObj.name}, {String(weight).replace('.', ',')} кг
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-[#7B6C64]">Начинка:</span>
                  <span className="font-medium text-[#2A211E] text-right">{flavorObj.name}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-[#7B6C64]">Покрытие:</span>
                  <span className="font-medium text-[#2A211E] text-right">
                    {colorObj.name}, {textureObj.name}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-[#7B6C64]">Декор:</span>
                  <span className="font-medium text-[#2A211E] text-right">
                    {selectedDecorObjs.length ? selectedDecorObjs.map((d) => d.name).join(', ') : 'Без декора'}
                  </span>
                </div>
                <div className="sm:col-span-2 flex justify-between gap-2">
                  <span className="text-[#7B6C64]">Надпись:</span>
                  <span className="font-medium text-[#2A211E] text-right">
                    {inscription.trim() ? `«${inscription.trim()}»` : 'Без надписи'}
                  </span>
                </div>
              </div>
            </div>

            {/* Дата торжества и авто-наценка срочности */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-[#8E7F76] mb-2">
                Дата торжества
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Calendar className="w-4 h-4 text-[#8E7F76] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="date"
                    min={tomorrowIso}
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className={`w-full rounded-xl border bg-white pl-10 pr-3.5 py-2.5 text-sm text-[#2A211E] focus:outline-none focus:border-[#B86B77] ${
                      formErrors.date ? 'border-rose-400' : 'border-[#E4D8CC]'
                    }`}
                  />
                </div>
                <div className="flex gap-1.5">
                  {[
                    { label: 'Завтра (+20%)', iso: tomorrowIso },
                    { label: 'Через 3 дня', iso: defaultDateIso }
                  ].map((b) => (
                    <button
                      key={b.label}
                      type="button"
                      onClick={() => setEventDate(b.iso)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium border transition cursor-pointer ${
                        eventDate === b.iso
                          ? 'border-[#B86B77] bg-[#FDF8F9] text-[#B86B77]'
                          : 'border-[#EAE0D5] bg-white text-[#7B6C64] hover:border-[#D4C3B4]'
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              {isUrgent && (
                <div className="mt-2.5 flex items-start gap-2.5 rounded-xl bg-[#FDF5EA] border border-[#EED3AF] px-3.5 py-2.5 text-xs text-[#8A5621]">
                  <Clock className="w-4 h-4 shrink-0 mt-0.5 text-[#C78538]" />
                  <span>
                    <strong>Срочный заказ на завтра: +20%</strong> (+{formatPrice(pricing.urgencyFee)}). Чтобы избежать наценки, выберите дату через 2–3 дня.
                  </span>
                </div>
              )}
            </div>

            {/* Способ получения */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-[#8E7F76] mb-2">
                Получение
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('delivery')}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                    deliveryMethod === 'delivery'
                      ? 'border-[#B86B77] bg-[#FDF8F9]'
                      : 'border-[#EAE0D5] bg-white hover:border-[#D4C3B4]'
                  }`}
                >
                  <Truck className="w-4 h-4 text-[#B86B77] shrink-0" />
                  <div>
                    <div className="text-sm font-semibold text-[#2A211E]">Доставка</div>
                    <div className="text-xs text-[#B86B77]">+{formatPrice(DELIVERY_PRICE)}</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryMethod('pickup')}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left transition cursor-pointer ${
                    deliveryMethod === 'pickup'
                      ? 'border-[#B86B77] bg-[#FDF8F9]'
                      : 'border-[#EAE0D5] bg-white hover:border-[#D4C3B4]'
                  }`}
                >
                  <Store className="w-4 h-4 text-[#B86B77] shrink-0" />
                  <div>
                    <div className="text-sm font-semibold text-[#2A211E]">Самовывоз</div>
                    <div className="text-xs text-[#527A56]">Из ателье · 0 ₽</div>
                  </div>
                </button>
              </div>

              {deliveryMethod === 'delivery' && (
                <div className="mt-3 space-y-2.5 rounded-2xl bg-[#FCF9F5] border border-[#EAE0D5] p-3.5">
                  <div className="grid grid-cols-3 gap-2">
                    {DELIVERY_SLOTS.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setDeliverySlot(slot)}
                        className={`py-2 rounded-xl border text-xs font-medium transition cursor-pointer ${
                          deliverySlot === slot
                            ? 'border-[#B86B77] bg-white text-[#B86B77]'
                            : 'border-[#EAE0D5] bg-white/60 text-[#7B6C64]'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (formErrors.address) setFormErrors((p) => ({ ...p, address: undefined }));
                    }}
                    placeholder="Адрес доставки (улица, дом, квартира) *"
                    className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-[#2A211E] placeholder:text-[#AFA096] focus:outline-none focus:border-[#B86B77] ${
                      formErrors.address ? 'border-rose-400' : 'border-[#E4D8CC]'
                    }`}
                  />
                  {formErrors.address && <p className="text-xs text-rose-600">{formErrors.address}</p>}
                </div>
              )}
            </div>

            {/* Контакты */}
            <div className="space-y-2.5">
              <div className="grid sm:grid-cols-2 gap-2.5">
                <div>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      if (formErrors.name) setFormErrors((p) => ({ ...p, name: undefined }));
                    }}
                    placeholder="Ваше имя *"
                    className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-[#2A211E] placeholder:text-[#AFA096] focus:outline-none focus:border-[#B86B77] ${
                      formErrors.name ? 'border-rose-400' : 'border-[#E4D8CC]'
                    }`}
                  />
                  {formErrors.name && <p className="text-xs text-rose-600 mt-1">{formErrors.name}</p>}
                </div>
                <div>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => {
                      setCustomerPhone(e.target.value);
                      if (formErrors.phone) setFormErrors((p) => ({ ...p, phone: undefined }));
                    }}
                    placeholder="+7 (999) 123-45-67 *"
                    className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-[#2A211E] placeholder:text-[#AFA096] focus:outline-none focus:border-[#B86B77] ${
                      formErrors.phone ? 'border-rose-400' : 'border-[#E4D8CC]'
                    }`}
                  />
                  {formErrors.phone && <p className="text-xs text-rose-600 mt-1">{formErrors.phone}</p>}
                </div>
              </div>
              <textarea
                rows={2}
                value={orderComment}
                onChange={(e) => setOrderComment(e.target.value)}
                placeholder="Пожелания к оформлению, аллергии или открытка к торту (необязательно)"
                className="w-full rounded-xl border border-[#E4D8CC] bg-white px-3.5 py-2.5 text-sm text-[#2A211E] placeholder:text-[#AFA096] focus:outline-none focus:border-[#B86B77]"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ==========================================================================
  // ОСНОВНАЯ КОМПОЗИЦИЯ ПРИЛОЖЕНИЯ
  // ==========================================================================

  return (
    <div
      className="min-h-screen bg-[#FCF9F5] text-[#2A211E] flex flex-col"
      style={{
        fontFamily: "'Manrope', system-ui, sans-serif",
        backgroundImage:
          'radial-gradient(circle at 22% 14%, rgba(255,255,255,0.95) 0%, rgba(252,249,245,0.4) 48%, rgba(245,237,228,0.5) 100%)'
      }}
    >
      {/* Шрифты и тонкие анимации */}
      <style>{`
        .font-serif {
          font-family: 'Cormorant Garamond', Georgia, serif;
        }
        @keyframes mmcFlame {
          0%, 100% { transform: scale(1) rotate(-1.2deg); opacity: 0.94; }
          50% { transform: scale(1.06, 0.94) rotate(1.4deg); opacity: 1; }
        }
        .mmc-flame {
          animation: mmcFlame 1.35s ease-in-out infinite;
        }
        @keyframes stepFadeSlide {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .step-animate {
          animation: stepFadeSlide 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
      `}</style>

      {/* ТОНКАЯ ЛИПКАЯ ШАПКА БЕЗ ВИЗУАЛЬНОГО ШУМА */}
      <header className="sticky top-0 z-40 h-14 sm:h-16 bg-[#FCF9F5]/90 backdrop-blur-md border-b border-[#EAE0D5]">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-3">
          {/* Логотип Merci Mon Chéri */}
          <div className="flex flex-col leading-none">
            <span className="font-serif italic font-semibold text-xl sm:text-2xl tracking-wide text-[#2A211E]">
              Merci Mon Chéri
            </span>
            <span className="text-[9px] sm:text-[10px] tracking-[0.26em] text-[#9A887D] uppercase mt-0.5">
              Patisserie · Atelier
            </span>
          </div>

          {/* Лаконичные действия справа */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <button
              type="button"
              onClick={() => setShowPresetsModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[#5F524B] hover:text-[#2A211E] hover:bg-[#F5EDE4] transition cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C4A47C]" />
              <span>Вдохновение</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSketchSent(false);
                setShowSketchModal(true);
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#E6D9CC] bg-white hover:border-[#B86B77] text-xs font-medium text-[#2A211E] transition cursor-pointer"
            >
              <PenTool className="w-3.5 h-3.5 text-[#B86B77]" />
              <span>Свой эскиз</span>
            </button>

            <button
              type="button"
              onClick={handleShareUrl}
              title="Поделиться сборкой"
              aria-label="Поделиться сборкой"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#E6D9CC] bg-white hover:border-[#B86B77] flex items-center justify-center text-[#5F524B] hover:text-[#B86B77] transition cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ================================================================== */}
      {/* МОБИЛЬНЫЙ STICKY-ПОДИУМ (< lg): ТОРТ ВСЕГДА ПРЯМО НАД ПАЛЬЦЕМ!    */}
      {/* ================================================================== */}
      <div className="lg:hidden sticky top-14 z-30 bg-[#FCF9F5]/95 backdrop-blur-md border-b border-[#EAE0D5] px-4 py-2.5 shadow-[0_8px_22px_-16px_rgba(42,33,30,0.18)]">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            {/* Переключатель 3 ракурсов */}
            <div className="inline-flex p-0.5 rounded-full bg-[#F5EDE4] border border-[#EAE0D5]">
              {[
                { id: 'side', label: 'Сбоку' },
                { id: 'top', label: 'Сверху' },
                { id: 'slice', label: 'В разрезе' }
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setViewMode(m.id)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition cursor-pointer ${
                    viewMode === m.id ? 'bg-white text-[#2A211E] shadow-xs' : 'text-[#7B6C64]'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setMobilePreviewCompact((v) => !v)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-[#EAE0D5] text-[11px] font-medium text-[#7B6C64] cursor-pointer"
            >
              {mobilePreviewCompact ? (
                <>
                  <Maximize2 className="w-3 h-3" />
                  Крупнее
                </>
              ) : (
                <>
                  <Minimize2 className="w-3 h-3" />
                  Компактно
                </>
              )}
            </button>
          </div>

          <div className="flex items-center justify-center overflow-hidden">
            <StudioCakeRenderer
              viewMode={viewMode}
              shape={shape}
              weight={weight}
              colorHex={colorObj.hex}
              texture={texture}
              decor={decor}
              inscription={inscription}
              fontId={fontId}
              textColor={textColor}
              flavorObj={flavorObj}
              compact={mobilePreviewCompact}
            />
          </div>

          <div className="text-center text-[11px] text-[#7B6C64] truncate mt-0.5">
            {compactSummary}
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* ОСНОВНОЙ SPLIT-SCREEN КОНТЕЙНЕР                                    */}
      {/* ================================================================== */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-5 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ЛЕВАЯ ПОЛОВИНА (~48% на десктопе): ЗАКРЕПЛЁННЫЙ СТУДИЙНЫЙ ПОДИУМ */}
          <aside className="hidden lg:block lg:col-span-6 lg:sticky lg:top-20">
            <div className="bg-white rounded-[32px] border border-[#EAE0D5] shadow-[0_20px_50px_-28px_rgba(42,33,30,0.14)] p-6 flex flex-col">
              {/* Верхняя подпись студии */}
              <div className="flex items-center justify-between text-xs text-[#8E7F76] mb-2">
                <span className="font-serif italic text-sm text-[#7B6C64]">Студийный эскиз</span>
                <span className="px-3 py-1 rounded-full bg-[#FCF9F5] border border-[#EAE0D5] text-[11px] font-medium text-[#6E5F57]">
                  {String(weight).replace('.', ',')} кг · ~{guestsCount} гостей
                </span>
              </div>

              {/* Подиум с фотореалистичным 2D-тортом */}
              <div className="rounded-3xl bg-gradient-to-b from-[#FCF9F5] via-[#FAF4EC] to-[#F5EDE4]/75 border border-[#F0E6DB] px-4 py-3 flex items-center justify-center min-h-[380px]">
                <StudioCakeRenderer
                  viewMode={viewMode}
                  shape={shape}
                  weight={weight}
                  colorHex={colorObj.hex}
                  texture={texture}
                  decor={decor}
                  inscription={inscription}
                  fontId={fontId}
                  textColor={textColor}
                  flavorObj={flavorObj}
                />
              </div>

              {/* Переключатель 3 ракурсов ПОД тортом */}
              <div className="mt-5 flex flex-col items-center gap-3">
                <div className="inline-flex p-1 rounded-full bg-[#F5EDE4] border border-[#EAE0D5]">
                  {[
                    { id: 'side', label: 'Сбоку' },
                    { id: 'top', label: 'Сверху' },
                    { id: 'slice', label: 'В разрезе' }
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setViewMode(mode.id)}
                      className={`px-5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                        viewMode === mode.id
                          ? 'bg-white text-[#2A211E] shadow-xs'
                          : 'text-[#7B6C64] hover:text-[#2A211E]'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>

                {/* Компактная строка-резюме */}
                <p className="text-xs text-[#7B6C64] text-center">{compactSummary}</p>
              </div>

              {/* Деликатный выход на уникальный дизайн */}
              <div className="mt-5 pt-4 border-t border-[#F0E7DD] flex items-center justify-between text-xs">
                <span className="text-[#8E7F76]">Особая задумка или многоярусный торт?</span>
                <button
                  type="button"
                  onClick={() => {
                    setSketchSent(false);
                    setShowSketchModal(true);
                  }}
                  className="font-semibold text-[#B86B77] hover:text-[#9F5662] underline underline-offset-4 cursor-pointer"
                >
                  Нужен уникальный дизайн?
                </button>
              </div>
            </div>
          </aside>

          {/* ПРАВАЯ ПОЛОВИНА (~52%): СПОКОЙНАЯ КАРТОЧКА ТОЛЬКО ТЕКУЩЕГО ШАГА */}
          <section className="lg:col-span-6 flex flex-col">
            {/* Кликабельный тонкий прогресс-бар сверху */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-serif text-lg sm:text-xl font-medium text-[#B86B77]">
                  {activeStepObj.code} <span className="text-[#C5B7AC]">/ 07</span>
                </span>
                <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar">
                  {STEPS.map((s) => {
                    const active = s.id === step;
                    const done = s.id < step;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => navigateToStep(s.id)}
                        className={`px-2 py-1 rounded-full text-[11px] font-medium transition cursor-pointer ${
                          active
                            ? 'bg-[#2A211E] text-white'
                            : done
                            ? 'text-[#B86B77] hover:bg-[#F5EDE4]'
                            : 'text-[#A29389] hover:text-[#2A211E]'
                        }`}
                      >
                        {s.short}
                      </button>
                    );
                  })}
                </div>
              </div>
              {/* Линия прогресса */}
              <div className="h-[3px] w-full bg-[#ECE2D7] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#B86B77] rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${(step / STEPS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Карточка текущего шага */}
            <div
              key={step}
              className="step-animate bg-white rounded-[28px] border border-[#EAE0D5] shadow-[0_14px_40px_-24px_rgba(42,33,30,0.12)] p-5 sm:p-7"
            >
              <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-[#2A211E] mb-3">
                {activeStepObj.title}
              </h1>

              {renderStepContent()}
            </div>

            {/* Мобильная ссылка на свой эскиз */}
            <div className="lg:hidden mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setSketchSent(false);
                  setShowSketchModal(true);
                }}
                className="text-xs font-medium text-[#B86B77] underline underline-offset-4 cursor-pointer"
              >
                Нужен уникальный дизайн по фото? Отправить эскиз кондитеру
              </button>
            </div>

            {/* ЗАКРЕПЛЁННАЯ НИЖНЯЯ ПАНЕЛЬ НАВИГАЦИИ И ЖИВОЙ ЦЕНЫ */}
            <div className="sticky bottom-3 mt-5 z-20">
              {/* Раскрывающаяся детализация расчёта */}
              {showBreakdown && (
                <div className="mb-2.5 bg-white rounded-2xl border border-[#E5D8CA] shadow-xl p-4 space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-[#F2E9E0]">
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-[#8E7F76]">
                      Детализация расчёта
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowBreakdown(false)}
                      className="text-[#8E7F76] hover:text-[#2A211E] cursor-pointer"
                      aria-label="Закрыть детализацию"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {pricing.lines.map((row, i) => (
                    <div
                      key={i}
                      className={`flex justify-between text-xs ${
                        row.urgent ? 'text-[#A66222] font-medium' : 'text-[#5F524B]'
                      }`}
                    >
                      <span>{row.label}</span>
                      <span className="font-semibold ml-4 shrink-0">{formatPrice(row.amount)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="bg-white/95 backdrop-blur-md border border-[#E4D7C9] rounded-2xl shadow-[0_14px_34px_-14px_rgba(42,33,30,0.2)] px-3.5 py-3 sm:px-5 flex items-center justify-between gap-3">
                {/* Назад */}
                <button
                  type="button"
                  onClick={() => navigateToStep(step - 1)}
                  disabled={step === 1}
                  className="inline-flex items-center gap-1 px-3 py-2.5 rounded-xl border border-[#EAE0D5] bg-[#FCF9F5] hover:bg-[#F5EDE4] disabled:opacity-35 disabled:cursor-not-allowed text-xs sm:text-sm font-medium text-[#2A211E] transition cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Назад</span>
                </button>

                {/* Живая цена с раскрытием */}
                <button
                  type="button"
                  onClick={() => setShowBreakdown((v) => !v)}
                  className="flex flex-col items-center cursor-pointer group"
                >
                  <span className="inline-flex items-center gap-1 text-[11px] text-[#8E7F76] group-hover:text-[#B86B77] transition">
                    Итого
                    {showBreakdown ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                  </span>
                  <span className="font-serif text-xl sm:text-2xl font-semibold text-[#2A211E] leading-none mt-0.5">
                    {formatPrice(pricing.total)}
                  </span>
                </button>

                {/* Далее / Оформить заказ */}
                {step < STEPS.length ? (
                  <button
                    type="button"
                    onClick={() => navigateToStep(step + 1)}
                    className="inline-flex items-center gap-1.5 px-5 sm:px-6 py-2.5 rounded-xl bg-[#B86B77] hover:bg-[#9F5662] text-white text-xs sm:text-sm font-semibold shadow-sm transition cursor-pointer"
                  >
                    <span>Далее</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmitOrder}
                    className="inline-flex items-center gap-1.5 px-5 sm:px-6 py-2.5 rounded-xl bg-[#B86B77] hover:bg-[#9F5662] text-white text-xs sm:text-sm font-semibold shadow-sm transition cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Оформить заказ</span>
                  </button>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* ================================================================== */}
      {/* МОДАЛКА «ВДОХНОВЕНИЕ» (4 ГОТОВЫХ ПРЕСЕТА)                          */}
      {/* ================================================================== */}
      {showPresetsModal && (
        <div
          className="fixed inset-0 z-50 bg-[#2A211E]/45 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowPresetsModal(false)}
        >
          <div
            className="bg-white rounded-[28px] max-w-lg w-full max-h-[88vh] overflow-y-auto p-6 border border-[#EAE0D5] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-[#2A211E]">Вдохновение ателье</h2>
                <p className="text-xs text-[#7B6C64] mt-1">
                  Выберите готовый образ — вы сможете изменить в нём любой цвет, вкус или декор.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPresetsModal(false)}
                className="w-8 h-8 rounded-full bg-[#F5EDE4] hover:bg-[#EAE0D5] flex items-center justify-center text-[#5F524B] cursor-pointer"
                aria-label="Закрыть"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              {PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl border border-[#EAE0D5] bg-[#FCF9F5] hover:border-[#B86B77] hover:bg-[#FDF8F9] text-left transition cursor-pointer"
                >
                  <span
                    className="w-11 h-11 rounded-full shrink-0 border border-black/10 shadow-inner"
                    style={{
                      background: `radial-gradient(circle at 32% 28%, ${adjustColor(preset.swatch, 20)}, ${preset.swatch} 65%, ${adjustColor(preset.swatch, -15)} 100%)`
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-serif text-lg font-semibold text-[#2A211E]">{preset.name}</div>
                    <div className="text-xs text-[#7B6C64] mt-0.5">{preset.subtitle}</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#B86B77] shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* МОДАЛКА «СВОЙ ЭСКИЗ» (РЕФЕРЕНС ДЛЯ МЕНЕДЖЕРА)                      */}
      {/* ================================================================== */}
      {showSketchModal && (
        <div
          className="fixed inset-0 z-50 bg-[#2A211E]/45 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowSketchModal(false)}
        >
          <div
            className="bg-white rounded-[28px] max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 border border-[#EAE0D5] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-[#2A211E]">Свой эскиз для кондитера</h2>
                <p className="text-xs text-[#7B6C64] mt-1">
                  Прикрепите фото-референс или опишите идею — мы уже приложили выбранные вес и вкус.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowSketchModal(false)}
                className="w-8 h-8 rounded-full bg-[#F5EDE4] hover:bg-[#EAE0D5] flex items-center justify-center text-[#5F524B] cursor-pointer"
                aria-label="Закрыть"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {sketchSent ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#EFF5EE] text-[#4A7852] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="font-serif text-2xl font-semibold text-[#2A211E]">Эскиз передан в ателье</h3>
                <p className="text-sm text-[#7B6C64] max-w-sm mx-auto">
                  Наш шеф-кондитер ознакомится с вашей идеей и свяжется с вами в течение 20 минут.
                </p>
                <button
                  type="button"
                  onClick={() => setShowSketchModal(false)}
                  className="mt-2 px-6 py-2.5 rounded-xl bg-[#2A211E] text-white text-sm font-semibold hover:bg-[#3F3430] transition cursor-pointer"
                >
                  Вернуться в конструктор
                </button>
              </div>
            ) : (
              <form onSubmit={handleSketchSubmit} className="space-y-4">
                <div className="flex flex-wrap gap-2 bg-[#FCF9F5] border border-[#EAE0D5] rounded-2xl p-3 text-xs">
                  <span className="px-2.5 py-1 rounded-full bg-white border border-[#EAE0D5] text-[#2A211E]">
                    {shapeObj.name} · {String(weight).replace('.', ',')} кг
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-white border border-[#EAE0D5] text-[#2A211E]">
                    {flavorObj.name}
                  </span>
                </div>

                {sketchForm.previewUrl ? (
                  <div className="flex items-center gap-3 rounded-2xl border border-[#EAE0D5] bg-[#FCF9F5] p-2.5">
                    <img
                      src={sketchForm.previewUrl}
                      alt="Референс"
                      className="w-16 h-16 rounded-xl object-cover border border-[#EAE0D5]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-[#2A211E] truncate">{sketchForm.fileName}</div>
                      <div className="text-[11px] text-[#527A56]">Файл прикреплён</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSketchForm((p) => ({ ...p, fileName: '', previewUrl: '' }))}
                      className="p-1.5 rounded-lg bg-white border border-[#EAE0D5] text-[#7B6C64] cursor-pointer"
                      aria-label="Удалить изображение"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-dashed border-[#D6C6B8] bg-[#FCF9F5] hover:border-[#B86B77] py-5 px-4 text-center cursor-pointer transition">
                    <Upload className="w-5 h-5 text-[#B86B77]" />
                    <span className="text-xs font-semibold text-[#2A211E]">Загрузить фото-референс</span>
                    <span className="text-[11px] text-[#8E7F76]">JPG, PNG или WEBP</span>
                    <input type="file" accept="image/*" onChange={handleSketchFile} className="sr-only" />
                  </label>
                )}

                <textarea
                  rows={3}
                  value={sketchForm.notes}
                  onChange={(e) => setSketchForm((p) => ({ ...p, notes: e.target.value }))}
                  placeholder="Расскажите о вашей задумке: количество ярусов, особый декор, цветовая гамма..."
                  className="w-full rounded-xl border border-[#E4D8CC] px-3.5 py-2.5 text-sm text-[#2A211E] focus:outline-none focus:border-[#B86B77]"
                />

                <div className="grid sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    value={sketchForm.name}
                    onChange={(e) => setSketchForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Ваше имя *"
                    className="w-full rounded-xl border border-[#E4D8CC] px-3.5 py-2.5 text-sm text-[#2A211E] focus:outline-none focus:border-[#B86B77]"
                  />
                  <input
                    type="text"
                    value={sketchForm.contact}
                    onChange={(e) => setSketchForm((p) => ({ ...p, contact: e.target.value }))}
                    placeholder="Телефон или @telegram *"
                    className="w-full rounded-xl border border-[#E4D8CC] px-3.5 py-2.5 text-sm text-[#2A211E] focus:outline-none focus:border-[#B86B77]"
                  />
                </div>

                {sketchError && <p className="text-xs text-rose-600">{sketchError}</p>}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#B86B77] hover:bg-[#9F5662] text-white text-sm font-semibold transition cursor-pointer"
                >
                  Отправить эскиз на расчёт
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* МОДАЛКА ПОДТВЕРЖДЕНИЯ ЗАКАЗА + ЗАЯВКА ДЛЯ TELEGRAM                 */}
      {/* ================================================================== */}
      {orderSuccess && (
        <div
          className="fixed inset-0 z-50 bg-[#2A211E]/45 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setOrderSuccess(null)}
        >
          <div
            className="bg-white rounded-[28px] max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 border border-[#EAE0D5] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-5">
              <div className="w-14 h-14 rounded-full bg-[#EFF5EE] text-[#4A7852] flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#2A211E]">
                Merci, {customerName}!
              </h2>
              <p className="text-sm text-[#7B6C64] mt-1">
                Заявка <strong>{orderSuccess.orderNum}</strong> сформирована. Менеджер свяжется с вами для подтверждения.
              </p>
            </div>

            <div className="rounded-2xl bg-[#FCF9F5] border border-[#EAE0D5] p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-[#8E7F76]">
                  Текст заявки для Telegram / менеджера
                </span>
                <button
                  type="button"
                  onClick={handleCopyOrder}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#B86B77] hover:text-[#9F5662] cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Скопировать заявку
                </button>
              </div>
              <pre className="text-xs text-[#3C302B] whitespace-pre-wrap font-mono leading-relaxed bg-white rounded-xl p-3.5 border border-[#EFE6DC] overflow-x-auto">
                {orderSuccess.payload}
              </pre>
            </div>

            <button
              type="button"
              onClick={() => setOrderSuccess(null)}
              className="mt-5 w-full py-3 rounded-xl bg-[#2A211E] hover:bg-[#3F3430] text-white text-sm font-semibold transition cursor-pointer"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* TOAST УВЕДОМЛЕНИЯ                                                  */}
      {/* ================================================================== */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 max-w-xs sm:max-w-sm">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-lg border text-xs sm:text-sm font-medium ${
              toast.tone === 'error'
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-[#2A211E] border-[#3C302B] text-white'
            }`}
          >
            {toast.tone === 'error' ? (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            ) : (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#E8B3BC]" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}

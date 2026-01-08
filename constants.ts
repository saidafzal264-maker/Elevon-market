
import { Product, Category } from './types';

export const CATEGORIES: Category[] = [
  { id: '1', name: 'Elektronika', icon: '📱' },
  { id: '2', name: 'Kiyimlar', icon: '👕' },
  { id: '3', name: 'Uy va bog\'', icon: '🏠' },
  { id: '4', name: 'Go\'zallik', icon: '💄' },
  { id: '5', name: 'Avto', icon: '🚗' },
  { id: '6', name: 'Sport', icon: '⚽' },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    title: 'iPhone 15 Pro Max 256GB Natural Titanium',
    description: 'Eng so\'nggi modeldagi iPhone, kuchli protsessor va mukammal kamera.',
    price: 15500000,
    discountPrice: 14900000,
    category: 'Elektronika',
    images: ['https://picsum.photos/seed/iphone/800/800'],
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    rating: 4.9,
    reviewsCount: 128,
    sellerId: 's1',
    stock: 15
  },
  {
    id: 'p2',
    title: 'Samsung 4K Smart TV 55"',
    description: 'Uy kinoteatri uchun ajoyib tanlov. Crystal UHD ekrani bilan.',
    price: 8500000,
    category: 'Elektronika',
    images: ['https://picsum.photos/seed/tv/800/800'],
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    rating: 4.7,
    reviewsCount: 45,
    sellerId: 's2',
    stock: 5
  },
  {
    id: 'p3',
    title: 'Nike Air Max 270',
    description: 'Yugurish va kundalik kiyish uchun juda qulay krossovkalar.',
    price: 1200000,
    discountPrice: 950000,
    category: 'Kiyimlar',
    images: ['https://picsum.photos/seed/nike/800/800'],
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    rating: 4.8,
    reviewsCount: 230,
    sellerId: 's1',
    stock: 40
  },
  {
    id: 'p4',
    title: 'Dyson Airwrap Styler',
    description: 'Sochlaringizni professional darajada parvarish qilish uchun.',
    price: 6500000,
    category: 'Go\'zallik',
    images: ['https://picsum.photos/seed/dyson/800/800'],
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    rating: 5.0,
    reviewsCount: 12,
    sellerId: 's3',
    stock: 8
  }
];

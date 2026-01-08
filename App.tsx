
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Home, Search, ShoppingBag, User as UserIcon, 
  ChevronRight, Bell, Heart, Play,
  Settings, LogOut, Package, Star, ShoppingCart,
  ArrowLeft, ShieldCheck, Wallet, AlertCircle
} from 'lucide-react';
import { ViewType, User, Product } from './types';
import { CATEGORIES } from './constants';
import ProductVideoFeed from './components/ProductVideoFeed';
import SellerDashboard from './components/SellerDashboard';
import AdminPanel from './components/AdminPanel';
import CartView from './components/CartView';
import { apiClient } from './services/api';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('HOME');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>({
    id: 'u1',
    name: 'Azizbek K.',
    email: 'aziz@bozor.uz',
    role: 'BUYER', 
    phone: '+998 90 123 45 67',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
    balance: 1250000
  });
  
  const [cart, setCart] = useState<{ productId: string, quantity: number }[]>(() => {
    const saved = localStorage.getItem('bozor_cart');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [history, setHistory] = useState<string[]>([]);
  const [recommendedIds, setRecommendedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  // 1. Mahsulotlarni yuklash
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const data = await apiClient.getProducts();
        setProducts(data);
      } catch (err) {
        console.error("Xatolik:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // 2. Savatni saqlash
  useEffect(() => {
    localStorage.setItem('bozor_cart', JSON.stringify(cart));
  }, [cart]);

  // 3. AI Tavsiyalari
  useEffect(() => {
    if (history.length > 0) {
      const timer = setTimeout(async () => {
        const recs = await apiClient.getAiRecommendations(history);
        setRecommendedIds(recs);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [history]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setIsSearchLoading(true);
    setCurrentView('SEARCH');
    try {
      // Haqiqiy backend qidiruv
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery })
      });
      const results = await response.json();
      setSearchResults(results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearchLoading(false);
    }
  };

  const addToCart = useCallback((productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) return prev.map(item => item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { productId, quantity: 1 }];
    });
  }, []);

  const formattedPrice = (price: number) => {
    return new Intl.NumberFormat('uz-UZ', { style: 'currency', currency: 'UZS', maximumFractionDigits: 0 }).format(price);
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center gap-4 bg-white">
        <div className="w-16 h-16 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin"></div>
        <p className="text-purple-900 font-bold animate-pulse italic text-xl tracking-tighter">BOZOR...</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case 'VIDEO_FEED':
        return <ProductVideoFeed products={products} addToCart={addToCart} />;
      case 'CART':
        return <CartView cart={cart} products={products} onCheckout={async () => { 
          // Fix: Ensure order items include the 'price' property required by the Order type.
          const orderItems = cart.map(item => {
            const product = products.find(p => p.id === item.productId);
            return {
              productId: item.productId,
              quantity: item.quantity,
              price: product ? (product.discountPrice || product.price) : 0
            };
          });
          // Fix: Calculate the correct total amount for the order.
          const totalAmount = orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
          
          await apiClient.createOrder({ userId: user?.id, items: orderItems, total: totalAmount });
          alert('Buyurtmangiz muvaffaqiyatli qabul qilindi!'); 
          setCart([]); 
          setCurrentView('HOME'); 
        }} />;
      case 'SEARCH':
        return (
          <div className="p-4 pt-24 pb-24 max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <button onClick={() => setCurrentView('HOME')} className="p-2 hover:bg-gray-100 rounded-full">
                <ArrowLeft size={20} />
              </button>
              <h2 className="text-xl font-bold">Natijalar: "{searchQuery}"</h2>
            </div>
            {isSearchLoading ? (
              <div className="flex flex-col items-center justify-center p-20 gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                <p className="text-gray-500 animate-pulse">AI qidirmoqda...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {searchResults.length > 0 ? (
                  searchResults.map(product => (
                    <ProductCard key={product.id} product={product} addToCart={addToCart} formattedPrice={formattedPrice} onClick={() => setHistory(p => [product.title, ...p])} />
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center text-gray-400">
                    <AlertCircle className="mx-auto mb-2" size={48} />
                    <p>Hech narsa topilmadi</p>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      case 'PROFILE':
        return (
          <div className="p-4 pt-24 pb-24 max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-6 flex flex-col items-center text-center">
              <img src={user?.avatar} className="w-24 h-24 rounded-full object-cover mb-4 ring-4 ring-purple-50" />
              <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-gray-500 mb-6">{user?.phone}</p>
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="bg-purple-50 p-4 rounded-2xl">
                  <p className="text-[10px] uppercase font-bold text-purple-600 mb-1">Balans</p>
                  <p className="text-lg font-black text-purple-900">{formattedPrice(user?.balance || 0)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <p className="text-[10px] uppercase font-bold text-gray-500 mb-1">Buyurtmalar</p>
                  <p className="text-lg font-black text-gray-900">12 ta</p>
                </div>
              </div>
            </div>
          </div>
        );
      default: // HOME
        return (
          <div className="p-4 pt-24 pb-24 max-w-7xl mx-auto">
             {/* Hero section */}
             <div className="w-full h-64 md:h-96 bg-gray-900 rounded-[2rem] mb-12 relative overflow-hidden group shadow-2xl shadow-purple-200/50">
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-10 flex flex-col justify-center px-12">
                   <span className="text-purple-400 font-bold text-sm mb-2 tracking-[0.2em] uppercase">Mavsumiy chegirmalar</span>
                   <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-none">Bozorda Bayram<br/><span className="text-purple-500">-50% gacha!</span></h2>
                   <button className="w-fit px-10 py-4 bg-white text-black font-black rounded-2xl hover:bg-purple-600 hover:text-white transition duration-300 transform active:scale-95">Xaridni boshlash</button>
                </div>
                <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2000" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition duration-[3000ms]" />
             </div>

             {/* Categories */}
             <section className="mb-12">
               <h3 className="text-2xl font-black mb-8">Kategoriyalar</h3>
               <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
                 {CATEGORIES.map(cat => (
                   <button key={cat.id} className="group flex flex-col items-center gap-4">
                     <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-3xl shadow-sm border border-gray-100 group-hover:bg-purple-600 group-hover:text-white group-hover:scale-110 group-hover:-rotate-6 transition duration-300">
                       {cat.icon}
                     </div>
                     <span className="text-xs font-bold text-gray-600 group-hover:text-purple-600">{cat.name}</span>
                   </button>
                 ))}
               </div>
             </section>

             {/* Products Grid */}
             <section>
               <div className="flex justify-between items-end mb-8">
                 <h3 className="text-2xl font-black">Sizga yoqishi mumkin</h3>
                 <button className="text-purple-600 font-bold text-sm">Hammasini ko'rish</button>
               </div>
               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                 {products.map(product => (
                   <ProductCard key={product.id} product={product} addToCart={addToCart} formattedPrice={formattedPrice} onClick={() => setHistory(h => [product.title, ...h])} />
                 ))}
               </div>
             </section>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView !== 'VIDEO_FEED' && (
        <header className="fixed top-0 inset-x-0 h-20 bg-white/80 backdrop-blur-2xl z-50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto h-full flex items-center px-6 gap-8">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('HOME')}>
              <div className="w-10 h-10 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-200">
                <ShoppingBag size={22} className="text-white" />
              </div>
              <span className="text-2xl font-black text-purple-950 tracking-tighter">BOZOR</span>
            </div>
            
            <form className="flex-1 relative" onSubmit={handleSearch}>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input 
                type="text" 
                placeholder="Mahsulotlarni qidiring (AI qidiruv)..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 bg-gray-100/50 rounded-2xl pl-12 pr-4 outline-none border-2 border-transparent focus:border-purple-600/10 focus:bg-white transition text-sm font-medium"
              />
            </form>

            <div className="flex items-center gap-4">
              <button className="relative p-3 text-gray-600 hover:bg-gray-100 rounded-2xl transition">
                <Bell size={24} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
              </button>
              <button onClick={() => setCurrentView('CART')} className="relative p-3 bg-purple-50 text-purple-600 rounded-2xl transition">
                <ShoppingCart size={24} />
                {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black border-2 border-white">{cart.length}</span>}
              </button>
              <button onClick={() => setCurrentView('PROFILE')} className="w-10 h-10 rounded-2xl overflow-hidden border-2 border-transparent hover:border-purple-600 transition">
                <img src={user?.avatar} className="w-full h-full object-cover" />
              </button>
            </div>
          </div>
        </header>
      )}

      <main>{renderContent()}</main>
    </div>
  );
};

const ProductCard: React.FC<{ 
  product: Product, 
  addToCart: (id: string) => void, 
  formattedPrice: (p: number) => string,
  onClick?: () => void
}> = ({ product, addToCart, formattedPrice, onClick }) => (
  <div onClick={onClick} className="bg-white rounded-[2rem] overflow-hidden border border-gray-100 hover:shadow-2xl hover:shadow-purple-200/50 transition-all duration-500 group flex flex-col h-full cursor-pointer">
    <div className="relative aspect-square overflow-hidden bg-gray-50">
      <img src={product.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
      <button className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur rounded-2xl text-gray-400 hover:text-red-500 transition shadow-sm">
        <Heart size={18} />
      </button>
    </div>
    <div className="p-6 flex-1 flex flex-col">
      <p className="text-[10px] font-black text-purple-600 uppercase tracking-widest mb-2">{product.category}</p>
      <h4 className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight mb-3 group-hover:text-purple-600 transition">{product.title}</h4>
      <div className="flex items-center gap-1 mb-4 text-xs font-bold text-gray-500">
        <Star size={12} className="fill-yellow-400 text-yellow-400"/> {product.rating} <span className="opacity-40 ml-1">({product.reviewsCount})</span>
      </div>
      <div className="mt-auto">
        <p className="text-xl font-black text-gray-950 mb-4">{formattedPrice(product.price)}</p>
        <button 
          onClick={(e) => { e.stopPropagation(); addToCart(product.id); }}
          className="w-full py-3.5 bg-gray-900 text-white text-xs font-black rounded-2xl hover:bg-purple-600 transition duration-300 transform active:scale-95 flex items-center justify-center gap-2"
        >
          <ShoppingCart size={16}/> Savatga
        </button>
      </div>
    </div>
  </div>
);

export default App;

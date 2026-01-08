
import React from 'react';
import { Trash2, Plus, Minus, ChevronRight, CreditCard, Truck, ShieldCheck } from 'lucide-react';
import { Product } from '../types';

interface CartViewProps {
  cart: { productId: string, quantity: number }[];
  products: Product[];
  onCheckout: () => void;
}

const CartView: React.FC<CartViewProps> = ({ cart, products, onCheckout }) => {
  const cartItems = cart.map(item => ({
    product: products.find(p => p.id === item.productId)!,
    quantity: item.quantity
  })).filter(item => item.product);

  const total = cartItems.reduce((acc, item) => {
    const price = item.product.discountPrice || item.product.price;
    return acc + (price * item.quantity);
  }, 0);

  if (cartItems.length === 0) {
    return (
      <div className="pt-32 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <Truck size={48} className="text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Savat bo'sh</h2>
        <p className="text-gray-500 mb-8 max-w-xs">Hali hech narsa qo'shmadingiz. Mahsulotlarni qidirishni boshlang!</p>
        <button className="bg-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-purple-700 transition">Do'konga qaytish</button>
      </div>
    );
  }

  return (
    <div className="p-4 pt-20 pb-32 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">Savat <span className="text-gray-400 text-lg">({cartItems.length})</span></h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map(item => (
            <div key={item.product.id} className="bg-white p-4 rounded-2xl shadow-sm flex gap-4 border border-gray-100 relative group">
              <img src={item.product.images[0]} className="w-24 h-24 rounded-xl object-cover" />
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-sm line-clamp-1">{item.product.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">Sotuvchi: {item.product.sellerId}</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-4 bg-gray-50 px-2 py-1 rounded-lg">
                    <button className="text-gray-400 hover:text-purple-600"><Minus size={16}/></button>
                    <span className="font-bold text-sm">{item.quantity}</span>
                    <button className="text-gray-400 hover:text-purple-600"><Plus size={16}/></button>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-purple-600">{(item.product.discountPrice || item.product.price).toLocaleString()} so'm</p>
                  </div>
                </div>
              </div>
              <button className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition">
                <Trash2 size={18}/>
              </button>
            </div>
          ))}
          
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center gap-3">
             <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center">
               <Truck size={20}/>
             </div>
             <div>
               <p className="text-sm font-bold text-blue-900">Bepul yetkazib berish!</p>
               <p className="text-xs text-blue-700">Sizning buyurtmangiz 1 kunda yetib boradi</p>
             </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold mb-4">Buyurtma yakuni</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Mahsulotlar ({cartItems.length})</span>
                <span>{total.toLocaleString()} so'm</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Yetkazib berish</span>
                <span className="text-green-600 font-bold">Bepul</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between font-extrabold text-lg">
                <span>Jami:</span>
                <span className="text-purple-600">{total.toLocaleString()} so'm</span>
              </div>
            </div>
            
            <button 
              onClick={onCheckout}
              className="w-full bg-purple-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-purple-700 transition shadow-lg shadow-purple-100"
            >
              To'lovga o'tish <ChevronRight size={20}/>
            </button>
            
            <div className="mt-4 flex flex-col gap-3">
               <p className="text-[10px] text-gray-400 text-center flex items-center justify-center gap-1 uppercase tracking-widest font-bold">
                 <ShieldCheck size={12}/> Xavfsiz to'lov tizimi
               </p>
               <div className="flex justify-center gap-4 opacity-50 grayscale">
                  <CreditCard size={24}/>
                  <span className="font-black italic">Payme</span>
                  <span className="font-black italic">CLICK</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartView;

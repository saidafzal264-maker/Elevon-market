
import React, { useRef, useEffect, useState } from 'react';
import { Heart, MessageCircle, Share2, ShoppingCart, User as UserIcon, Music } from 'lucide-react';
import { Product } from '../types';

interface ProductVideoFeedProps {
  products: Product[];
  addToCart: (id: string) => void;
}

const ProductVideoFeed: React.FC<ProductVideoFeedProps> = ({ products, addToCart }) => {
  const [activeVideo, setActiveVideo] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (containerRef.current) {
      const index = Math.round(containerRef.current.scrollTop / window.innerHeight);
      setActiveVideo(index);
    }
  };

  return (
    <div 
      ref={containerRef}
      onScroll={handleScroll}
      className="fixed inset-0 bg-black z-[60] overflow-y-scroll snap-y-mandatory h-screen"
    >
      {products.map((product, idx) => (
        <VideoItem 
          key={product.id} 
          product={product} 
          isActive={idx === activeVideo} 
          addToCart={addToCart} 
        />
      ))}
    </div>
  );
};

const VideoItem: React.FC<{ product: Product, isActive: boolean, addToCart: (id: string) => void }> = ({ product, isActive, addToCart }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isActive]);

  return (
    <div className="w-full h-screen snap-start relative flex items-center justify-center">
      {/* Video element */}
      <video 
        ref={videoRef}
        src={product.videoUrl}
        loop
        playsInline
        muted={false}
        className="h-full w-full object-cover"
      />

      {/* Overlay UI */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 pointer-events-none"></div>

      {/* Right Sidebar Actions */}
      <div className="absolute right-4 bottom-32 flex flex-col items-center gap-6 z-10">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden bg-gray-800">
            <img src={`https://picsum.photos/seed/${product.sellerId}/100/100`} className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-red-500 rounded-full p-1 text-white">
            <PlusCircle size={12}/>
          </div>
        </div>

        <button onClick={() => setIsLiked(!isLiked)} className="flex flex-col items-center gap-1">
          <Heart size={36} className={`${isLiked ? 'fill-red-500 text-red-500' : 'text-white'} transition`} />
          <span className="text-white text-xs font-bold">{product.reviewsCount + (isLiked ? 1 : 0)}</span>
        </button>

        <button className="flex flex-col items-center gap-1">
          <MessageCircle size={36} className="text-white" />
          <span className="text-white text-xs font-bold">{Math.round(product.reviewsCount / 2)}</span>
        </button>

        <button className="flex flex-col items-center gap-1">
          <Share2 size={36} className="text-white" />
          <span className="text-white text-xs font-bold">Ulashish</span>
        </button>

        <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center animate-spin-slow ring-8 ring-white/10">
           <Music size={24} className="text-white" />
        </div>
      </div>

      {/* Bottom Product Details */}
      <div className="absolute bottom-8 left-4 right-20 z-10 text-white">
        <h3 className="font-bold text-lg mb-1">@{product.sellerId}</h3>
        <p className="text-sm opacity-90 line-clamp-2 mb-3">{product.title}. {product.description}</p>
        
        <div className="flex items-center gap-2 mb-3">
          <Music size={14} />
          {/* Replaced deprecated marquee with a div to fix JSX IntrinsicElements error */}
          <div className="text-xs font-medium w-48 overflow-hidden whitespace-nowrap">
            Asl musiqa - {product.title}
          </div>
        </div>

        {/* Floating Cart Button */}
        <button 
          onClick={() => addToCart(product.id)}
          className="flex items-center gap-3 bg-purple-600 hover:bg-purple-700 transition px-6 py-3 rounded-2xl w-full shadow-lg pointer-events-auto"
        >
          <ShoppingCart size={20} />
          <div className="flex-1 text-left">
            <p className="text-[10px] uppercase font-bold opacity-80">Sotib olish</p>
            <p className="font-bold">{new Intl.NumberFormat('uz-UZ').format(product.price)} so'm</p>
          </div>
        </button>
      </div>

      {/* Exit Button */}
      <button 
        className="absolute top-10 left-4 z-[70] p-2 bg-black/20 backdrop-blur rounded-full text-white"
        onClick={() => window.location.reload()}
      >
        <X size={24}/>
      </button>
    </div>
  );
};

const PlusCircle = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
);

const X = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);

export default ProductVideoFeed;

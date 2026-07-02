import React, { useState } from 'react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { Heart, Plus, Eye } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toggleWishlist, wishlist, addToCart, setSelectedProduct } = useApp();
  const [isHovered, setIsHovered] = useState(false);

  const isFavorited = wishlist.includes(product.id);

  // Default sizes based on category
  const defaultSize = product.category === 'Rings' ? '7' : product.category === 'Bracelets' ? 'Medium' : 'Standard';

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1, defaultSize);
  };

  return (
    <div 
      id={`product-card-${product.id}`}
      className="group relative flex flex-col bg-[#0B0B0B] border border-white/5 hover:border-gold-400/20 p-3 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.6)] cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setSelectedProduct(product)}
    >
      {/* Product Image Stage */}
      <div className="relative aspect-[3/4] bg-[#151515] overflow-hidden mb-4 border border-white/5">
        <motion.img
          id={`product-img-${product.id}`}
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center filter brightness-90 contrast-105 transition-transform duration-1000 ease-out"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          referrerPolicy="no-referrer"
        />

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-[#080808]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 z-10">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={isHovered ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex gap-2 px-2 w-full max-w-[260px]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              id={`quick-add-btn-${product.id}`}
              onClick={handleQuickAdd}
              className="flex-1 bg-[#F5F5F0] hover:bg-gold-400 hover:text-[#080808] text-[#080808] text-[10px] tracking-widest font-bold py-3 transition-all duration-300 shadow-lg"
            >
              QUICK ADD
            </button>
            <button
              id={`quick-view-btn-${product.id}`}
              onClick={() => setSelectedProduct(product)}
              className="bg-[#111111] hover:bg-gold-400 text-[#F5F5F0] hover:text-[#080808] p-3 transition-all duration-300 border border-white/10 shadow-lg flex items-center justify-center"
              aria-label="View Details"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        </div>

        {/* Wishlist Button */}
        <button
          id={`wishlist-toggle-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-4 right-4 p-2 bg-[#111111]/85 backdrop-blur-md border border-white/10 text-[#F5F5F0] hover:text-gold-400 transition-all duration-300 shadow-md z-10"
          aria-label="Add to Curated Favorites"
        >
          <Heart 
            className={`w-4 h-4 transition-transform duration-300 hover:scale-110 ${
              isFavorited ? 'fill-gold-400 text-gold-400' : ''
            }`} 
          />
        </button>

        {/* Out of Stock Ribbon */}
        {!product.inStock && (
          <div className="absolute top-4 left-4 bg-[#222222] border border-white/10 text-[#F5F5F0] text-[9px] tracking-widest font-semibold px-3 py-1 uppercase z-10">
            SOLD OUT
          </div>
        )}

        {/* Featured Tag */}
        {product.featured && product.inStock && (
          <div className="absolute top-4 left-4 bg-gold-400 text-[#080808] text-[8px] tracking-widest font-bold px-2.5 py-1 uppercase z-10">
            SIGNATURE
          </div>
        )}
      </div>

      {/* Product Details Block */}
      <div className="flex flex-col flex-grow px-1">
        {/* Category Note */}
        <span className="text-[9px] tracking-[0.25em] text-gold-400/60 uppercase font-semibold mb-1">
          {product.category}
        </span>

        {/* Name (Elegant serif / sans mix) */}
        <h3 className="font-serif text-base font-light text-[#F5F5F0]/90 group-hover:text-gold-400 transition-colors duration-300 tracking-wide mb-1.5 truncate">
          {product.name}
        </h3>

        {/* Materials Summary */}
        <p className="text-[10px] text-[#F5F5F0]/50 font-light tracking-wide mb-2">
          {product.materials.join(' • ')}
        </p>

        {/* Price Tag */}
        <span className="font-mono text-xs font-semibold text-gold-400">
          ${product.price.toLocaleString()} USD
        </span>
      </div>
    </div>
  );
};

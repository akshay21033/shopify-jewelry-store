import React from 'react';
import { useApp } from '../context/AppContext';
import { PRODUCTS } from '../data';
import { ProductCard } from './ProductCard';
import { SlidersHorizontal, Search, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ProductGrid: React.FC = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    selectedMaterial,
    setSelectedMaterial,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
    showToast
  } = useApp();

  // Reset Filters
  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedMaterial('All');
    setSortBy('featured');
    setSearchQuery('');
    showToast('All filters restored to default', 'info');
  };

  // Categories list
  const categories = ['All', 'Rings', 'Necklaces', 'Bracelets', 'Earrings'];

  // Unique Materials
  const materials = [
    'All',
    '18k Yellow Gold',
    'PT950 Platinum',
    'South Sea Pearl',
    'Blue Sapphire',
    'Round-Cut Diamonds'
  ];

  // Filtering Logic
  const filteredProducts = PRODUCTS.filter((product) => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    
    const matchesMaterial = selectedMaterial === 'All' || product.materials.some(m => m.toLowerCase().includes(selectedMaterial.toLowerCase()));
    
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.materials.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesMaterial && matchesSearch;
  });

  // Sorting Logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low-high') {
      return a.price - b.price;
    }
    if (sortBy === 'price-high-low') {
      return b.price - a.price;
    }
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    }
    // Default featured sorting
    if (sortBy === 'featured') {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
    }
    return 0;
  });

  return (
    <section 
      id="collection-grid-section"
      className="max-w-7xl mx-auto px-6 md:px-12 py-24 sm:py-32"
    >
      {/* Grid Headline and Title */}
      <div className="text-center mb-16 sm:mb-20">
        <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-wide text-[#F5F5F0] mb-4">
          The Curated Collection
        </h2>
        <div className="w-12 h-[1px] bg-gold-400 mx-auto mb-6" />
        <p className="max-w-xl mx-auto text-[#F5F5F0]/60 font-light text-sm leading-relaxed tracking-wide">
          Explore our capsule of modern masterpieces, engineered with balance and cast in precious metals. Use the refined settings below to tailor your view.
        </p>
      </div>

      {/* Refined Filter controls */}
      <div className="border-t border-b border-white/10 py-6 mb-12">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          
          {/* Left: Category buttons */}
          <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                id={`filter-cat-${cat.toLowerCase()}`}
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-[10px] sm:text-xs tracking-[0.2em] font-medium px-4 py-2 uppercase transition-all duration-300 focus:outline-none whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#F5F5F0] text-[#080808] font-bold'
                    : 'text-[#F5F5F0]/60 hover:text-gold-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Right: Specific filters, materials, sorting */}
          <div className="flex flex-wrap items-center gap-4 text-[11px] tracking-widest font-medium text-[#F5F5F0]/80">
            {/* Material selector */}
            <div className="flex items-center space-x-2">
              <span className="text-[#F5F5F0]/40 uppercase text-[9px] tracking-[0.2em]">Material:</span>
              <select
                id="filter-material-select"
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
                className="bg-[#080808] border-b border-white/10 focus:border-gold-400 py-1 pr-6 pl-2 text-[11px] font-medium text-[#F5F5F0] tracking-wide focus:outline-none cursor-pointer rounded-none"
              >
                {materials.map((mat) => (
                  <option key={mat} value={mat} className="bg-[#080808] text-[#F5F5F0]">
                    {mat === 'All' ? 'All Precious Materials' : mat}
                  </option>
                ))}
              </select>
            </div>

            {/* Sorting selector */}
            <div className="flex items-center space-x-2">
              <span className="text-[#F5F5F0]/40 uppercase text-[9px] tracking-[0.2em]">Sort:</span>
              <select
                id="filter-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#080808] border-b border-white/10 focus:border-gold-400 py-1 pr-6 pl-2 text-[11px] font-medium text-[#F5F5F0] tracking-wide focus:outline-none cursor-pointer rounded-none"
              >
                <option value="featured" className="bg-[#080808] text-[#F5F5F0]">Featured Masterpieces</option>
                <option value="price-low-high" className="bg-[#080808] text-[#F5F5F0]">Price: Low to High</option>
                <option value="price-high-low" className="bg-[#080808] text-[#F5F5F0]">Price: High to Low</option>
                <option value="rating" className="bg-[#080808] text-[#F5F5F0]">Customer Rating</option>
              </select>
            </div>

            {/* Active search query display indicator */}
            {searchQuery && (
              <button
                id="clear-search-query-btn"
                onClick={() => setSearchQuery('')}
                className="flex items-center space-x-1.5 text-gold-400 hover:text-gold-300 transition-colors bg-gold-400/10 border border-gold-400/30 px-2.5 py-1"
              >
                <span>{searchQuery}</span>
                <span className="font-bold">x</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid Output */}
      <AnimatePresence mode="popLayout">
        {sortedProducts.length === 0 ? (
          <motion.div
            id="empty-grid-fallback"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center py-24 px-6 border border-dashed border-white/10"
          >
            <RotateCcw className="w-8 h-8 text-[#F5F5F0]/40 mx-auto mb-4 animate-spin-slow" />
            <p className="font-serif text-lg text-[#F5F5F0] mb-2 font-light">No jewels match your criteria</p>
            <p className="text-[#F5F5F0]/60 font-light text-xs max-w-sm mx-auto mb-6">
              Our artisan workshop can custom build any design. Try broadening your criteria or reset filters to explore our core capsule.
            </p>
            <button
              id="empty-grid-reset-btn"
              onClick={resetFilters}
              className="bg-[#F5F5F0] hover:bg-gold-400 text-[#080808] text-[10px] tracking-[0.2em] font-bold px-6 py-3 transition-colors focus:outline-none"
            >
              RESET REFINE SETTINGS
            </button>
          </motion.div>
        ) : (
          <motion.div 
            id="product-grid-layout"
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16"
          >
            {sortedProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

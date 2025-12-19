import React, { useState, useEffect } from 'react';
import { Candy, MapPin, IndianRupee, ShoppingCart, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import { ArchiveX } from 'lucide-react';

export default function Home() {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryType, setCategoryType] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [citySweets, setCitySweets] = useState('');
  const { addToCart, cartItems } = useCart();

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    fetch(`${API_URL}/api/sweets`)
      .then(res => res.json())
      .then(data => {
        setSweets(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching sweets:', error);
        setLoading(false);
      });
  }, []);

  const filteredSweets = sweets.filter(sweet => {
    const matchesSearch = sweet.sweet_name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryType ? sweet.category === categoryType : true;
    const matchesCity = citySweets ? sweet.location === citySweets : true;
    const matchesPrice = priceRange
      ? priceRange === 'Budget'
        ? sweet.price < 300
        : priceRange === 'Medium'
          ? sweet.price >= 300 && sweet.price <= 700
          : sweet.price > 700
      : true;
    return matchesSearch && matchesCategory && matchesCity && matchesPrice;
  });

  const availableSweets = filteredSweets.filter(
    sweet => (sweet.stock_quantity || 0) > 0 && !sweet.sold
  );
  const outOfStockSweets = filteredSweets.filter(
    sweet => (sweet.stock_quantity || 0) === 0 || sweet.sold
  );

  const categories = [...new Set(sweets.map(sweet => sweet.category))];
  const cities = [...new Set(sweets.map(sweet => sweet.location))];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-10">

        {/* ===== FILTER BAR (UI UPDATED) ===== */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Search */}
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-800" />
            <input
              type="text"
              placeholder="Search by sweet name"
              className="w-full border border-gray-300 rounded-lg
                         pl-11 pr-4 py-2.5 text-base
                         focus:outline-none
                         placeholder:text-gray-700
                         shadow-md hover:shadow-lg transition-shadow duration-200
                         bg-white
                         text-gray-800"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* City */}
          <div className="w-full md:w-64">
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5
                         text-base focus:outline-none
                         shadow-md hover:shadow-lg transition-shadow duration-200
                         bg-white
                         text-gray-800 cursor-pointer"
              value={citySweets}
              onChange={e => setCitySweets(e.target.value)}
            >
              <option value="">All Cities</option>
              {cities.map((city, index) => (
                <option key={index} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div className="w-full md:w-64">
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5
                         text-base focus:outline-none
                         shadow-md hover:shadow-lg transition-shadow duration-200
                         bg-white
                         text-gray-800 cursor-pointer"
              value={categoryType}
              onChange={e => setCategoryType(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div className="w-full md:w-64">
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5
                         text-base focus:outline-none
                         shadow-md hover:shadow-lg transition-shadow duration-200
                         bg-white
                         text-gray-800 cursor-pointer"
              value={priceRange}
              onChange={e => setPriceRange(e.target.value)}
            >
              <option value="">All Price Ranges</option>
              <option value="Budget">Budget (Under ₹300)</option>
              <option value="Medium">Medium (₹300–₹700)</option>
              <option value="Premium">Premium (Above ₹700)</option>
            </select>
          </div>
        </div>

        {/* ===== AVAILABLE SWEETS ===== */}
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold mb-4 text-green-600">
            <Sparkles className="h-6 w-6 text-green-500" />
            Available Sweets
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableSweets.map((sweet, index) => (
              <motion.div
                key={index}
                className="group bg-white rounded-2xl
             shadow-md hover:shadow-lg transition-all duration-300
             border border-gray-200 overflow-hidden"
                whileHover={{ y: -3 }}
              >
                {/* Image */}
                <div className="p-4">
                  <img
                    src={
                      sweet.image ||
                      'https://images.unsplash.com/photo-1599909351323-3c1e8f05b0bf?auto=format&fit=crop&q=80&w=1000'
                    }
                    alt={sweet.sweet_name}
                    className="w-full h-48 object-cover rounded-xl
                 transition-transform duration-300
                 group-hover:scale-[1.03]"
                  />
                </div>

                {/* BENTO BODY */}
                <div className="px-4 pb-4 grid grid-cols-3 gap-3 text-sm">
                  {/* LEFT DETAILS */}
                  <div className="col-span-2 grid grid-cols-2 gap-3">
                    {/* Name */}
                    <div className="col-span-2 bg-gray-100 rounded-lg p-3">
                      <div className="text-xs text-gray-500">Name</div>
                      <div className="font-semibold text-gray-800">
                        {sweet.sweet_name}
                      </div>
                    </div>

                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="text-xs text-gray-500">Category</div>
                      <div className="font-medium">{sweet.category}</div>
                    </div>

                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="text-xs text-gray-500">Type</div>
                      <div className="font-medium">{sweet.type}</div>
                    </div>

                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="text-xs text-gray-500">Location</div>
                      <div className="font-medium">{sweet.location}</div>
                    </div>

                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="text-xs text-gray-500">Weight</div>
                      <div className="font-medium">{sweet.weight} g</div>
                    </div>
                  </div>

                  {/* RIGHT ACTION PANEL */}
                  <div className="flex flex-col justify-between">
                    {/* Price */}
                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="text-xs text-gray-500">Price</div>
                      <div className="flex items-center text-green-600 font-bold">
                        <IndianRupee className="h-4 w-4 mr-1" />
                        {sweet.price.toLocaleString()}
                      </div>
                    </div>

                    {/* Stock */}
                    <div
                      className={`rounded-lg p-3 mt-3
          ${sweet.stock_quantity > 0
                          ? 'bg-blue-50'
                          : 'bg-red-50'
                        }`}
                    >
                      <div className="text-xs text-gray-500">Stock</div>
                      <div
                        className={`font-semibold
            ${sweet.stock_quantity > 0
                            ? 'text-blue-600'
                            : 'text-red-600'
                          }`}
                      >
                        {sweet.stock_quantity > 0
                          ? `${sweet.stock_quantity} Available`
                          : 'Out of Stock'}
                      </div>
                    </div>

                    {/* Button */}
                    <button
                      disabled={sweet.stock_quantity <= 0}
                      onClick={(e) => {
                        e.stopPropagation();

                        const alreadyInCart = cartItems.find(
                          item => item.id === sweet.id
                        );

                        if (alreadyInCart) {
                          toast.error('Item already in cart');
                          return;
                        }

                        addToCart({ ...sweet, quantity: 1 });
                        toast.success('Added to cart');
                      }}
                      className={`mt-3 py-2 rounded-lg font-semibold transition
          ${sweet.stock_quantity > 0
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-gray-400 text-white cursor-not-allowed'
                        }`}
                    >
                      {sweet.stock_quantity > 0 ? 'Order Now' : 'Unavailable'}
                    </button>
                  </div>
                </div>
              </motion.div>

            ))}
          </div>
        </div>

        {/* ===== OUT OF STOCK ===== */}
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold mb-4 text-red-600">
            <ArchiveX className="h-6 w-6 text-red-500" />
            Unavailable Sweets
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {outOfStockSweets.map((sweet, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg opacity-70"
              >
                <div className="p-3">
                  <div className="overflow-hidden rounded-xl">
                    <img
                      src={
                        sweet.image ||
                        'https://images.unsplash.com/photo-1599909351323-3c1e8f05b0bf?auto=format&fit=crop&q=80&w=1000'
                      }
                      alt={sweet.sweet_name}
                      className="w-full h-52 object-cover grayscale opacity-80"
                    />

                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-xl font-bold">{sweet.sweet_name}</h3>
                  <span className="text-red-600 font-semibold">Out of Stock</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}

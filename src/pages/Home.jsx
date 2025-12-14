import React, { useState, useEffect } from 'react';
import { Candy, MapPin, IndianRupee } from 'lucide-react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Sparkles } from 'lucide-react';
import { ArchiveX } from 'lucide-react';



import SweetDetailsModal from '../components/SweetDetailsModal';

export default function Home() {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryType, setCategoryType] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [citySweets, setCitySweets] = useState('');
  const [selectedSweet, setSelectedSweet] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/sweets')
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

  const availableSweets = filteredSweets.filter(sweet => !sweet.sold);
  const soldSweets = filteredSweets.filter(sweet => sweet.sold);
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
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-800 dark:text-gray-400" />
            <input
              type="text"
              placeholder="Search by sweet name"
              className="border border-gray-300 rounded-lg pl-11 pr-4 py-2.5 
                                  text-base
                                  focus:outline-none 
                                  placeholder:text-gray-700 dark:placeholder:text-gray-300
                                  shadow-md hover:shadow-lg transition-shadow duration-200
                                  bg-white dark:bg-gray-800"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="w-full md:w-64">
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5
                   text-base
                   focus:outline-none
                   shadow-md hover:shadow-lg transition-shadow duration-200
                   bg-white dark:bg-gray-800
                   text-gray-800 dark:text-gray-200
                   cursor-pointer"
              value={citySweets}
              onChange={e => setCitySweets(e.target.value)}
            >
              <option value="">All Cities</option>
              {loading ? (
                <option value="">Loading...</option>
              ) : (
                cities.map((city, index) => (
                  <option key={index} value={city}>
                    {city}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="w-full md:w-64">
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5
                   text-base
                   focus:outline-none
                   shadow-md hover:shadow-lg transition-shadow duration-200
                   bg-white dark:bg-gray-800
                   text-gray-800 dark:text-gray-200
                   cursor-pointer"
              value={categoryType}
              onChange={e => setCategoryType(e.target.value)}
            >
              <option value="">All Categories</option>
              {loading ? (
                <option value="">Loading...</option>
              ) : (
                categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))
              )}
            </select>
          </div>


          <div className="w-full md:w-64">
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5
                   text-base
                   focus:outline-none
                   shadow-md hover:shadow-lg transition-shadow duration-200
                   bg-white dark:bg-gray-800
                   text-gray-800 dark:text-gray-200
                   cursor-pointer"
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
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold mb-4 text-green-600 dark:text-green-400">
            <Sparkles className="h-6 w-6 text-green-500" />
            Available Sweets
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableSweets.map((sweet, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
                whileHover={{ scale: 1.05 }}
              >
                {/* Image */}
                <div className="p-4">
                  <motion.img
                    src={
                      sweet.image ||
                      'https://images.unsplash.com/photo-1599909351323-3c1e8f05b0bf?auto=format&fit=crop&q=80&w=1000'
                    }
                    alt={sweet.sweet_name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>

                {/* Content */}
                <div className="p-4 pt-0">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    {sweet.sweet_name}
                  </h3>

                  {/* Showcase grid */}
                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-md p-2">
                      <Candy className="h-4 w-4 text-pink-500" />
                      <span className="text-gray-700 dark:text-gray-200">
                        {sweet.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-md p-2">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      <span className="text-gray-700 dark:text-gray-200">
                        {sweet.location}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-md p-2">
                      <span className="font-semibold text-gray-700 dark:text-gray-200">
                        {sweet.weight}g
                      </span>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-md p-2">
                      <span className="font-semibold text-gray-700 dark:text-gray-200">
                        {sweet.category}
                      </span>
                    </div>
                  </div>

                  {sweet.flavor && (
                    <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                      Flavor: <span className="font-medium">{sweet.flavor}</span>
                    </div>
                  )}

                  {/* Price + Order */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center text-green-600 dark:text-green-400 font-bold text-lg">
                      <IndianRupee className="h-5 w-5 mr-1" />
                      {sweet.price.toLocaleString()}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSweet(sweet);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition"
                    >
                      Order Now
                    </button>
                  </div>
                </div>
              </motion.div>

            ))}
          </div>
        </div>

        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold mb-4 text-red-600 dark:text-red-400">
            <ArchiveX className="h-6 w-6 text-red-500" />
            Unavailable Sweets
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {soldSweets.map((sweet, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
                whileHover={{ scale: 1.05 }}
              >
                {/* Image */}
                <div className="p-4">
                  <motion.img
                    src={
                      sweet.image ||
                      'https://images.unsplash.com/photo-1599909351323-3c1e8f05b0bf?auto=format&fit=crop&q=80&w=1000'
                    }
                    alt={sweet.sweet_name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>

                {/* Content */}
                <div className="p-4 pt-0">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    {sweet.sweet_name}
                  </h3>

                  {/* Showcase grid */}
                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-md p-2">
                      <Candy className="h-4 w-4 text-pink-500" />
                      <span className="text-gray-700 dark:text-gray-200">
                        {sweet.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-md p-2">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      <span className="text-gray-700 dark:text-gray-200">
                        {sweet.location}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-md p-2">
                      <span className="font-semibold text-gray-700 dark:text-gray-200">
                        {sweet.weight}g
                      </span>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-md p-2">
                      <span className="font-semibold text-gray-700 dark:text-gray-200">
                        {sweet.category}
                      </span>
                    </div>
                  </div>

                  {sweet.flavor && (
                    <div className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                      Flavor: <span className="font-medium">{sweet.flavor}</span>
                    </div>
                  )}

                  {/* Price + Order */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center text-green-600 dark:text-green-400 font-bold text-lg">
                      <IndianRupee className="h-5 w-5 mr-1" />
                      {sweet.price.toLocaleString()}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSweet(sweet);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition"
                    >
                      Order Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {selectedSweet && (
        <SweetDetailsModal
          sweet={selectedSweet}
          onClose={() => setSelectedSweet(null)}
        />
      )}
    </>
  );
}
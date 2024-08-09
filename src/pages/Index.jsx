import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, X } from 'lucide-react';

const babyNames = [
  'Liam', 'Emma', 'Noah', 'Olivia', 'Ethan', 'Ava', 'Mason', 'Sophia', 'William', 'Isabella',
  'James', 'Mia', 'Benjamin', 'Charlotte', 'Lucas', 'Amelia', 'Henry', 'Harper', 'Alexander', 'Evelyn'
];

const Index = () => {
  const [currentNameIndex, setCurrentNameIndex] = useState(0);
  const [direction, setDirection] = useState(null);

  const currentName = babyNames[currentNameIndex];

  const handleSwipe = (swipeDirection) => {
    setDirection(swipeDirection);
    setTimeout(() => {
      setCurrentNameIndex((prevIndex) => (prevIndex + 1) % babyNames.length);
      setDirection(null);
    }, 300);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pink-100">
      <h1 className="text-4xl font-bold mb-8 text-pink-500">Kinder</h1>
      <div className="relative w-64 h-80">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentName}
            className="absolute w-full h-full bg-white rounded-lg shadow-lg flex items-center justify-center"
            initial={{ opacity: 0, x: direction === 'right' ? -300 : direction === 'left' ? 300 : 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction === 'left' ? -300 : direction === 'right' ? 300 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-3xl font-semibold text-blue-500">{currentName}</h2>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-8 flex space-x-4">
        <button
          onClick={() => handleSwipe('left')}
          className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-full"
        >
          <X size={24} />
        </button>
        <button
          onClick={() => handleSwipe('right')}
          className="bg-green-400 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-full"
        >
          <Heart size={24} />
        </button>
      </div>
    </div>
  );
};

export default Index;

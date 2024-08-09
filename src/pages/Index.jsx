import React, { useState, useMemo, useRef } from 'react';
import TinderCard from 'react-tinder-card';
import { Heart, X } from 'lucide-react';

const babyNames = [
  'Liam', 'Emma', 'Noah', 'Olivia', 'Ethan', 'Ava', 'Mason', 'Sophia', 'William', 'Isabella',
  'James', 'Mia', 'Benjamin', 'Charlotte', 'Lucas', 'Amelia', 'Henry', 'Harper', 'Alexander', 'Evelyn'
];

const Index = () => {
  const [currentIndex, setCurrentIndex] = useState(babyNames.length - 1);
  const [lastDirection, setLastDirection] = useState();
  const currentIndexRef = useRef(currentIndex);

  const childRefs = useMemo(
    () =>
      Array(babyNames.length)
        .fill(0)
        .map(() => React.createRef()),
    []
  );

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canSwipe = currentIndex >= 0;

  const swiped = (direction, nameToDelete, index) => {
    setLastDirection(direction);
    updateCurrentIndex(index - 1);
  };

  const outOfFrame = (name, idx) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current);
    if (currentIndexRef.current >= idx) childRefs[idx].current.restoreCard();
  };

  const swipe = async (dir) => {
    if (canSwipe && currentIndex < babyNames.length) {
      await childRefs[currentIndex].current.swipe(dir);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pink-100">
      <h1 className="text-4xl font-bold mb-8 text-pink-500">Kinder</h1>
      <div className="relative w-64 h-80">
        {babyNames.map((name, index) => (
          <TinderCard
            ref={childRefs[index]}
            className="absolute"
            key={name}
            onSwipe={(dir) => swiped(dir, name, index)}
            onCardLeftScreen={() => outOfFrame(name, index)}
          >
            <div className="w-64 h-80 bg-white rounded-lg shadow-lg flex items-center justify-center">
              <h2 className="text-3xl font-semibold text-blue-500">{name}</h2>
            </div>
          </TinderCard>
        ))}
      </div>
      <div className="mt-8 flex space-x-4">
        <button
          onClick={() => swipe('left')}
          className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-full"
        >
          <X size={24} />
        </button>
        <button
          onClick={() => swipe('right')}
          className="bg-green-400 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-full"
        >
          <Heart size={24} />
        </button>
      </div>
      {lastDirection ? (
        <h2 className="mt-4 text-xl">You swiped {lastDirection}</h2>
      ) : (
        <h2 className="mt-4 text-xl">Swipe a card or press a button to get started!</h2>
      )}
    </div>
  );
};

export default Index;

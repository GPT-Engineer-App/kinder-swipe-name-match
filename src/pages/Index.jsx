import React, { useState, useCallback } from 'react';
import { useSprings, animated } from '@react-spring/web';
import { useDrag } from '@use-gesture/react';
import { Heart, X } from 'lucide-react';

const babyNames = [
  'Liam', 'Emma', 'Noah', 'Olivia', 'Ethan', 'Ava', 'Mason', 'Sophia', 'William', 'Isabella',
  'James', 'Mia', 'Benjamin', 'Charlotte', 'Lucas', 'Amelia', 'Henry', 'Harper', 'Alexander', 'Evelyn'
];

const to = (i) => ({
  x: 0,
  y: i * -4,
  scale: 1,
  rot: -10 + Math.random() * 20,
  delay: i * 100,
});

const from = (_i) => ({ x: 0, rot: 0, scale: 1.5, y: -1000 });

const trans = (r, s) =>
  `perspective(1500px) rotateX(30deg) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`;

const Index = () => {
  const [gone] = useState(() => new Set());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [props, api] = useSprings(babyNames.length, i => ({
    ...to(i),
    from: from(i),
  }));

  const swipe = useCallback((dir) => {
    if (currentIndex < babyNames.length) {
      gone.add(currentIndex);
      api.start(i => {
        if (currentIndex !== i) return;
        const x = (200 + window.innerWidth) * dir;
        const rot = 100 * dir;
        return {
          x,
          rot,
          scale: 1,
          delay: undefined,
          config: { friction: 50, tension: 200 },
        };
      });
      setCurrentIndex(state => state + 1);
    }
  }, [api, gone, currentIndex]);

  const bind = useDrag(({ args: [index], down, movement: [mx], direction: [xDir], velocity }) => {
    const trigger = velocity > 0.2;
    const dir = xDir < 0 ? -1 : 1;
    if (!down && trigger) swipe(dir);
    api.start(i => {
      if (index !== i) return;
      const isGone = gone.has(index);
      const x = isGone ? (200 + window.innerWidth) * dir : down ? mx : 0;
      const rot = mx / 100 + (isGone ? dir * 10 * velocity : 0);
      const scale = down ? 1.1 : 1;
      return {
        x,
        rot,
        scale,
        delay: undefined,
        config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 },
      };
    });
    if (!down && gone.size === babyNames.length)
      setTimeout(() => {
        gone.clear();
        api.start(i => to(i));
        setCurrentIndex(0);
      }, 600);
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-pink-100">
      <h1 className="text-4xl font-bold mb-8 text-pink-500">Kinder</h1>
      <div className="relative w-80 h-80">
        {props.map(({ x, y, rot, scale }, i) => (
          <animated.div
            key={babyNames[i]}
            style={{
              transform: to([x, y], (x, y) => `translate3d(${x}px,${y}px,0)`),
              position: 'absolute',
              width: '100%',
              height: '100%',
              willChange: 'transform',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <animated.div
              {...bind(i)}
              style={{
                transform: to([rot, scale], trans),
                backgroundColor: 'white',
                width: '100%',
                height: '100%',
                borderRadius: '10px',
                boxShadow: '0 12.5px 100px -10px rgba(50, 50, 73, 0.4), 0 10px 10px -10px rgba(50, 50, 73, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <h2 className="text-3xl font-semibold text-blue-500">{babyNames[i]}</h2>
            </animated.div>
          </animated.div>
        ))}
      </div>
      <div className="mt-8 flex space-x-4">
        <button
          aria-label="Dislike"
          className="bg-red-400 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-full"
          onClick={() => swipe(-1)}
        >
          <X size={24} />
        </button>
        <button
          aria-label="Like"
          className="bg-green-400 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-full"
          onClick={() => swipe(1)}
        >
          <Heart size={24} />
        </button>
      </div>
    </div>
  );
};

export default Index;

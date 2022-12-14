import React, { useState } from 'react';
import Link from 'next/link';

import { Spring, animated } from 'react-spring/konva.cjs';
import { Stage, Layer, Star, Text } from 'react-konva';
import { easeElasticOut } from 'd3-ease';

import { windowSizeHook } from '../lib/window-size.hook';

const starsHook = (size: any) => {
  const [stars, setStars] = useState(
    [...Array(10)].map((_, i) => ({
      id: i,
      x: Math.random() * size.width,
      y: Math.random() * size.height,
      rotation: Math.random() * 360,
      isDragged: false,
    })),
  );

  const setDragged = (id: number, isDragged: boolean) =>
    setStars((stars) => {
      const index = stars.findIndex((s) => s.id === id);
      return [
        ...stars.slice(0, index),
        {
          ...stars[index],
          isDragged: isDragged,
        },
        ...stars.slice(index + 1),
      ];
    });

  return { stars, setDragged };
};

const FancyStar = ({
  x,
  y,
  rotation,
  id,
  isDragged,
  setDragged,
}: {
  x: number;
  y: number;
  rotation: number;
  id: number;
  isDragged: boolean;
  setDragged: (isDragged: boolean) => void;
}) => {
  const from = {
    scaleX: 1,
    scaleY: 1,
    shadowOffsetX: 5,
    shadowOffsetY: 5,
  };
  const to = {
    scaleX: 1.1,
    scaleY: 1.1,
    shadowOffsetX: 15,
    shadowOffsetY: 15,
  };
  return (
    <Spring
      native
      from={from}
      to={isDragged ? to : from}
      config={
        isDragged
          ? { duration: 0 }
          : {
              // ...config.wobbly,
              duration: 500,
              easing: easeElasticOut,
            }
      }
    >
      {(props) => (
        <animated.Star
          x={x}
          y={y}
          numPoints={5}
          innerRadius={20}
          outerRadius={40}
          fill="#89b717"
          opacity={0.8}
          draggable
          rotation={rotation}
          shadowColor="black"
          shadowBlur={10}
          shadowOpacity={0.6}
          onDragStart={() => setDragged(true)}
          onDragEnd={() => setDragged(false)}
          {...props}
        />
      )}
    </Spring>
  );
};

export default () => {
  const size = windowSizeHook();
  const { stars, setDragged } = starsHook(size);
  return (
    <Stage width={size.width} height={size.height}>
      <Layer>
        <Text text="Try to drag a star" />
        {stars.map((star: any) => (
          <FancyStar
            key={star.id}
            {...star}
            setDragged={(isDragged) => setDragged(star.id, isDragged)}
          />
        ))}
      </Layer>
    </Stage>
  );
};

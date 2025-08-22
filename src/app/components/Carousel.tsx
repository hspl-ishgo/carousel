"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import Image from "next/image";

gsap.registerPlugin(Draggable, InertiaPlugin);

export type CarouselProps<T> = {
  items: T[];
  renderItemAction?: (item: T, index: number) => React.ReactNode;
  renderItem?: (item: T, index: number) => React.ReactNode;
  className?: string;
  itemClassName?: string;
  width?: number;
  height?: number;
  gap?: number;
  initialIndex?: number;
};

export default function Carousel<T>({
  items,
  renderItemAction,
  renderItem,
  className = "",
  itemClassName = "",
  width = 800,
  height = 500,
  gap = 10,
  initialIndex = 0,
}: CarouselProps<T>) {
  const slidesRef = useRef<HTMLDivElement[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [activeIndex, setActiveIndex] = useState(
    Math.max(0, Math.min(initialIndex, items.length - 1))
  );

  const totalWidth = width + gap;
  const len = items.length;

  const defaultRenderer = (item: T, i: number) => {
    if (typeof item === "string") {
      return (
        <Image
          src={item}
          alt={`Slide ${i + 1}`}
          fill
          className="object-cover"
        />
      );
    }
    return (
      <pre className="p-6 text-sm leading-tight overflow-auto h-full w-full bg-black/30">
        {JSON.stringify(item, null, 2)}
      </pre>
    );
  };

  const render = renderItemAction ?? renderItem ?? defaultRenderer;

  const updateCarousel = (index: number, delta = 0, duration = 0.5) => {
    slidesRef.current.forEach((slide, i) => {
      if (!slide) return;
      let distance = (i - index + len) % len;
      if (distance > len / 2) distance -= len;

      const pos = distance * totalWidth + delta;

      const props = {
        x: pos,
        scale: i === index ? 0.9 : 1,
        opacity: i === index ? 1 : 0.5,
      };

      const currentX = Number(gsap.getProperty(slide, "x"));
      if (Math.abs(currentX - pos) < 1 && delta === 0) {
        gsap.set(slide, props);
      } else {
        gsap.to(slide, { ...props, duration, ease: "power2.inOut" });
      }
    });
  };

  useEffect(() => {
    if (len > 0) updateCarousel(activeIndex, 0, 0);
    slidesRef.current = slidesRef.current.slice(0, len);
  }, [len]);

  useEffect(() => {
    updateCarousel(activeIndex);
  }, [activeIndex, totalWidth]);
  useEffect(() => {
    if (!containerRef.current || len === 0) return;

    const proxy = document.createElement("div");
    let currentIndex = activeIndex;

    const draggableInstance = Draggable.create(proxy, {
      type: "x",
      trigger: containerRef.current!,
      inertia: true,
      onDrag(this: Draggable) {
        updateCarousel(currentIndex, this.x, 0);
      },
      onRelease(this: Draggable) {
        const threshold = totalWidth / 20;
        let moveSlides = 0;

        if (Math.abs(this.x) > threshold) {
          moveSlides = Math.sign(this.x) * -1;
        }

        const newIndex = (currentIndex + moveSlides + len) % len;

        currentIndex = newIndex;
        updateCarousel(newIndex, 0, 0.5);
        setActiveIndex(newIndex);

        gsap.set(proxy, { x: 0 }); // reset proxy
      },
    })[0];

    return () => {
      draggableInstance.kill();
    };
  }, [len, totalWidth, updateCarousel]);

  if (len === 0) {
    return (
      <div className={`w-full h-[200px] grid place-items-center ${className}`}>
        <p className="text-sm text-gray-400">No items to show</p>
      </div>
    );
  }

  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + len) % len);
  const handleNext = () => setActiveIndex((prev) => (prev + 1) % len);

  return (
    <div
      className={`flex flex-col gap-5 items-center w-full h-screen bg-black text-white overflow-hidden ${className}`}
    >
      <div
        ref={containerRef}
        className="relative w-full flex-1 flex items-center justify-center cursor-grab active:cursor-grabbing"
      >
        {items.map((item, i) => (
          <div
            key={i}
            ref={(el) => {
              if (el) slidesRef.current[i] = el;
            }}
            className={`absolute rounded-lg shadow-lg overflow-hidden ${itemClassName}`}
            style={{ width, height }}
          >
            <div className="relative w-full h-full">{render(item, i)}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-4 py-4">
        <button
          onClick={handlePrev}
          className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
        >
          Prev
        </button>
        <button
          onClick={handleNext}
          className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600"
        >
          Next
        </button>
      </div>
    </div>
  );
}

"use client";
import Image from "next/image";
import Carousel from "./components/Carousel";

type DataItem = {
  image: string; 
};

const dataItems: DataItem[] = [
  { image: "/images/image1.jpeg" },
  { image: "/images/image2.webp" },
  { image: "/images/image3.webp" },
  { image: "/images/image4.webp" },
  { image: "/images/image5.jpeg" },
];

export default function Home() {
  return (
    <Carousel<DataItem>
      items={dataItems}
      itemClassName="bg-black"
      renderItem={(item) => (
        <div className="relative w-full h-full">
          <Image
            src={item.image}
            alt="Carousel slide"
            fill
            className="object-cover"
            priority
          />
        </div>
      )}
    />
  );
}

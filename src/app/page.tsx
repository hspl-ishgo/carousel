"use client";

import Carousel from "./components/Carousel";

type DataItem = {
  value: number;
  suffix: string;
  name: string;
};

const dataItems: DataItem[] = [
  { value: 120, suffix: "+", name: "Stores" },
  { value: 45, suffix: "k", name: "Orders" },
  { value: 4.9, suffix: "★", name: "Rating" },
  { value: 12, suffix: "%", name: "Growth" },
  { value: 24, suffix: "h", name: "Support" },
];

export default function Home() {
  return (
    <Carousel<DataItem>
      items={dataItems}
      itemClassName="bg-white text-black"
      renderItem={(item) => (
        <div className="flex h-full flex-col items-center justify-center rounded-lg p-6">
          <div className="title-font inline-flex items-end justify-center text-6xl font-bold text-primary">
            <p>{item.value}</p>
            <span className="ml-1 text-3xl">{item.suffix}</span>
          </div>
          <h3 className="mt-2 title-font text-xl font-medium">{item.name}</h3>
        </div>
      )}
    />
  );
}

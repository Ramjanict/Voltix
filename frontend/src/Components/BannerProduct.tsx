import React, { useEffect, useState } from "react";
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";

import image1 from "../assets/banner/img1.webp";
import image2 from "../assets/banner/img2.webp";
import image3 from "../assets/banner/img3.jpg";
import image4 from "../assets/banner/img4.jpg";
import image5 from "../assets/banner/img5.webp";

import image1Mobile from "../assets/banner/img1_mobile.jpg";
import image2Mobile from "../assets/banner/img2_mobile.webp";
import image3Mobile from "../assets/banner/img3_mobile.jpg";
import image4Mobile from "../assets/banner/img4_mobile.jpg";
import image5Mobile from "../assets/banner/img5_mobile.png";

const desktopImages = [image1, image2, image3, image4, image5];
const mobileImages = [
  image1Mobile,
  image2Mobile,
  image3Mobile,
  image4Mobile,
  image5Mobile,
];

const BannerProduct: React.FC = () => {
  const [currentImage, setCurrentImage] = useState<number>(0);

  const nextImage = () => {
    setCurrentImage((prev) => (prev < desktopImages.length - 1 ? prev + 1 : 0));
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev > 0 ? prev - 1 : desktopImages.length - 1));
  };

  useEffect(() => {
    const interval = setInterval(nextImage, 5000);
    return () => clearInterval(interval);
  }, [currentImage]);

  return (
    <div className="container mx-auto px-4 my-4">
      <div className="relative h-48 sm:h-72 md:h-88 lg:h-96 w-full rounded-3xl overflow-hidden border border-slate-200/80 shadow-md bg-slate-900 group">
        {/* Navigation Arrows */}
        <div className="absolute inset-y-0 left-0 right-0 z-20 flex items-center justify-between px-3 sm:px-6 pointer-events-none">
          <button
            onClick={prevImage}
            className="w-10 h-10 rounded-full bg-white/80 hover:bg-white backdrop-blur-md text-slate-800 flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100 pointer-events-auto hover:scale-105 active:scale-95"
            aria-label="Previous Slide"
          >
            <FaAngleLeft className="text-base" />
          </button>
          <button
            onClick={nextImage}
            className="w-10 h-10 rounded-full bg-white/80 hover:bg-white backdrop-blur-md text-slate-800 flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100 pointer-events-auto hover:scale-105 active:scale-95"
            aria-label="Next Slide"
          >
            <FaAngleRight className="text-base" />
          </button>
        </div>

        {/* Desktop Carousel */}
        <div
          className="hidden md:flex w-full h-full transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentImage * 100}%)` }}
        >
          {desktopImages.map((image, index) => (
            <div key={index} className="w-full h-full flex-shrink-0 relative">
              <img
                src={image}
                alt={`Banner ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Mobile Carousel */}
        <div
          className="flex md:hidden w-full h-full transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentImage * 100}%)` }}
        >
          {mobileImages.map((image, index) => (
            <div key={index} className="w-full h-full flex-shrink-0 relative">
              <img
                src={image}
                alt={`Mobile Banner ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Indicator Dots */}
        <div className="absolute bottom-3 left-0 right-0 z-20 flex justify-center items-center gap-2">
          {desktopImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentImage === index
                  ? "w-8 bg-white"
                  : "w-2 bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BannerProduct;

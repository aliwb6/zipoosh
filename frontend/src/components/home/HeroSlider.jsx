import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      title: 'کلکسیون بهاره جدید',
      subtitle: 'تا 50 درصد تخفیف',
      description: 'جدیدترین مدل های لباس بهاره را با تخفیف ویژه تهیه کنید',
      buttonText: 'خرید کنید',
      buttonLink: '/shop',
      bgColor: 'from-blue-500 to-blue-700',
      image: '👔'
    },
    {
      id: 2,
      title: 'لباس های مردانه',
      subtitle: 'کیفیت برتر',
      description: 'بهترین برندهای لباس مردانه با قیمت مناسب',
      buttonText: 'مشاهده محصولات',
      buttonLink: '/shop/men',
      bgColor: 'from-purple-500 to-purple-700',
      image: '🤵'
    },
    {
      id: 3,
      title: 'مجموعه زنانه',
      subtitle: 'شیک و مدرن',
      description: 'آخرین مدل های لباس زنانه را از دست ندهید',
      buttonText: 'کشف کنید',
      buttonLink: '/shop/women',
      bgColor: 'from-pink-500 to-pink-700',
      image: '👗'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[500px] md:h-[600px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-700 ${
            index === currentSlide ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
          }`}
        >
          <div className={`w-full h-full bg-gradient-to-r ${slide.bgColor} flex items-center`}>
            <div className="max-w-7xl mx-auto px-4 w-full">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="text-white">
                  <p className="text-xl md:text-2xl mb-2 text-blue-100">{slide.subtitle}</p>
                  <h1 className="text-4xl md:text-6xl font-bold mb-4">{slide.title}</h1>
                  <p className="text-lg md:text-xl mb-8 text-blue-50">{slide.description}</p>
                    <a
                    href={slide.buttonLink}
                    className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-bold text-lg hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
                  >
                    {slide.buttonText}
                  </a>
                </div>
                <div className="hidden md:flex items-center justify-center">
                  <div className="text-9xl animate-bounce">{slide.image}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white bg-opacity-50 hover:bg-opacity-100 rounded-full flex items-center justify-center transition-all"
      >
        <ChevronRight size={24} className="text-gray-800" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white bg-opacity-50 hover:bg-opacity-100 rounded-full flex items-center justify-center transition-all"
      >
        <ChevronLeft size={24} className="text-gray-800" />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? 'bg-white w-8' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
import React from 'react';
import HeroSlider from '../components/home/HeroSlider';
import Categories from '../components/home/Categories';
import FeaturedProducts from '../components/home/FeaturedProducts';
import Features from '../components/home/Features';
import Newsletter from '../components/home/Newsletter';

const Home = () => {
  return (
    <div className="min-h-screen">
      <HeroSlider />
      <Categories />
      <FeaturedProducts />
      <Features />
      <Newsletter />
    </div>
  );
};

export default Home;
import React from 'react';
import { Link } from 'react-router-dom';

const Categories = () => {
  const categories = [
    {
      id: 1,
      name: 'مردانه',
      icon: '👨',
      link: '/shop/men',
      color: 'from-blue-500 to-blue-600',
      count: '250+ محصول'
    },
    {
      id: 2,
      name: 'زنانه',
      icon: '👩',
      link: '/shop/women',
      color: 'from-pink-500 to-pink-600',
      count: '180+ محصول'
    },
    {
      id: 3,
      name: 'بچگانه',
      icon: '👶',
      link: '/shop/kids',
      color: 'from-green-500 to-green-600',
      count: '120+ محصول'
    },
    {
      id: 4,
      name: 'فروش ویژه',
      icon: '🔥',
      link: '/shop/sale',
      color: 'from-red-500 to-red-600',
      count: 'تا 70% تخفیف'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">دسته بندی ها</h2>
          <p className="text-xl text-gray-600">محصولات خود را از دسته بندی های زیر انتخاب کنید</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={category.link}
              className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <div className={`bg-gradient-to-br ${category.color} p-8 aspect-square flex flex-col items-center justify-center text-white`}>
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </div>
                <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                <p className="text-sm opacity-90">{category.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
import React, { useState } from 'react';
import { Ruler, User, UserCircle } from 'lucide-react';

const SizeGuide = () => {
  const [activeTab, setActiveTab] = useState('men');

  const menSizes = [
    { size: 'S', chest: '88-92', waist: '74-78', hip: '90-94', height: '165-170' },
    { size: 'M', chest: '92-96', waist: '78-82', hip: '94-98', height: '170-175' },
    { size: 'L', chest: '96-100', waist: '82-86', hip: '98-102', height: '175-180' },
    { size: 'XL', chest: '100-104', waist: '86-90', hip: '102-106', height: '180-185' },
    { size: 'XXL', chest: '104-110', waist: '90-96', hip: '106-112', height: '185-190' }
  ];

  const womenSizes = [
    { size: 'S', chest: '82-86', waist: '62-66', hip: '88-92', height: '155-160' },
    { size: 'M', chest: '86-90', waist: '66-70', hip: '92-96', height: '160-165' },
    { size: 'L', chest: '90-94', waist: '70-74', hip: '96-100', height: '165-170' },
    { size: 'XL', chest: '94-98', waist: '74-78', hip: '100-104', height: '170-175' },
    { size: 'XXL', chest: '98-104', waist: '78-84', hip: '104-110', height: '175-180' }
  ];

  const shoeSizes = [
    { eu: '39', us: '7', uk: '6', cm: '24.5' },
    { eu: '40', us: '7.5', uk: '6.5', cm: '25' },
    { eu: '41', us: '8', uk: '7', cm: '25.5' },
    { eu: '42', us: '8.5', uk: '7.5', cm: '26' },
    { eu: '43', us: '9', uk: '8', cm: '26.5' },
    { eu: '44', us: '10', uk: '9', cm: '27' },
    { eu: '45', us: '11', uk: '10', cm: '27.5' }
  ];

  const measurementTips = [
    {
      title: 'دور سینه',
      description: 'متر را زیر بغل و دور سینه در وسیع ترین قسمت بگذارید'
    },
    {
      title: 'دور کمر',
      description: 'متر را دور باریک ترین قسمت کمر خود بپیچید'
    },
    {
      title: 'دور باسن',
      description: 'متر را دور وسیع ترین قسمت باسن قرار دهید'
    },
    {
      title: 'قد',
      description: 'از بالای سر تا کف پا را اندازه بگیرید'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Ruler size={64} className="mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-4">راهنمای سایز</h1>
          <p className="text-xl text-blue-100">
            برای انتخاب سایز مناسب از جداول زیر استفاده کنید
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            نحوه اندازه گیری
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {measurementTips.map((tip, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Ruler className="text-blue-600" size={24} />
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2">{tip.title}</h3>
                <p className="text-gray-600 text-sm">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('men')}
              className={`flex-1 px-6 py-4 font-bold text-lg transition-colors ${
                activeTab === 'men'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <User size={20} className="inline ml-2" />
              مردانه
            </button>
            <button
              onClick={() => setActiveTab('women')}
              className={`flex-1 px-6 py-4 font-bold text-lg transition-colors ${
                activeTab === 'women'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <UserCircle size={20} className="inline ml-2" />
              زنانه
            </button>
            <button
              onClick={() => setActiveTab('shoes')}
              className={`flex-1 px-6 py-4 font-bold text-lg transition-colors ${
                activeTab === 'shoes'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Ruler size={20} className="inline ml-2" />
              کفش
            </button>
          </div>

          <div className="p-8">
            {activeTab === 'men' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="px-4 py-3 text-right font-bold text-gray-900">سایز</th>
                      <th className="px-4 py-3 text-right font-bold text-gray-900">دور سینه</th>
                      <th className="px-4 py-3 text-right font-bold text-gray-900">دور کمر</th>
                      <th className="px-4 py-3 text-right font-bold text-gray-900">دور باسن</th>
                      <th className="px-4 py-3 text-right font-bold text-gray-900">قد</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menSizes.map((size, index) => (
                      <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 font-bold text-blue-600">{size.size}</td>
                        <td className="px-4 py-3 text-gray-600">{size.chest}</td>
                        <td className="px-4 py-3 text-gray-600">{size.waist}</td>
                        <td className="px-4 py-3 text-gray-600">{size.hip}</td>
                        <td className="px-4 py-3 text-gray-600">{size.height}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'women' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="px-4 py-3 text-right font-bold text-gray-900">سایز</th>
                      <th className="px-4 py-3 text-right font-bold text-gray-900">دور سینه</th>
                      <th className="px-4 py-3 text-right font-bold text-gray-900">دور کمر</th>
                      <th className="px-4 py-3 text-right font-bold text-gray-900">دور باسن</th>
                      <th className="px-4 py-3 text-right font-bold text-gray-900">قد</th>
                    </tr>
                  </thead>
                  <tbody>
                    {womenSizes.map((size, index) => (
                      <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 font-bold text-blue-600">{size.size}</td>
                        <td className="px-4 py-3 text-gray-600">{size.chest}</td>
                        <td className="px-4 py-3 text-gray-600">{size.waist}</td>
                        <td className="px-4 py-3 text-gray-600">{size.hip}</td>
                        <td className="px-4 py-3 text-gray-600">{size.height}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'shoes' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="px-4 py-3 text-right font-bold text-gray-900">اروپا</th>
                      <th className="px-4 py-3 text-right font-bold text-gray-900">آمریکا</th>
                      <th className="px-4 py-3 text-right font-bold text-gray-900">انگلیس</th>
                      <th className="px-4 py-3 text-right font-bold text-gray-900">طول پا</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shoeSizes.map((size, index) => (
                      <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="px-4 py-3 font-bold text-blue-600">{size.eu}</td>
                        <td className="px-4 py-3 text-gray-600">{size.us}</td>
                        <td className="px-4 py-3 text-gray-600">{size.uk}</td>
                        <td className="px-4 py-3 text-gray-600">{size.cm}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <h3 className="font-bold text-lg text-gray-900 mb-3">نکات مهم</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-1">●</span>
              <span>اندازه گیری را روی لباس زیر انجام دهید</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-1">●</span>
              <span>متر را محکم نگه دارید اما فشار ندهید</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-1">●</span>
              <span>اگر بین دو سایز هستید سایز بزرگتر را انتخاب کنید</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-1">●</span>
              <span>برای کفش اندازه گیری را عصر انجام دهید</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SizeGuide;
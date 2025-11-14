import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';

const SearchBar = ({ placeholder = 'جستجو...', onSearch, className = '' }) => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);

  // وقتی debounced query تغییر کرد، جستجو کن
  React.useEffect(() => {
    if (onSearch) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);

  const handleClear = () => {
    setQuery('');
  };

  return (
    <div className={`relative ${className}`}>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
        <Search size={20} />
      </div>
      
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full pr-10 pl-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
      />
      
      {query && (
        <button
          onClick={handleClear}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
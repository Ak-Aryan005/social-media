import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useAppDispatch } from '@/hooks/redux';
import { searchContent, setQuery } from '@/redux/slices/searchSlice';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchBarProps {
  onResultsChange?: (results: any[]) => void;
}

export default function SearchBar({ onResultsChange }: SearchBarProps) {
  const [localQuery, setLocalQuery] = useState('');
  const dispatch = useAppDispatch();
  const debouncedQuery = useDebounce(localQuery, 300);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalQuery(value);
  };

  const handleClear = () => {
    setLocalQuery('');
    dispatch(setQuery(''));
  };

  // Perform search when debounced value changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      dispatch(searchContent(debouncedQuery));
      dispatch(setQuery(debouncedQuery));
    }
  }, [debouncedQuery, dispatch]);

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search users or posts..."
          value={localQuery}
          onChange={handleInputChange}
          className="w-full pl-10 pr-10 py-2 bg-muted text-foreground rounded-lg border border-input focus:outline-none focus:ring-2 focus:ring-primary transition"
        />
        {localQuery && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
}

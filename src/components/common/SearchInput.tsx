import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Tìm kiếm...',
  className = '',
}) => {
  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="absolute left-3 w-4 h-4 text-strace-subtle pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-8 py-2 text-sm bg-white border border-strace-border rounded-xl focus:outline-none focus:ring-2 focus:ring-strace-primary/20 focus:border-strace-primary transition-all placeholder:text-strace-subtle text-strace-text"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2.5 p-0.5 rounded-full text-strace-subtle hover:text-strace-text hover:bg-slate-100 transition-colors"
          title="Xóa tìm kiếm"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

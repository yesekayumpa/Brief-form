import React from 'react';

interface ToggleButtonGroupProps {
  value: string;
  onChange: (value: string) => void;
  options?: string[];
  className?: string;
}

const defaultOptions = ['Oui', 'Non', 'Peut-être'];

export default function ToggleButtonGroup({ 
  value, 
  onChange, 
  options = defaultOptions, 
  className = '' 
}: ToggleButtonGroupProps) {
  return (
    <div className={`flex bg-slate-50 p-1 rounded-lg border border-slate-200/60 ${className}`}>
      {options.map((option) => (
        <label
          key={option}
          className={`
            relative flex items-center px-3 py-1.5 text-[10px] rounded-md 
            transition-all duration-300 font-medium uppercase tracking-wider 
            cursor-pointer select-none
            ${value === option 
              ? 'bg-white shadow text-brand-red' 
              : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
            }
          `}
        >
          <input
            type="radio"
            name={`toggle-group-${Math.random()}`}
            value={option}
            checked={value === option}
            onChange={(e) => onChange(e.target.value)}
            className="sr-only"
          />
          <span>{option}</span>
        </label>
      ))}
    </div>
  );
}

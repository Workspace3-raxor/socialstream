
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "relative overflow-hidden px-8 py-3 rounded-2xl font-bold tracking-tight transition-all duration-500 flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 border";
  
  const variants = {
    primary: "bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white border-white/10 shadow-[0_10px_30px_rgba(59,130,246,0.3)]",
    secondary: "bg-slate-900/80 hover:bg-slate-800 text-slate-200 border-white/5",
    danger: "bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border-red-500/20",
    ghost: "bg-transparent hover:bg-white/5 text-slate-400 border-transparent hover:text-white"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="uppercase text-[10px] tracking-[0.2em] font-black">Processing...</span>
        </div>
      ) : children}
    </button>
  );
};

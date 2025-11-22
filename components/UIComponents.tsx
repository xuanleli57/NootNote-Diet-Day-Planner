import React from 'react';

interface ClayProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const ClayCard: React.FC<ClayProps> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-3xl shadow-clay p-6 border-2 border-white ${className}`}>
    {children}
  </div>
);

export const ClayButton: React.FC<ClayProps & { variant?: 'primary' | 'secondary' | 'danger' }> = ({ 
  children, 
  className = '', 
  onClick, 
  variant = 'primary' 
}) => {
  const baseStyles = "font-bold rounded-2xl px-6 py-3 transition-all duration-200 active:scale-95 active:shadow-inner flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-pingu-black text-white shadow-lg shadow-gray-400/50 hover:bg-black",
    secondary: "bg-pingu-orange text-white shadow-lg shadow-orange-200 hover:bg-orange-500",
    danger: "bg-white text-pingu-red border-2 border-pingu-red hover:bg-red-50"
  };

  return (
    <button 
      onClick={onClick} 
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export const ClayInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input 
    {...props} 
    className={`w-full bg-pingu-bg rounded-2xl px-4 py-3 outline-none border-2 border-transparent focus:border-pingu-orange transition-colors shadow-inner ${props.className}`} 
  />
);

export const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-2 w-16 h-16 rounded-2xl transition-all duration-300 ${active ? 'bg-pingu-orange text-white shadow-lg -translate-y-2' : 'text-gray-400 hover:text-gray-600'}`}
  >
    {icon}
    <span className="text-[10px] font-bold mt-1">{label}</span>
  </button>
);
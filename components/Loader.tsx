
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 animate-soft-fade">
      <div className="relative w-16 h-16">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-rose-50 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-rose-400 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="mt-6 text-rose-400 font-medium italic serif text-lg">Preparing your surprise...</p>
    </div>
  );
};

export default Loader;

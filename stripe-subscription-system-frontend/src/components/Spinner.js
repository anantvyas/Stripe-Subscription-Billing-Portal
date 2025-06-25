import React from 'react';

function Spinner() {
  return (
    <div className="flex justify-center items-center p-8">
      <div className="w-12 h-12 border-4 border-blue-600 border-dotted rounded-full animate-spin"></div>
    </div>
  );
}

export default Spinner;
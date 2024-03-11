// components/Container.jsx

import React from 'react';

const Container = ({ children }) => {
  return (
    <div className="flex items-center justify-center">
      <div className="rounded shadow-md w-full container max-w-md">
        {children}
      </div>
    </div>
  );
};

export default Container;

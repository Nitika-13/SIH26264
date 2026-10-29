import React from 'react';

export const TricolourBar: React.FC = () => {
  return (
    <div className="h-[3px] w-full flex flex-row" role="presentation" aria-hidden="true">
      <div className="w-1/3 bg-kesari h-full" />
      <div className="w-1/3 bg-white h-full" />
      <div className="w-1/3 bg-flag-green h-full" />
    </div>
  );
};

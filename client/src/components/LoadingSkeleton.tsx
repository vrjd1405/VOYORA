import React from 'react';

export const DestinationGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="glass-card overflow-hidden">
          <div className="skeleton h-52 w-full" />
          <div className="p-4 space-y-3">
            <div className="skeleton h-4 w-28" />
            <div className="skeleton h-6 w-4/5" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-2/3" />
            <div className="pt-2 border-t border-slate-800">
              <div className="skeleton h-8 w-full rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const DestinationDetailSkeleton: React.FC = () => {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="skeleton h-96 w-full rounded-2xl" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="skeleton h-8 w-1/3" />
          <div className="skeleton h-5 w-1/4" />
          <div className="skeleton h-24 w-full" />
        </div>
        <div className="space-y-4">
          <div className="skeleton h-48 w-full rounded-xl" />
          <div className="skeleton h-48 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export const ItinerarySkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="skeleton h-12 w-64 rounded-lg" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="glass-card p-4 flex gap-4">
              <div className="skeleton w-24 h-24 rounded-lg shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="skeleton h-4 w-20" />
                <div className="skeleton h-6 w-1/2" />
                <div className="skeleton h-4 w-1/3" />
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="skeleton h-64 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
};

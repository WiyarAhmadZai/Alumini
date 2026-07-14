import React from 'react';

/**
 * Shared skeleton loading primitives.
 *
 * Concept: while a page is fetching DB-driven data, it must render a skeleton
 * placeholder that mirrors the real layout — never static/mock/empty-state
 * content. Compose these primitives so the page does not shift when the real
 * data arrives. Purely static content (headings, testimonials, CTAs, hero
 * fallbacks) is NOT wrapped in skeletons.
 *
 * All primitives use the same shimmer (`animate-pulse` + neutral gray) so every
 * page's loading state looks like one system.
 */

// Base shimmer block. Give it width/height via className.
export const Skeleton = ({ className = '', rounded = 'rounded-lg', style }) => (
  <div className={`animate-pulse bg-gray-200 ${rounded} ${className}`} style={style} />
);

// A few lines of text; the last line is shortened to look natural.
export const SkeletonText = ({ lines = 3, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className={`animate-pulse bg-gray-200 h-3 rounded ${i === lines - 1 ? 'w-4/5' : 'w-full'}`}
      />
    ))}
  </div>
);

// Circular avatar placeholder.
export const SkeletonAvatar = ({ size = 48, className = '' }) => (
  <div
    className={`animate-pulse bg-gray-200 rounded-full flex-shrink-0 ${className}`}
    style={{ width: size, height: size }}
  />
);

// Card placeholder for grids (events, jobs, mentors, directory, media).
export const SkeletonCard = ({ className = '', imageHeight = 'h-44' }) => (
  <div className={`bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm ${className}`}>
    <div className={`animate-pulse bg-gray-200 ${imageHeight}`} />
    <div className="p-5 space-y-3">
      <div className="animate-pulse bg-gray-200 h-4 rounded w-3/4" />
      <div className="animate-pulse bg-gray-100 h-3 rounded" />
      <div className="animate-pulse bg-gray-100 h-3 rounded w-4/5" />
    </div>
  </div>
);

// Horizontal list-row placeholder (dashboard lists, messages, applications).
export const SkeletonRow = ({ className = '' }) => (
  <div className={`flex items-center gap-3 py-3 ${className}`}>
    <div className="animate-pulse bg-gray-200 w-10 h-10 rounded-lg flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="animate-pulse bg-gray-200 h-3.5 rounded w-1/2" />
      <div className="animate-pulse bg-gray-100 h-3 rounded w-3/4" />
    </div>
    <div className="animate-pulse bg-gray-100 h-5 w-16 rounded-full flex-shrink-0" />
  </div>
);

// Stat-tile placeholder (dashboard/profile counters).
export const SkeletonStat = ({ className = '' }) => (
  <div className={`bg-white rounded-2xl p-4 sm:p-5 shadow-lg border border-gray-100 ${className}`}>
    <div className="animate-pulse bg-gray-200 w-11 h-11 sm:w-12 sm:h-12 rounded-xl mb-3" />
    <div className="animate-pulse bg-gray-200 h-7 w-14 rounded mb-2" />
    <div className="animate-pulse bg-gray-100 h-3 w-20 rounded" />
  </div>
);

// Convenience grid of card skeletons.
export const SkeletonGrid = ({
  count = 6,
  cols = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  gap = 'gap-6',
  imageHeight,
  className = '',
}) => (
  <div className={`grid ${cols} ${gap} ${className}`}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} imageHeight={imageHeight} />
    ))}
  </div>
);

// Convenience stack of row skeletons.
export const SkeletonRows = ({ count = 5, className = '' }) => (
  <div className={`divide-y divide-gray-100 ${className}`}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonRow key={i} />
    ))}
  </div>
);

export default Skeleton;

'use client';

import * as React from 'react';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface URLBoxProps {
  href: string;
  text?: string;
  className?: string;
  icon?: React.ReactNode; // Allow a custom icon
  size?: 'sm' | 'md' | 'lg'; // Add size prop
}

const URLBox: React.FC<URLBoxProps> = ({ href, text, className, icon, size = 'sm' }) => {
  const sizeClasses = {
    sm: 'text-sm py-1 px-2',
    md: 'text-sm py-2 px-3', // Closer to your example
    lg: 'text-base py-3 px-4',
  };

  const iconSize = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const boxClasses = cn(
    'relative font-light justify-between items-center inline-flex break-words border cursor-pointer rounded-lg border-border dark:hover:border-gray-200 hover:border-gray-500 transition-all',
    sizeClasses[size], // Apply size classes
    className
  );

  const handleClick = () => {
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  return (
    <span className="inline-flex items-center">
      <a onClick={handleClick} className={boxClasses}>
        <span className="flex-grow">{text || href}</span>
        <span className={`ml-2 ${iconSize[size]}`}>{icon || <ExternalLink className={iconSize[size]} />}</span>
      </a>
    </span>
  );
};

URLBox.displayName = 'URLBox';

export { URLBox };

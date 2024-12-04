'use client';

import * as React from 'react';
import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface URLBoxProps {
  href: string;
  text?: string;
  className?: string;
}

const URLBox: React.FC<URLBoxProps> = ({ href, text, className }) => {
    const boxClasses = cn(
      'relative font-light justify-start items-center text-sm inline-flex break-words border py-1 px-2 cursor-pointer rounded-lg border-border dark:hover:border-gray-200 hover:border-gray-500 transition-all',
      className
    );
  
    const handleClick = () => {
      window.open(href, '_blank', 'noopener,noreferrer');
    };
  
    return (
      <span className="inline-flex items-center">
        <a onClick={handleClick} className={boxClasses}>
          <span>{text || href}</span>
          <ExternalLink className="ml-2 w-4 h-4" />
        </a>
      </span>
    );
  };
  

URLBox.displayName = 'URLBox';

export { URLBox };

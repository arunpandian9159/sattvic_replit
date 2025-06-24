import React, { useState } from 'react';
import { UtensilsCrossed, ImageIcon } from 'lucide-react';

interface FoodImageProps {
  src?: string;
  alt: string;
  className?: string;
  mealType?: 'daily' | 'weekly' | 'monthly';
  fallbackIcon?: React.ReactNode;
}

export function FoodImage({ 
  src, 
  alt, 
  className = '', 
  mealType = 'daily',
  fallbackIcon 
}: FoodImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const gradientClasses = {
    daily: 'from-accent/20 via-accent/10 to-accent/5',
    weekly: 'from-secondary/20 via-secondary/10 to-secondary/5',
    monthly: 'from-primary/20 via-primary/10 to-primary/5'
  };

  const iconColors = {
    daily: 'text-accent',
    weekly: 'text-secondary',
    monthly: 'text-primary'
  };

  if (!src || imageError) {
    return (
      <div className={`bg-gradient-to-br ${gradientClasses[mealType]} relative overflow-hidden ${className}`}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-4 w-8 h-8 bg-current rounded-full"></div>
          <div className="absolute bottom-4 right-4 w-12 h-12 bg-current rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-current rounded-full"></div>
        </div>
        
        {/* Main icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          {fallbackIcon || (
            <div className={`${iconColors[mealType]} opacity-40`}>
              <UtensilsCrossed className="w-16 h-16" />
            </div>
          )}
        </div>

        {/* Decorative elements */}
        <div className="absolute top-2 right-2">
          <div className={`w-2 h-2 ${iconColors[mealType]} opacity-60 rounded-full`}></div>
        </div>
        <div className="absolute bottom-2 left-2">
          <div className={`w-3 h-3 ${iconColors[mealType]} opacity-40 rounded-full`}></div>
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {imageLoading && (
        <div className={`absolute inset-0 bg-gradient-to-br ${gradientClasses[mealType]} flex items-center justify-center`}>
          <div className="animate-pulse">
            <ImageIcon className={`w-8 h-8 ${iconColors[mealType]} opacity-40`} />
          </div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          imageLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={() => setImageLoading(false)}
        onError={() => {
          setImageError(true);
          setImageLoading(false);
        }}
      />
      {!imageLoading && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      )}
    </div>
  );
}

// Specific food placeholder components
export function SouthIndianFoodPlaceholder({ className = '', mealType = 'daily' }: { className?: string; mealType?: 'daily' | 'weekly' | 'monthly' }) {
  const foodEmojis = ['🍛', '🥘', '🍚', '🫓', '🥗'];
  const randomEmoji = foodEmojis[Math.floor(Math.random() * foodEmojis.length)];
  
  return (
    <FoodImage
      className={className}
      alt="South Indian Food"
      mealType={mealType}
      fallbackIcon={
        <div className="text-center">
          <div className="text-4xl mb-2">{randomEmoji}</div>
          <div className="text-sm font-medium opacity-60">South Indian</div>
        </div>
      }
    />
  );
}

export default FoodImage;

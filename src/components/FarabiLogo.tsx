import React from 'react';

interface FarabiLogoProps {
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  height?: number;
  className?: string;
}

export const FarabiLogo: React.FC<FarabiLogoProps> = ({
  variant = 'dark',
  size = 'md',
  height,
  className = '',
}) => {
  const isLight = variant === 'light';
  const logoSrc = isLight ? '/images/faraabee_logo_light.svg' : '/images/faraabee_logo.svg';

  // Standard dimensions:
  // sm: 42px, md: 56px, lg: 88px, xl: 120px
  const defaultHeight = {
    sm: 42,
    md: 56,
    lg: 88,
    xl: 120,
  }[size];

  const actualHeight = height ?? defaultHeight;

  return (
    <div
      className={`inline-flex items-center justify-center select-none ${className}`}
      style={{ lineHeight: 1 }}
    >
      <img
        src={logoSrc}
        alt="FARAABEE Logo"
        style={{ height: actualHeight, width: 'auto' }}
        className="object-contain transition-transform"
        loading="eager"
        decoding="async"
      />
    </div>
  );
};

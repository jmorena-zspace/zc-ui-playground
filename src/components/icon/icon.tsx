import clsx from 'clsx';
import { FC } from 'react';

export type IconProps = {
  src?: string | null;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
};

const PlaceholderIcon: FC<{
  className?: string;
  width?: number;
  height?: number;
}> = ({ className, width = 32, height = 32 }) => {
  const padding = 0.5;
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle
        cx={width / 2}
        cy={height / 2}
        r={Math.max(0, Math.min(width, height) / 2 - padding)}
        fill="currentColor"
        opacity="0.3"
      />
    </svg>
  );
};

export const Icon: FC<IconProps> = ({ src, alt, className, width, height }) => {
  const iconClassName = clsx(className, 'shrink-0');
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={iconClassName}
        width={width}
        height={height}
      />
    );
  }
  return (
    <PlaceholderIcon className={iconClassName} width={width} height={height} />
  );
};

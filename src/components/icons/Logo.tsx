// components/Logo.tsx
import React from "react";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({
  width = 240,
  height = 240,
  className = "",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 240 240"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 渐变定义 */}
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#6366f1", stopOpacity: 1 }} />
          <stop
            offset="100%"
            style={{ stopColor: "#8b5cf6", stopOpacity: 1 }}
          />
        </linearGradient>

        <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#ec4899", stopOpacity: 1 }} />
          <stop
            offset="100%"
            style={{ stopColor: "#8b5cf6", stopOpacity: 1 }}
          />
        </linearGradient>
      </defs>

      {/* 背景圆形 */}
      <circle
        cx="120"
        cy="120"
        r="110"
        fill="none"
        stroke="url(#gradient1)"
        strokeWidth="2"
        opacity="0.3"
      />

      {/* 动态波纹效果 */}
      <g transform="translate(120,120)">
        <circle
          r="85"
          fill="none"
          stroke="url(#gradient1)"
          strokeWidth="2"
          opacity="0.2"
        />
        <circle
          r="65"
          fill="none"
          stroke="url(#gradient2)"
          strokeWidth="2"
          opacity="0.3"
        />
        <circle
          r="45"
          fill="none"
          stroke="url(#gradient1)"
          strokeWidth="2"
          opacity="0.4"
        />
      </g>

      {/* 中央音符图案 */}
      <g transform="translate(120,120) scale(0.8)">
        <path
          d="M-20,-40 C-20,-40 20,-50 20,-20 L20,30 C20,45 5,55 -10,55 C-25,55 -40,45 -40,30 C-40,15 -25,5 -10,5 C0,5 10,10 20,15"
          fill="url(#gradient2)"
          stroke="none"
        />

        <path
          d="M-50,-10 Q-25,-30 0,-10 Q25,10 50,-10"
          fill="none"
          stroke="url(#gradient1)"
          strokeWidth="3"
          strokeLinecap="round"
        />

        <path
          d="M-50,10 Q-25,-10 0,10 Q25,30 50,10"
          fill="none"
          stroke="url(#gradient2)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>

      {/* AI文字 */}
      <text
        x="120"
        y="185"
        textAnchor="middle"
        fontFamily="Arial"
        fontWeight="bold"
        fontSize="24"
        fill="url(#gradient1)"
        letterSpacing="2"
      >
        AISongen
      </text>
    </svg>
  );
};

export default Logo;

import Image from "next/image";

interface LogoProps {
  size?: "small" | "medium" | "large";
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = "medium", showText = false, className = "" }: LogoProps) {
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-16 h-16",
    large: "w-24 h-24",
  };

  const dimensions = {
    small: { width: 32, height: 32 },
    medium: { width: 64, height: 64 },
    large: { width: 96, height: 96 },
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <Image
          src="/images/logos/amigos-do-glad.svg"
          alt="Amigos do Glad"
          width={dimensions[size].width}
          height={dimensions[size].height}
          className={`${sizeClasses[size]}`}
          priority={size === "large"}
        />
      </div>

      {showText && (
        <div className="text-white font-bold">
          {size === "small" && <span className="text-sm">Amigos do Glad</span>}
          {size === "medium" && <span className="text-lg">Amigos do Glad</span>}
          {size === "large" && <span className="text-2xl">Amigos do Glad</span>}
        </div>
      )}
    </div>
  );
}

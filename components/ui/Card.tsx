import { ReactNode, memo } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export const Card = memo(function Card({
  children,
  className = "",
  hover = false,
  onClick,
}: CardProps) {
  const hoverStyles = hover
    ? "hover:shadow-xl hover:-translate-y-1 cursor-pointer hover:border-sage/50"
    : "";

  return (
    <div
      className={`bg-white rounded-lg border-2 border-sage/20 shadow-lg transition-all ${hoverStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
});

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className = "" }: CardHeaderProps) {
  return <div className={`p-6 pb-4 ${className}`}>{children}</div>;
}

interface CardBodyProps {
  children: ReactNode;
  className?: string;
}

export function CardBody({ children, className = "" }: CardBodyProps) {
  return <div className={`p-6 pt-0 ${className}`}>{children}</div>;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className = "" }: CardFooterProps) {
  return (
    <div
      className={`px-6 py-4 bg-gray-50 rounded-b-xl border-t border-gray-100 ${className}`}
    >
      {children}
    </div>
  );
}

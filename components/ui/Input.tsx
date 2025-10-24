import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold text-navy mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-2.5 border-2 rounded 
            bg-white text-navy placeholder:text-navy/40
            focus:ring-2 focus:border-transparent transition-all ${
              error
                ? "border-terracotta/50 focus:ring-terracotta"
                : "border-sage/30 hover:border-sage/50 focus:ring-terracotta"
            } ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm font-medium text-terracotta">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-2 text-sm text-navy/60">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

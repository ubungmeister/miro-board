import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  isLoading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = "primary",
  isLoading = false,
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center px-4 py-2 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";
  
  const variants = {
    primary: "border-transparent text-white bg-indigo-600 hover:bg-indigo-700",
    secondary: "border-transparent text-white bg-gray-600 hover:bg-gray-700",
    outline: "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
} 
import { ButtonHTMLAttributes, forwardRef } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles = "font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    
    const variants = {
      primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl",
      secondary: "bg-slate-600 text-white hover:bg-slate-700 shadow-lg hover:shadow-xl",
      outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50",
      ghost: "text-slate-700 hover:bg-slate-100"
    }

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2",
      lg: "px-6 py-3 text-lg"
    }

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </motion.button>
    )
  }
)

Button.displayName = "Button"

export { Button }

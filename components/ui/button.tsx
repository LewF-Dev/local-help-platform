import { ButtonHTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gradient"
  size?: "sm" | "md" | "lg"
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const baseStyles = "font-semibold rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group"
    
    const variants = {
      primary: "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/50 hover:shadow-xl hover:shadow-violet-500/60 border border-violet-500/20",
      secondary: "bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-lg shadow-pink-500/50 hover:shadow-xl hover:shadow-pink-500/60 border border-pink-500/20",
      outline: "border-2 border-violet-500 text-violet-400 hover:bg-violet-500/10 backdrop-blur-sm",
      ghost: "text-zinc-300 hover:bg-zinc-800/50 backdrop-blur-sm",
      gradient: "bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60"
    }

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3",
      lg: "px-8 py-4 text-lg"
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        <span className="relative z-10">{children}</span>
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      </button>
    )
  }
)

Button.displayName = "Button"

export { Button }

import { HTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  glow?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, glow = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-zinc-900/50 backdrop-blur-xl rounded-3xl border border-zinc-800/50 p-6",
          "transition-all duration-300",
          hover && "hover:-translate-y-1 hover:border-violet-500/50 hover:shadow-xl hover:shadow-violet-500/20",
          glow && "shadow-lg shadow-violet-500/10",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = "Card"

export { Card }

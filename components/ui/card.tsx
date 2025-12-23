import { HTMLAttributes, forwardRef } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = false, children, ...props }, ref) => {
    const Component = hover ? motion.div : "div"
    
    return (
      <Component
        ref={ref}
        {...(hover && {
          whileHover: { y: -4, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" },
          transition: { duration: 0.2 }
        })}
        className={cn(
          "bg-white rounded-2xl shadow-lg p-6",
          "transition-shadow duration-200",
          className
        )}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

Card.displayName = "Card"

export { Card }

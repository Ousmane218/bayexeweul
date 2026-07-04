
import { cn } from "@/lib/utils"

function Badge({ className, variant = "default", ...props }) {
  const variants = {
    default: "border-transparent bg-navy text-white hover:bg-navy-hover",
    secondary: "border-transparent bg-beige-200 text-navy hover:bg-beige-300",
    outline: "text-premium-text border-premium-border",
    gold: "border-transparent bg-gold text-white hover:bg-gold-hover",
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }

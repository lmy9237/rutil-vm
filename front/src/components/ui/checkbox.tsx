import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { cva, type VariantProps } from "class-variance-authority"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const checkboxVariants = cva(
  // "peer h-4 w-4 shrink-0 rounded-sm border shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
  "peer h-[15px] w-[15px] shrink-0 rounded-none border shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-primary data-[state=checked]:bg-primary-inactive data-[state=checked]:text-primary-foreground hover:bg-hover",
        destructive:
          "border-destructive data-[state=checked]:bg-destructive data-[state=checked]:text-destructive-foreground",
        success:
          "data-[state=checked]:bg-success data-[state=checked]:text-success-foreground",
        info:
          "data-[state=checked]:bg-info data-[state=checked]:text-info-foreground",
        warning:
          "data-[state=checked]:bg-warning data-[state=checked]:text-warning-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> &
    VariantProps<typeof checkboxVariants>
>(({ className, variant, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
     className={cn(checkboxVariants({ variant }), className)}
    {...props}
    /* className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )} */
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-current")}
    >
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }

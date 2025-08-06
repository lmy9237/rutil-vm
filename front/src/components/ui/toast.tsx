import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { CheckCircle2, AlertCircle, AlertTriangle, XCircle } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import Spinner from "@/components/common/Spinner";

type ToastVariant = VariantProps<typeof toastVariants>["variant"];

const ToastContext = React.createContext<{ variant: ToastVariant }>({
  variant: "default",
});

const useToastVariant = () => {
  return React.useContext(ToastContext);
};

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  " group pointer-events-auto relative flex flex-col w-full h-auto space-y-2 break-words whitespace-pre-wrap rounded-md border p-4 pr-6 shadow-lg transition-all overflow-visible data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: 
          "bg-white !border !border-solid !border-gray-500 text-foreground",
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
        success:
          "success group border-success bg-success text-success-foreground",
        info:
          "info group border-info bg-info text-info-foreground",
        warning: // Using the semantic colors defined
          "warning group border-warning bg-warning text-warning-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastContext.Provider value={{ variant: variant || "default" }}>
      <ToastPrimitives.Root
        ref={ref}
        className={cn(toastVariants({ variant }), className)}
        {...props}
      />
    </ToastContext.Provider>
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      // Destructive variant styles
      "group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      // Success variant styles (optional, adjust as needed)
      "group-[.success]:border-muted/40 group-[.success]:hover:border-success/30 group-[.success]:hover:bg-success group-[.success]:hover:text-success-foreground group-[.success]:focus:ring-success",
      // Info variant styles (optional, adjust as needed)
      "group-[.info]:border-muted/40 group-[.info]:hover:border-info/30 group-[.info]:hover:bg-info group-[.info]:hover:text-info-foreground group-[.info]:focus:ring-info",
      // Warning variant styles (optional, adjust as needed)
      "group-[.warning]:border-muted/40 group-[.warning]:hover:border-warning/30 group-[.warning]:hover:bg-warning group-[.warning]:hover:text-warning-foreground group-[.warning]:focus:ring-warning",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100",
      // Destructive variant styles
      "group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      // --- START: New Variant Close Button Styles ---
      // Success variant styles
      "group-[.success]:text-success-foreground/70 group-[.success]:hover:text-success-foreground group-[.success]:focus:ring-success group-[.success]:focus:ring-offset-success",
      // Info variant styles
      "group-[.info]:text-info-foreground/70 group-[.info]:hover:text-info-foreground group-[.info]:focus:ring-info group-[.info]:focus:ring-offset-info",
      // Warning variant styles
      "group-[.warning]:text-warning-foreground/70 group-[.warning]:hover:text-warning-foreground group-[.warning]:focus:ring-warning group-[.warning]:focus:ring-offset-warning",
      // --- END: New Variant Close Button Styles ---
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => {
  const { variant } = useToastVariant(); // MODIFIED: Consuming context

  // Define the icons for each variant.
  // We use a typed object for better autocompletion and type-safety.
  const variantIcons: { [key in NonNullable<VariantProps<typeof toastVariants>['variant']>]: React.ElementType } = {
    default: Spinner,
    success: CheckCircle2,
    info: AlertCircle,
    warning: AlertTriangle,
    destructive: XCircle,
  };

  // Look up the icon component based on the variant prop.
  const IconComponent = variant ? variantIcons[variant] : null;

  return (
    <div className="flex items-center gap-x-2">
      {IconComponent && <IconComponent className="h-[16px] w-[16px]" />}
      <ToastPrimitives.Title
        ref={ref}
        className={cn("text-sm font-semibold", className)}
        {...props}
      />
      {/* <ToastPrimitives.Title
      ref={ref}
      className={cn("text-sm font-semibold", className)} // Removed [&+div]:text-xs to give more control to description
      {...props}
    /> */}
    </div>
  )
})
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn(
      "text-sm opacity-90 break-words break-all whitespace-pre-wrap w-full",
      className
    )}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>
type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}

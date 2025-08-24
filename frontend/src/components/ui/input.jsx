import { forwardRef } from "react"
import { cn } from "@/lib/utils"

const Input = forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-11 w-full rounded-xl border border-slate-300 bg-white/80 backdrop-blur-sm px-4 py-3 text-sm ring-offset-background placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-sm hover:bg-white hover:shadow-md",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

const FloatingLabelInput = forwardRef(({ className, label, type, ...props }, ref) => {
  const isDateInput = type === 'date'
  
  return (
    <div className="relative">
      <input
        type={type}
        className={cn(
          "flex h-14 w-full rounded-xl border border-slate-300 bg-white/80 backdrop-blur-sm px-4 pt-6 pb-2 text-sm ring-offset-background placeholder:text-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 shadow-sm hover:bg-white hover:shadow-md peer",
          isDateInput && "text-base sm:text-sm",
          className
        )}
        placeholder={label}
        ref={ref}
        {...props}
      />
      <label className={cn(
        "absolute left-4 top-2 text-xs font-medium text-slate-600 transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-slate-500 peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-600 peer-focus:font-medium pointer-events-none",
        isDateInput && "peer-placeholder-shown:top-2 peer-placeholder-shown:text-xs"
      )}>
        {label}
      </label>
    </div>
  )
})
FloatingLabelInput.displayName = "FloatingLabelInput"

export { Input, FloatingLabelInput }
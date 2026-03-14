import * as React from "react"

export interface ToggleProps extends React.HTMLAttributes<HTMLButtonElement> {
  pressed?: boolean
  onPressedChange?: (pressed: boolean) => void
  defaultPressed?: boolean
  disabled?: boolean
  variant?: 'default' | 'outline'
}

const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({
    className,
    pressed: controlledPressed,
    defaultPressed = false,
    onPressedChange,
    disabled = false,
    variant = 'default',
    ...props
  }, ref) => {
    const [pressed, setPressed] = React.useState(defaultPressed)
    const isControlled = controlledPressed !== undefined
    const actualPressed = isControlled ? controlledPressed : pressed

    const handleClick = () => {
      if (!isControlled) {
        setPressed(!pressed)
      }
      onPressedChange?.(!actualPressed)
    }

    return (
      <button
        ref={ref}
        onClick={handleClick}
        disabled={disabled}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full
          transition-colors duration-200
          ${actualPressed
            ? 'bg-primary'
            : 'bg-muted'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        {...props}
      >
        <span
          className={`
            inline-block h-5 w-5 transform rounded-full bg-white
            transition-transform duration-200
            ${actualPressed ? 'translate-x-5' : 'translate-x-0.5'}
          `}
        />
      </button>
    )
  }
)

Toggle.displayName = "Toggle"

export { Toggle }

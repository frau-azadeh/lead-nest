import { forwardRef, InputHTMLAttributes, useId } from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, name, ...rest }, ref) => {
    const internalId = useId();
    const inputId = name || internalId;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block mb-1 text-sm font-medium">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          name={name}
          {...rest}
          className={cn(
            'border p-2 w-full rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition',
            error ? 'border-red-500' : 'border-gray-300',
            className
          )}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

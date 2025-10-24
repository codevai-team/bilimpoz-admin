import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          ref={ref}
          className={`
            w-full px-5 py-4 
            text-white placeholder-gray-400
            rounded-xl
            border border-gray-600
            focus:outline-none focus:border-white
            hover:border-gray-500
            transition-all duration-300 ease-in-out
            ${error ? 'border-red-400 focus:border-red-400' : ''}
            ${className}
          `}
          style={{
            backgroundColor: '#0b0b0b'
          }}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

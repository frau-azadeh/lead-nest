// src/components/ui/Select.tsx

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    options: { value: string; label: string }[];
    label?: string;
    error?: string;
  }
  
  export default function Select({ options, label, error, className, ...props }: SelectProps) {
    return (
      <div className="flex flex-col gap-1 w-full">
        {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
        <select
          {...props}
          className={`border rounded px-4 py-2 text-gray-700 focus:ring focus:ring-blue-200 ${className}`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <span className="text-red-500 text-xs">{error}</span>}
      </div>
    );
  }
  
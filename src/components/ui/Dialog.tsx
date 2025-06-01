// src/components/ui/Dialog.tsx
import React from 'react';

// 🔥 interface اصلی Dialog
interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

// 📦 interface های sub-components
interface DialogSubComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

// 🟢 Dialog اصلی
export const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="bg-white rounded-lg shadow-lg max-w-md w-full p-4"
        onClick={(e) => e.stopPropagation()} // جلوگیری از بسته شدن مدال موقع کلیک داخلش
      >
        {children}
      </div>
    </div>
  );
};

// 🟢 DialogContent
export const DialogContent: React.FC<DialogSubComponentProps> = ({
  children,
  className,
  ...props
}) => (
  <div className={className} {...props}>
    {children}
  </div>
);

// 🟢 DialogHeader
export const DialogHeader: React.FC<DialogSubComponentProps> = ({
  children,
  className,
  ...props
}) => (
  <div className={`mb-4 border-b pb-2 ${className ?? ''}`} {...props}>
    {children}
  </div>
);

// 🟢 DialogTitle
export const DialogTitle: React.FC<DialogSubComponentProps> = ({
  children,
  className,
  ...props
}) => (
  <h2 className={`text-lg font-bold ${className ?? ''}`} {...props}>
    {children}
  </h2>
);

// 🟢 DialogFooter
export const DialogFooter: React.FC<DialogSubComponentProps> = ({
  children,
  className,
  ...props
}) => (
  <div className={`mt-4 flex justify-end space-x-2 ${className ?? ''}`} {...props}>
    {children}
  </div>
);

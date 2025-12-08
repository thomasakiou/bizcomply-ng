import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    children,
    className = '',
    ...props
}) => {
    const baseClasses = 'font-semibold rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
        primary: 'bg-primary hover:bg-primary-600 text-white',
        secondary: 'bg-navy hover:bg-navy-600 text-white',
        outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
        danger: 'bg-red-600 hover:bg-red-700 text-white',
    };

    const sizeClasses = {
        sm: 'py-1.5 px-4 text-sm',
        md: 'py-2 px-6 text-base',
        lg: 'py-3 px-8 text-lg',
    };

    return (
        <button
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;

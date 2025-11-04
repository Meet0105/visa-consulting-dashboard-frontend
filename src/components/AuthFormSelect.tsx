import React from 'react';

interface AuthFormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
  name: string;
  children: React.ReactNode;
}

const AuthFormSelect: React.FC<AuthFormSelectProps> = ({
  label,
  id,
  name,
  children,
  value,
  onChange,
  required = false,
  disabled = false,
  ...props
}) => {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      <select
        id={id}
        name={name}
        required={required}
        className="select"
        value={value}
        onChange={onChange}
        disabled={disabled}
        {...props}
      >
        {children}
      </select>
    </div>
  );
};

export default AuthFormSelect;
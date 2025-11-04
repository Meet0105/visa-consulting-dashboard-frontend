import React from 'react';

interface AuthFormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  name: string;
  type: string;
  placeholder: string;
}

const AuthFormInput: React.FC<AuthFormInputProps> = ({
  label,
  id,
  name,
  type,
  placeholder,
  value,
  onChange,
  autoComplete,
  required = false,
  ...props
}) => {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        className="input"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        {...props}
      />
    </div>
  );
};

export default AuthFormInput;
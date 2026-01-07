import React from 'react';
import '../css/input-field.css';

interface Option {
  value: string | number;
  label: string;
}

export type InputFieldType = 
  | 'text' 
  | 'password' 
  | 'email' 
  | 'number' 
  | 'tel' 
  | 'url' 
  | 'search' 
  | 'date' 
  | 'time'
  | 'textarea' 
  | 'select'
  | 'checkbox';

interface InputFieldProps {
  label: string;
  type?: InputFieldType;
  placeholder?: string;
  value?: string | number;
  checked?: boolean; 
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  className?: string;
  autoComplete?: string;
  options?: Option[]; 
  rows?: number;     
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  type = 'text',
  placeholder,
  value,
  checked,
  onChange,
  className = '',
  autoComplete,
  options,
  rows = 4,
}) => {
  
  // Checkbox
  if (type === 'checkbox') {
    return (
      <div className={`field ${className}`}>
        <label className="checkbox-wrapper">

          <input 
            type="checkbox"
            className="checkbox-native-input"
            checked={checked}
            onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
          />

          <div className={`checkbox-indicator ${checked ? 'is-checked' : ''}`}>
             {checked && <span className="codicon codicon-check"></span>}
          </div>

          <span className="checkbox-label-text">{label}</span>
        </label>
      </div>
    );
  }

  const renderInput = () => {
    // Text area
    if (type === 'textarea') {
      return (
        <textarea
          className="textarea custom-input has-fixed-size"
          placeholder={placeholder}
          value={value}
          onChange={onChange as React.ChangeEventHandler<HTMLTextAreaElement>}
          rows={rows}
        />
      );
    }

    // Dropdown
    if (type === 'select') {
      return (
        <div className="control">
          <div className="select is-fullwidth">
            <select
              className="custom-input"
              value={value}
              onChange={onChange as React.ChangeEventHandler<HTMLSelectElement>}
            >
              <option value="" disabled>
                {placeholder || 'Select an option'}
              </option>
              {options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      );
    }

    // Default
    return (
      <input
        className="input custom-input"
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange as React.ChangeEventHandler<HTMLInputElement>}
        autoComplete={autoComplete}
      />
    );
  };

  return (
    <div className={`field ${className}`}>
      <label className="label custom-label">{label}</label>
      <div className="control">
        {renderInput()}
      </div>
    </div>
  );
};

export default InputField;
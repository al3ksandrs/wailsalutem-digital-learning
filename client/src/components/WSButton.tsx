import React from 'react';
import '../css/wsbutton.css';

interface WSButtonProps {
  label?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  size?: 'small' | 'normal' | 'large';
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  className?: string;
  disabled?: boolean;
  title?: string; // hover tooltips
}

const WSButton: React.FC<WSButtonProps> = ({
  label,
  onClick,
  icon,
  size = 'normal',
  type = 'button',
  fullWidth = false,
  className = '',
  disabled = false,
  title,
}) => {

  let sizeClass = '';
  if (size === 'small') sizeClass = 'is-small';
  else if (size === 'large') sizeClass = 'is-large';

  const widthClass = fullWidth ? 'is-fullwidth' : '';
  const hasText = !!label;

  return (
    <button
      type={type}
      className={`button custom-btn ${sizeClass} ${widthClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
      title={title}
    >
      {icon && <span className={`icon ${hasText ? 'is-small mr-2' : ''}`}>{icon}</span>}
      {label && <span>{label}</span>}
    </button>
  );
};

export default WSButton;
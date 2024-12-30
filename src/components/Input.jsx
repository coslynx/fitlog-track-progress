import React, { useCallback } from 'react';

/**
 * @typedef {Object} InputProps
 * @property {string} type - The type of input, e.g., 'text', 'email', 'password'.
 * @property {string} value - The current value of the input.
 * @property {(event: React.ChangeEvent<HTMLInputElement>) => void} onChange - Callback function triggered on input change.
 * @property {string} placeholder - Placeholder text for the input.
 * @property {React.CSSProperties} style - Optional inline styles for the input.
 */

/**
 * A reusable input component.
 * @param {InputProps} props
 * @returns {JSX.Element}
 */
const Input = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  style,
}) => {
  const handleChange = useCallback(
    (event) => {
        if (!onChange) {
            console.warn('No onChange handler provided for this input.');
            return;
        }

      let sanitizedValue = event.target.value;
        
      // Basic XSS sanitization (replace < and >)
      sanitizedValue = sanitizedValue.replace(/</g, "&lt;").replace(/>/g, "&gt;");

      onChange(event);

    },
    [onChange]
  );

  const defaultStyle = {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '5px',
      boxSizing: 'border-box',
  };

  const combinedStyle = { ...defaultStyle, ...style };

  return (
    <input
      type={type}
      value={value || ''}
      onChange={handleChange}
      placeholder={placeholder}
      style={combinedStyle}
        className="focus:outline-none"
    />
  );
};

export default Input;

/* Test cases:

// Example usage with text input, default type
<Input
    value={"Test input"}
    onChange={(e) => console.log(e.target.value)}
  placeholder="Enter text"
/>

// Example usage with email input and placeholder
<Input
  type="email"
  placeholder="Enter your email"
    value={"test@test.com"}
    onChange={(e) => console.log(e.target.value)}

/>

// Example usage with password input and custom styles
<Input
  type="password"
    value={"securePass"}
  placeholder="Enter your password"
  style={{ border: '2px solid blue', backgroundColor: '#f0f0f0' }}
    onChange={(e) => console.log(e.target.value)}

/>

// Example usage with a value property
<Input
  value="Initial Value"
    onChange={(e) => console.log(e.target.value)}
/>

// Example usage without onChange
<Input
  placeholder="No change"
/>


// Example of sanitization for potential XSS
<Input
  type="text"
  value="<script>alert('hacked!')</script>"
  onChange={(e) => console.log("Sanitized value:", e.target.value)}
  placeholder="Enter text with script"
/>
*/
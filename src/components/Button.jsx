import React from 'react';

/**
 * @typedef {Object} ButtonProps
 * @property {() => void} onClick - Function to be called when the button is clicked.
 * @property {React.ReactNode} children - The content to be displayed within the button.
 * @property {React.CSSProperties} style - Optional inline styles to apply to the button.
 * @property {'button' | 'submit' | 'reset'} type - Optional button type.
 */

/**
 * A reusable button component.
 * @param {ButtonProps} props
 * @returns {JSX.Element}
 */
const Button = ({ onClick, children, style, type = 'button' }) => {
    const handleClick = (event) => {
        if (onClick) {
            onClick(event);
        } else {
            console.warn('No onClick handler provided for this button.');
        }
    };


  const defaultStyle = {
        padding: '10px 20px',
        backgroundColor: '#f0f0f0',
        borderRadius: '5px',
        border: 'none',
      cursor: 'pointer'
    };
  const combinedStyle = { ...defaultStyle, ...style };


  return (
      <button
        type={type}
        onClick={handleClick}
        style={combinedStyle}
        className="focus:outline-none"
      >
          {children}
      </button>
  );
};



export default Button;


/* Test cases:
// Example usage with children as a string and default styles:
<Button onClick={() => console.log('Button clicked')}>Click Me</Button>

// Example usage with children as a React element and custom styles:
<Button
  onClick={() => console.log('Button clicked')}
  style={{ backgroundColor: 'lightblue', color: 'white', padding: '15px 30px' }}
>
    <span>Click Me Now!</span>
</Button>

// Example usage without a click handler:
<Button>No Action</Button>

// Example usage with different button type:
<Button type="submit">Submit</Button>
*/
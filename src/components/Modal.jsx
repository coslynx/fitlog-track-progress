import React, { useState, useEffect, useCallback, useRef } from 'react';

/**
 * @typedef {Object} ModalProps
 * @property {boolean} isOpen - Indicates whether the modal is open.
 * @property {() => void} onClose - Function to be called when the modal is closed.
 * @property {React.ReactNode} children - The content to be displayed within the modal.
 * @property {React.CSSProperties} style - Optional inline styles to apply to the modal.
 */

/**
 * A reusable modal component.
 * @param {ModalProps} props
 * @returns {JSX.Element | null}
 */
const Modal = ({ isOpen, onClose, children, style }) => {
    const modalRef = useRef(null);
    const [sanitizedChildren, setSanitizedChildren] = useState(children);


    useEffect(() => {
        // Sanitize children on each render
        if (children) {
            const sanitized = React.Children.map(children, (child) => {
                if (typeof child === 'string') {
                    // Sanitize string children
                    return child.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                } else if (React.isValidElement(child)) {
                    // Sanitize props for elements
                    const sanitizedProps = { ...child.props };
                    for (const key in sanitizedProps) {
                        if (typeof sanitizedProps[key] === 'string') {
                            sanitizedProps[key] = sanitizedProps[key].replace(/</g, "&lt;").replace(/>/g, "&gt;");
                        }
                    }
                    return React.cloneElement(child, sanitizedProps);
                }
                return child;
            });
            setSanitizedChildren(sanitized);
        } else {
            setSanitizedChildren(null);
        }

    }, [children]);


    const handleOverlayClick = useCallback((event) => {
        if (modalRef.current && event.target === modalRef.current) {
            if (onClose) {
                 onClose();
            } else {
                console.error('onClose function is not defined for Modal.');
            }
        }
    }, [onClose]);


    const handleKeyDown = useCallback((event) => {
      if (event.key === 'Escape' && isOpen) {
        if (onClose) {
             onClose();
        } else {
             console.error('onClose function is not defined for Modal.');
        }
      }
    }, [isOpen, onClose]);
    


    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, handleKeyDown]);

    if (!isOpen) {
        return null;
    }
    const defaultOverlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    };

    const defaultContentStyle = {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '5px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        maxWidth: '90%',
        maxHeight: '90%',
        overflowY: 'auto',
    };


    const combinedOverlayStyle = { ...defaultOverlayStyle, ...style };
    return (
      <div
        ref={modalRef}
        style={combinedOverlayStyle}
        onClick={handleOverlayClick}
        className="focus:outline-none"
      >
          <div style={defaultContentStyle}>
            {sanitizedChildren}
          </div>
      </div>
  );
};

export default Modal;


/* Test cases:

// Example usage with basic modal content:
 <Modal isOpen={true} onClose={() => console.log('close')} ><div>modal content</div></Modal>

// Example usage with custom styles and complex content:
<Modal
  isOpen={true}
  onClose={() => console.log('close with custom styles')}
  style={{ backgroundColor: 'rgba(0, 0, 255, 0.7)' }}
>
    <div>
        <h2>Modal Title</h2>
        <p>This is some complex modal content.</p>
        <button onClick={() => console.log('button click in modal')}>Click</button>
    </div>
</Modal>


// Example usage with sanitized children to prevent XSS:
<Modal isOpen={true} onClose={() => console.log('close')}>
    <p>This is a normal text.</p>
  <p>This is a <script>alert("Hacked!");</script> text with a script tag.</p>
  <div>This is a <span onClick={()=> alert("Hacked!")}>Clickable text with inline script</span></div>
    <p> This is another text with <code>code</code></p>
</Modal>

// Example of not showing if not open
<Modal isOpen={false} onClose={() => console.log('close')}>
  <div>This modal should not be rendered</div>
</Modal>

// Example usage without onClose handler
<Modal isOpen={true}>
  <div>This modal will log an error on close</div>
</Modal>
*/
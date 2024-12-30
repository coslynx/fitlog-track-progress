/**
 * Formats a Date object into a string (YYYY-MM-DD).
 * @param {Date} date - The Date object to format.
 * @returns {string} The formatted date string, or 'Invalid Date' if the input is not a valid Date object.
 */
const formatDate = (date) => {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return 'Invalid Date';
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Validates and sanitizes user input based on the specified type.
 * @param {string} input - The input string to validate.
 * @param {string} type - The type of input ('text', 'email', 'number').
 * @returns {string} The sanitized input string.
 * @throws {Error} If the input is invalid or doesn't match the specified type.
 */
const validateInput = (input, type) => {
    if (typeof input !== 'string') {
        throw new Error('Input must be a string.');
    }

    const trimmedInput = input.trim();

    // XSS sanitization (replace < and >)
    const sanitizedInput = trimmedInput.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  if (type === 'text') {
    return sanitizedInput;
  }
  if (type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(sanitizedInput)) {
          throw new Error('Invalid email format.');
      }
      return sanitizedInput;
  }
  if (type === 'number') {
      const parsedNumber = parseFloat(sanitizedInput);
      if (isNaN(parsedNumber)) {
          throw new Error('Input must be a valid number.');
      }
      return String(parsedNumber);
  }
    throw new Error(`Invalid input type: ${type}.`);
};


/**
 * Generates a shareable URL string for a goal.
 * @param {string} goalId - The ID of the goal.
 * @param {string} userId - The ID of the user.
 * @returns {string} The shareable URL string.
 */
const generateShareLink = (goalId, userId) => {
  if (!goalId || typeof goalId !== 'string') {
      console.error("Error generating share link: goalId must be a non empty string");
      return '';
  }
    if (!userId || typeof userId !== 'string') {
        console.error("Error generating share link: userId must be a non empty string");
        return '';
    }

    if (typeof window === 'undefined') {
      console.error("Error generating share link: window object is not available");
      return '';
  }
  const baseUrl = window.location.origin;
    return `${baseUrl}/goal/${goalId}?user=${userId}`;
};

/**
 * Calculates the progress percentage of a goal.
 * @param {number} current - The current progress value.
 * @param {number} target - The target value.
 * @returns {number} The progress percentage, or 0 if the target is zero.
 */
const calculateProgress = (current, target) => {
  if (typeof current !== 'number' || typeof target !== 'number') {
    return 0;
  }
  if (target === 0) {
    return 0;
  }
  return Math.min(Math.max((current / target) * 100, 0), 100);
};

export { formatDate, validateInput, generateShareLink, calculateProgress };
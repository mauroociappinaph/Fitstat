
/**
 * Sanitizes user input to prevent Prompt Injection attacks.
 * Removes control characters and potential injection sequences.
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return "";

  // 1. Remove hidden control characters (except newline/tab)
  // eslint-disable-next-line no-control-regex
  let clean = input.replace(/[\x00-\x09\x0B-\x1F\x7F]/g, "");

  // 2. Escape generic potential delimiters commonly used in system prompts
  // Note: Gemini is relatively robust, but avoiding '```' block confusion is good.
  clean = clean.replace(/```/g, "'''");

  // 3. Truncate excessively long inputs to prevent token exhaustion DOS
  if (clean.length > 2000) {
    clean = clean.substring(0, 2000) + "...(truncated)";
  }

  return clean;
};

/**
 * Validates if the input contains suspicious patterns that might indicate an attack.
 * Returns true if safe, false if suspicious.
 */
export const validateInputSafety = (input: string): boolean => {
  const suspiciousPatterns = [
    /ignore previous instructions/i,
    /system prompt/i,
    /you are a hacker/i,
    /delete database/i
  ];

  return !suspiciousPatterns.some(pattern => pattern.test(input));
};

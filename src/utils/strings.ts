/**
 * HearthStone Browser
 * Copyright 2020, Chakir Mrabet <hello@cmrabet.com>
 * Tools for handeling strings.
 */

/**
 * Sets to uppercase the first letter of the given word.
 * @param word Word to capitalize.
 */
export function capitalize(word: string): string {
  return word[0].toUpperCase() + word.slice(1);
}

/**
 * Removes all HTML tags from the given text.
 * @param text Text (string) to clean.
 */
export function removeHTMLTags(text: string): string {
  const div = document.createElement('div');
  div.innerHTML = text;
  return div.innerText;
}

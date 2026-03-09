import { Locator } from '@playwright/test';

/**
 * Get full normalized text from a heading element
 * - Ignores Tailwind "hidden" or zero-height spans
 * - Normalizes whitespace and line breaks
 */

export async function getHeadingText(locator: Locator): Promise<string> {
  const rawText = await locator.innerText();
  return rawText.replace(/\s+/g, ' ').trim(); // normalize 
}

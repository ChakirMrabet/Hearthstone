/**
 * HearthStone Browser
 * Copyright 2020, Chakir Mrabet <hello@cmrabet.com>
 * Tools for validation.
 */

/**
 * Returns true if the given object contains the given properties.
 * @param obj Object to check.
 * @param props Name (string) or names (array of strings) of the properties to search in the object.
 */
export function hasProps(obj: any, props: string[] | string): boolean {
  if (obj !== null && typeof obj === 'object') {
    if (typeof props === 'object') {
      return props.every((prop) => prop in obj);
    }
    return props in obj;
  }
  return false;
}

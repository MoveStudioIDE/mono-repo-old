
// Insert the decimal point into a string of digits at the specified index.
// Add a leading zero if the decimal point is the first character.
export function decimalify(value: string, decimalPrecision: number): string {
  if (value.length <= decimalPrecision) {
    return `0.${'0'.repeat(decimalPrecision - value.length)}${value}`;
  }
  return `${value.slice(0, -decimalPrecision)}.${value.slice(-decimalPrecision)}`;
}
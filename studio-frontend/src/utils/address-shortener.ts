

export function shorten(address: string): string {
  const length = address.length;
  return `0x${address.slice(2, 5)}...${address.slice(length - 3)}`
}


export function shortenAddress(address: string, truncateLength: number): string {
  const length = address.length;
  return `0x${address.slice(2, 2 + truncateLength)}..${address.slice(length - truncateLength)}`
}
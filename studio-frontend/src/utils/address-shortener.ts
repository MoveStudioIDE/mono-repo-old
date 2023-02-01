

export function shortenAddress(address: string, truncateLength: number): string {
  const length = address.length;
  if (length <= truncateLength) {
    return address
  }
  return `0x${address.slice(2, 2 + truncateLength)}..${address.slice(length - truncateLength)}`
}

export function shortenWord(string: string, cutLength: number = 10): string {
  if (string.length > cutLength) {
    return string.substring(0, cutLength) + '...'
  }
  return string
}
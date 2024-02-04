export function base64Encode(value: string): string {
  return Buffer.from(value).toString('base64');
}

export function base64Decode(value: string): string {
  return Buffer.from(value, 'base64').toString();
}

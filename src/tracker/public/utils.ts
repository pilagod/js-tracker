// https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery
export function hash(s: string): string {
  let hash = 0

  if (s.length !== 0) {
    for (let i = 0; i < s.length; i++) {
      hash = (((hash << 5) - hash) + s.charCodeAt(i)) | 0 // Convert to 32 bits integer
    }
  }
  return hash.toString(36)
}
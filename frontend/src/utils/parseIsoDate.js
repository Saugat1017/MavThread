// src/utils/parseIsoDate.js
export function parseIsoDateWithMicro(s) {
  // split on the dot
  const [base, frac] = s.split('.')
  // take only first 3 digits of fraction (milliseconds)
  const ms = frac ? frac.slice(0, 3) : '000'
  // reconstruct and force UTC by adding 'Z'
  return new Date(`${base}.${ms}Z`)
}

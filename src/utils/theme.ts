export function getIsLightTheme() {
  return localStorage.getItem('isLightMode') === 'light' ??
    window.matchMedia('(prefers-color-scheme: dark)')
}

export function setIsLightTheme(val: boolean) {
  const valStr = val ? 'light' : ''
  localStorage.setItem('isLightMode', valStr)
  document.documentElement.className = valStr
}

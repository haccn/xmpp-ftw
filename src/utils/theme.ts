export function getIsDarkTheme() {
	return localStorage.getItem('isDarkTheme') === 'dark' ??
		window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function setIsDarkTheme(val: boolean) {
	const valStr = val ? 'dark' : ''
	localStorage.setItem('isDarkTheme', valStr)
	document.documentElement.className = valStr
}

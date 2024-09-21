<script setup lang="ts">
	import { setIsLightTheme, getIsLightTheme } from "../utils/theme";

	let isLightMode = getIsLightTheme();

	function setTheme(e: Event) {
		const el = e.target as HTMLInputElement;
		isLightMode = el.checked;
		setIsLightTheme(el.checked);
	}
</script>

<template>
	<input
		type="checkbox"
		:checked="isLightMode"
		@change="setTheme"/>
</template>

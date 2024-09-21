<script lang="ts">
	import { setIsLightTheme, getIsLightTheme } from "../utils/theme";

	export default {
		data() {
			return {
				isLightMode: false
			};
		},
		mounted() {
			this.isLightMode = getIsLightTheme();
		},
		methods: {
			setTheme(e: Event) {
				const el = e.target as HTMLInputElement;
				this.isLightMode = el.checked;
				setIsLightTheme(el.checked);
			},
		},
	};
</script>

<template>
	<input
		type="checkbox"
		:checked="isLightMode"
		@change="setTheme"/>
</template>

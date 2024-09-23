import type { Connection } from "node_modules/strophe.js/src/types/websocket";
import { defineStore } from "pinia";

export const useMainStore = defineStore("main", {
	state: () => ({
		connections: new Map<string, Connection>(),
	}),
})

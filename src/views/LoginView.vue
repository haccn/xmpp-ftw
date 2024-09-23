<script setup lang="ts">
	import { Strophe } from "strophe.js";
	import router from "@/router";
	import { useRoute } from "vue-router";
	import { useMainStore } from "@/stores/main";
	import config from "@/config";

	const store = useMainStore();
	const route = useRoute();

	function tryConnect(jid: string | null, password: string | null) {
		return new Promise(resolve => {
			if (!jid || !password) {
				resolve(false);
				return;
			}

			if (store.connections.has(jid)) {
				resolve(true);
				return;
			}

			const connection = new Strophe.Connection(config.transport);
			connection.connect(jid, password, (status: number, condition: string | null, _elem: any) => {
				switch (status) {
					case Strophe.Status.CONNECTED:
						console.log("Connected!");
						localStorage.setItem("jid", jid);
						localStorage.setItem("serpent", btoa(password));
						store.connections.set(jid, connection);
						if (route.query.redirect)
							router.push(route.query.redirect as string);
						resolve(true);
						return;

					case Strophe.Status.ERROR:
						console.error("Connection error: " + condition);
						break;

					case Strophe.Status.CONNTIMEOUT:
						console.error("Connection timed out");
						break;

					case Strophe.Status.AUTHFAIL:
						console.error("Authentication failed");
						break;
				}
				resolve(false);
			});
		});
	}

	let storedPassword = localStorage.getItem("serpent");
	if (storedPassword)
		tryConnect(localStorage.getItem("jid"), atob(storedPassword));

	let jid = "a@hacc.party";
	let password = "a";
</script>

<template>
	<form @submit="(e) => { e.preventDefault(); tryConnect(jid, password); }">
		<input type="text" :placeholder="config.placeholder_jid" v-model="jid"/>
		<input type="password" v-model="password"/>
		<input type="submit" value="Login"/>
	</form>
</template>

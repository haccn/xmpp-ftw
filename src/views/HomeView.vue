<script setup lang="ts">
	import ThemeToggle from "@/components/ThemeToggle.vue";
	import router from "@/router";
	import { useMainStore } from "@/stores/main";
import type { Contact, Subscription } from "@/utils/types";
	import { $iq, Strophe } from "strophe.js";

	const store = useMainStore();
	const connection = store.connection;

	// see rfc6121
	function getRoster() {
		connection.sendIQ(
			$iq({ type: "get" })
				.c("query", { xmlns: Strophe.NS.ROSTER }),
			(stanza: Element) => {
				console.log("Roster: " + stanza.innerHTML)
				const contacts = [] as Contact[];
				const items = stanza.children[0].children;
				for	(let i = 0; i < items.length; i++) {
					const item = items[i];
					contacts.push({
						jid: item.getAttribute("jid") as string,
						subscription: item.getAttribute("subscription") as Subscription,
					});
				}
				store.contacts = contacts;
			},
			(stanza: any) => {
				if (stanza) console.error("Error retrieving roster: " + stanza.innerHTML);
				else console.error("Error retrieving roster");
			},
		);
	}
	getRoster();

	function logout() {
		connection.disconnect();
		localStorage.removeItem("jid");
		localStorage.removeItem("seed");
		router.push({ name: "login", query: { redirect: "/" }});
	}
</script>

<template>
	<aside>
		<ThemeToggle />
		<button @click="logout">Logout</button>
		<hr>
		<h2>Contacts</h2>
		<button @click="getRoster">Refresh</button>
		<ul>
			<li v-for="contact in store.contacts">{{ contact.jid }} <span style="opacity:0.5">({{ contact.subscription }})</span></li>
		</ul>
		<!--
		<h2>Chats</h2>
		<ul>
			<li v-for="chat in store.chats">{{ chat.jid }} <span style="opacity:0.5">({{ contact.subscription }})</span></li>
		</ul>
		-->
	</aside>
	<main>
		<h1>muc 1</h1>
	</main>
</template>

<style>
body {
	display: flex;
	height: 100vh;
	margin: 0;
}
ul {
	list-style: none;
	padding: 0;
	margin: 0;
}
li {
	padding: 0.3rem;
}
aside {
	max-width: 10rem;
	width: 100%;
	background: #111;
}
aside * {
	display: block;
}
main {
	padding: 1rem;
}
</style>

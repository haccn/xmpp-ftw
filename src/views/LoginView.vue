<script setup lang="ts">
	import { stat } from 'fs';
import { Strophe } from 'strophe.js';

	let jid = "example@hacc.party";
	let password = "";

	const connection = new Strophe.Connection("wss:hacc.party/xmpp-websocket");

	function connect() {
		connection.connect(jid, password, onConnect);
	}

	function onConnect(status: number, condition: string | null, elem: Element) {
		if (status == Strophe.Status.CONNECTED)
			console.log("connected!");
		else if (status == Strophe.Status.ERROR)
			console.log("connection error: " + condition);
		else if (status == Strophe.Status.AUTHFAIL)
			console.log("failed to authenticate");
		console.log(elem);
	}
</script>

<template>
	<input type="text" :value="jid" @input="e => jid = e.target.value"/>
	<input type="password" :value="password" @input="e => password = e.target.value"/>
	<button @click="connect">login</button>
</template>

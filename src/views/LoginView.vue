<script setup lang='ts'>
import { $pres, Strophe } from 'strophe.js'
import router from '@/router'
import { useRoute } from 'vue-router'
import { store } from '@/stores/main'
import config from '@/config'
import { initRosterListener, rosterGet } from '@/utils/roster'
import { initPresenceListener } from '@/utils/presence'

const route = useRoute()

function tryConnect(jid: string | null, password: string | null) {
	return new Promise(resolve => {
		if (!jid || !password) {
			resolve(false)
			return
		}

		store.connection.rawInput = data => console.log('RECV: ' + data)
		store.connection.rawOutput = data => console.log('SENT: ' + data)
		store.connection.connect(jid, password, (status: number, condition: string | null, _elem: any) => {
			switch (status) {
				case Strophe.Status.CONNECTED:
					console.log('Connected!')
					initPresenceListener()
					initRosterListener()
					rosterGet()
					store.connection.send($pres()) // rfc 6121 4.2.1 Client Generation of Initial Presence
					if (store.connection.scram_keys !== null) {
						localStorage.setItem('jid', jid)
						localStorage.setItem('seed', btoa(JSON.stringify(store.connection.scram_keys)))
					}
					else {
						console.error('Failed to save password. No secure mechanism available.' +
						'Please contact the server administrator and request that they add SCRAM support.' +
						'(in Prosody this can be done with mod_auth_internal_hashed)')
					}
					if (route.query.redirect) router.push(route.query.redirect as string)
					resolve(true)
					return

				case Strophe.Status.ERROR:
					console.error('Connection error: ' + condition)
					break

				case Strophe.Status.CONNTIMEOUT:
					console.error('Connection timed out')
					break

				case Strophe.Status.AUTHFAIL:
					console.error('Authentication failed')
					break
			}
			resolve(false)
		})
	})
}

let storedPassword = localStorage.getItem('seed')
if (storedPassword) tryConnect(localStorage.getItem('jid'), JSON.parse(atob(storedPassword)))

let jid = ''
let password = ''
</script>

<template>
	<main>
		<h1>{{ config.title }}</h1>
		<form @submit='(e) => { e.preventDefault(); tryConnect(jid, password); }'>
			<label>Username</label>
			<input type='text' :placeholder='config.placeholderJid' v-model='jid'/>
			<label>Password</label>
			<input type='password' v-model='password'/>
			<input type='submit' value='Login'/>
		</form>
	</main>
</template>

<style scoped>
main {
	max-width: 15rem;
	margin: auto;
}
input {
	width: 100%;
	box-sizing: border-box;
}
input[type=submit] {
	margin-top: 1rem;
	display: block;
}
</style>

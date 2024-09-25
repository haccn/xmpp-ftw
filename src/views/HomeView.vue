<script setup lang='ts'>
  import ThemeToggle from '@/components/ThemeToggle.vue'
  import router from '@/router'
  import { useMainStore } from '@/stores/main'
  import { rosterGet, rosterSet } from '@/utils/roster'

  const store = useMainStore()
  const connection = store.connection

  function logout() {
    connection.disconnect()
    localStorage.removeItem('jid')
    localStorage.removeItem('seed')
    router.push({ name: 'login', query: { redirect: '/' }})
  }

  let addContactJid = '';
</script>

<template>
  <aside>
    <ThemeToggle />
    <button @click='logout'>Logout</button>
    <hr>
    <h2>Contacts</h2>
    <button @click='rosterGet'>Refresh</button>
    <ul>
      <li v-for='rosterItem in store.roster.values()'>
        {{ rosterItem.jid }} <span style='opacity:0.5'>({{ rosterItem.subscription }})</span>
        <button @click="() => { rosterItem.subscription = 'remove'; rosterSet(rosterItem) }">del</button>
      </li>
    </ul>
    <input type="text" v-model="addContactJid"/>
    <button @click="() => rosterSet({ jid: addContactJid, subscription: 'none' })">+</button>
    <!--
    <h2>Chats</h2>
    <ul>
      <li v-for='chat in store.chats'>{{ chat.jid }} <span style='opacity:0.5'>({{ contact.subscription }})</span></li>
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

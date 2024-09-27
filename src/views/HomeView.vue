<script setup lang='ts'>
  import ThemeToggle from '@/components/ThemeToggle.vue'
  import router from '@/router'
  import { store } from '@/stores/main'
  import { approveSubscriptionRequest, requestSubscription } from '@/utils/presence';
  import { rosterGet, rosterSet, type RosterItem } from '@/utils/roster'

  let addContactJid = '';

  // TODO: add UI for organizing groups and changing names
  //rosterManager.rosterSet({ jid: addContactJid, name: '', groups: [] })

  function removeContact(rosterItem: RosterItem) {
    rosterItem.subscription = 'remove'
    rosterSet(rosterItem)
  }

  function logout() {
    store.connection.disconnect()
    localStorage.removeItem('jid')
    localStorage.removeItem('seed')
    router.push({ name: 'login', query: { redirect: '/' }})
  }
</script>

<template>
  <aside>
    <ThemeToggle />
    <button @click='logout'>Logout</button>
    <hr>
    <h2>Contacts</h2>
    <button @click='rosterGet'>Refresh</button>
    <ul>
      <li v-for='subscriptionRequest in store.subscriptionRequests'>
        ({{ subscriptionRequest }})
        <button @click="() => approveSubscriptionRequest(subscriptionRequest)">apprv</button>
      </li>
      <li v-for='rosterItem in store.roster.values()'>
        {{ rosterItem.jid }} <span style='opacity:0.5'>({{ rosterItem.ask ? 'pending' : rosterItem.subscription }})</span>
        <button @click="() => removeContact(rosterItem)">del</button>
      </li>
    </ul>
    <input type="text" v-model="addContactJid"/>
    <button @click="() => requestSubscription(addContactJid)">+</button>
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

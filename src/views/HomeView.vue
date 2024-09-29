<script setup lang='ts'>
  import ThemeToggle from '@/components/ThemeToggle.vue'
  import UserStrip from '@/components/UserStrip.vue';
  import router from '@/router'
  import { store } from '@/stores/main'
  import { approveSubscriptionRequest, cancelSubscription, requestSubscription } from '@/utils/presence';
  import { rosterGet } from '@/utils/roster';

  let addContactJid = '';

  // TODO: add UI for organizing groups and changing names
  //rosterManager.rosterSet({ jid: addContactJid, name: '', groups: [] })

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
        <button @click="() => cancelSubscription(subscriptionRequest)">rject</button>
      </li>
      <li v-for='[jid, contact] in store.contacts'>
        <UserStrip
          :jid="jid"
          :name="contact.rosterItem.name"
          :subscription="contact.rosterItem.subscription"
          :presence="contact.presence" />
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

<style scoped>
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
li {
  padding: 0.3rem;
}
aside {
  width: 17rem;
  background: var(--bg-2);
  height: 100%;
  position: fixed;
}
main {
  padding: 1rem;
}
</style>

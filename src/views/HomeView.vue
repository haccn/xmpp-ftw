<script setup lang='ts'>
  import ThemeToggle from '@/components/ThemeToggle.vue'
  import router from '@/router'
  import { useMainStore } from '@/stores/main'
  import { Subscription, type Contact } from '@/utils/types'
  import { $iq, Strophe } from 'strophe.js'

  const store = useMainStore()
  const connection = store.connection

  connection.addHandler((iqStanza: Element) => {
    const rosterItems = convertRosterItems(iqStanza.children[0].children)
    for (const item of rosterItems) {
      console.log(item)
      console.log(item.subscription === Subscription.Remove)
      if (item.subscription === Subscription.Remove) store.contacts.filter((_item) => {
        console.log(_item.jid !== item.jid)
        return _item.jid !== item.jid
      })
      else store.contacts.push(item)
    }
  }, null, 'iq', null);
  console.log(connection.handlers)

  function convertRosterItems(items: HTMLCollection) {
    const contacts = [] as Contact[]
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      contacts.push({
        jid: item.getAttribute('jid') as string,
        subscription: item.getAttribute('subscription') as Subscription,
      })
    }
    return contacts
  }

  // rfc6121
  // ---------------------

  function getRoster() {
    connection.sendIQ(
      $iq({ type: 'get' })
        .c('query', { xmlns: Strophe.NS.ROSTER }),
      (stanza: Element) => {
        store.contacts = convertRosterItems(stanza.children[0].children)
      },
      (stanza: Element | null) => {
        if (stanza) console.error('Error retrieving roster: ' + stanza)
        else console.error('Error retrieving roster')
      }
    )
  }
  getRoster()

  // TODO contact names and grouped contacts

  function addContact(jid: string, _name: string | null = null) {
    connection.sendIQ(
      $iq({ type: 'set' })
        .c('query', { xmlns: Strophe.NS.ROSTER })
          .c('item', { jid }),
      undefined,
      (stanza: Element | null) => {
        if (stanza) console.error('Error adding contact: ' + stanza)
        else console.error('Error adding contact')
      }
    );
  }

  function deleteContact(jid: string) {
    connection.sendIQ(
      $iq({ type: 'set' })
        .c('query', { xmlns: Strophe.NS.ROSTER })
          .c('item', { jid, subscription: Subscription.Remove }),
      undefined,
      (stanza: Element) => {
        if (stanza) console.error('Error adding contact: ' + stanza)
        else console.error('Error adding contact')
      }
    )
  }

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
    <button @click='getRoster'>Refresh</button>
    <ul>
      <li v-for='contact in store.contacts'>
        {{ contact.jid }} <span style='opacity:0.5'>({{ contact.subscription }})</span>
        <button @click="() => deleteContact(contact.jid)">del</button>
      </li>
    </ul>
    <input type="text" v-model="addContactJid"/>
    <button @click="() => addContact(addContactJid)">+</button>
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

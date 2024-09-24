<script setup lang='ts'>
  import { $pres, Strophe } from 'strophe.js'
  import router from '@/router'
  import { useRoute } from 'vue-router'
  import { useMainStore } from '@/stores/main'
  import config from '@/config'

  const store = useMainStore()
  const route = useRoute()

  function tryConnect(jid: string | null, password: string | null) {
    return new Promise(resolve => {
      if (!jid || !password) {
        resolve(false)
        return
      }

      const connection = store.connection
      connection.rawInput = data => console.log('RECV: ' + data)
      connection.rawOutput = data => console.log('SENT: ' + data)
      connection.connect(jid, password, (status: number, condition: string | null, _elem: any) => {
        switch (status) {
          case Strophe.Status.CONNECTED:
            console.log('Connected!')
            //connection.send($pres())
            if (connection.scram_keys !== null) {
              localStorage.setItem('jid', jid)
              localStorage.setItem('seed', btoa(JSON.stringify(connection.scram_keys)))
            }
            else {
              console.error('Failed to save password. No secure mechanism available.' +
                'Please contact the server administrator and request that they add SCRAM support.' +
                '(in Prosody this can be done with mod_auth_internal_hashed)')
            }
            if (route.query.redirect)
              router.push(route.query.redirect as string)
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
  if (storedPassword)
    tryConnect(localStorage.getItem('jid'), JSON.parse(atob(storedPassword)))

  let jid = 'a@hacc.party'
  let password = 'a'
</script>

<template>
  <form @submit='(e) => { e.preventDefault(); tryConnect(jid, password); }'>
    <input type='text' :placeholder='config.placeholder_jid' v-model='jid'/>
    <input type='password' v-model='password'/>
    <input type='submit' value='Login'/>
  </form>
</template>

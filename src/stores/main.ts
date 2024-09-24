import config from '@/config'
import type { Contact } from '@/utils/types'
import { defineStore } from 'pinia'
import { Strophe } from 'strophe.js'

export const useMainStore = defineStore('main', {
  state: () => ({
    connection: new Strophe.Connection(config.transport),
    contacts: [] as Contact[],
  }),
})

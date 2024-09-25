import config from '@/config'
import type { RosterItem } from '@/utils/roster'
import { defineStore } from 'pinia'
import { Strophe } from 'strophe.js'

export const useMainStore = defineStore('main', {
  state: () => ({
    connection: new Strophe.Connection(config.transport),
    roster: new Map<string, RosterItem>,
  }),
})

import config from '@/config'
import type { RosterItem } from '@/utils/roster'
import { Strophe } from 'strophe.js'
import { reactive } from 'vue'

export const store = reactive({
  connection: new Strophe.Connection(config.transport),
  roster: new Map<string, RosterItem>,
  subscriptionRequests: new Array<string>()
})

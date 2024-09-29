import config from '@/config'
import type { Presence } from '@/utils/presence'
import type { RosterItem } from '@/utils/roster'
import { Strophe } from 'strophe.js'
import { reactive } from 'vue'

export const store = reactive({
	connection: new Strophe.Connection(config.transport),
	contacts: new Map<string, { rosterItem: RosterItem, presence?: Presence }>,
	subscriptionRequests: new Array<string>()
})

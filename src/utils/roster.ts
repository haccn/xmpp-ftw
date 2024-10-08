import { $iq, Strophe } from 'strophe.js'
import { $err } from '@/utils/iq'
import { store } from '@/stores/main'

// Expects an element collection like this:
//
//   <item jid='bob@example.com' name='Bob' subscription='from'/>
//   <item jid='jill@example.com' subscription='both'>
//     <group>Friends</group>
//     <group>Coworkers</group>
//   </item>
//   etc...
//
export function convertToRosterItems(items: HTMLCollection) {
	const contacts = [] as RosterItem[]
	for (const item of items) {
		const groups = [] as string[]
		for (const group of item.children) {
			groups.push(group.textContent as string)
		}

		const rosterItem: RosterItem = {
			jid: item.getAttribute('jid') as string,
			subscription: item.getAttribute('subscription') ?? 'none',
			groups
		}
		const name = item.getAttribute('name')
		if (name) rosterItem.name = name
		const ask = item.getAttribute('ask')
		if (ask) rosterItem.ask = ask

		contacts.push(rosterItem)
	}
	return contacts
}

// rfc6121
// ---------------------

export type RosterItem = {
	jid: string;
	name?: string;
	subscription: string;
	groups?: string[];
	ask?: string;
}

// Section 2.1.3
// A "roster get" is a client's request for the server to return the
// roster
export function rosterGet() {
	store.connection.sendIQ(
		$iq({ type: 'get' })
		.c('query', { xmlns: Strophe.NS.ROSTER }),

		(stanza: Element) => {
			const rosterItems = convertToRosterItems(stanza.children[0].children)
			for (const item of rosterItems) {
				store.contacts.set(item.jid, { rosterItem: item })
			}
		},

		(stanza: Element | null) => {
			if (stanza) console.error('Error retrieving roster: ' + stanza.outerHTML)
			else console.error('Error retrieving roster')
		}
	)
}

// Section 2.1.5
// A "roster set" is a client's request for the server to modify (i.e.,
// create, update, or delete) a roster item
export function rosterSet(rosterItem: RosterItem) {
	const connection = store.connection

	// Construct the stanza
	const item: any = {
		jid: rosterItem.jid,
		subscription: rosterItem.subscription
	}
	if (rosterItem.name) item.name = rosterItem.name
	const iq = $iq({ type: 'set' })
		.c('query', { xmlns: Strophe.NS.ROSTER })
		.c('item', item)
	for (const group of rosterItem.groups ?? [])
		iq.c('group').t(group).up()

	// Send the stanza
	connection.sendIQ(
		iq,
		undefined,
		(stanza: Element | null) => {
			if (stanza) console.error('Error adding roster item: ' + stanza.outerHTML)
			else console.error('Error adding roster item')
		}
	)
}

export function initRosterListener() {
	// Section 2.1.6 Roster Push
	// A "roster push" is a newly created, updated, or deleted roster item
	// that is sent from the server to the client
	store.connection.addHandler(
		(stanza: Element) => {
			try { onRosterSet(stanza) }
			finally {
				// Return true to indicate that this handler should remain active
				return true
			}
		},
		Strophe.NS.ROSTER, 'iq', 'set'
	);

	function onRosterSet(stanza: Element) {
		// Assert the stanza is from us or implicitly from us
		const from = stanza.getAttribute('from')
		if (from !== null && from !== store.connection.authzid) {
			const error = `Received alleged roster push from ${from}. Ignoring`
			console.warn(error)
			store.connection.sendIQ($err(stanza.getAttribute('id') as string, error))
			return
		}

		// Assert there is only one child
		if (stanza.children[0].children.length !== 1) {
			const error = `Server returned a roster push with ${stanza.children[0].children.length} items but only 1 is allowed. Ignoring`
			console.warn(error)
			store.connection.sendIQ($err(stanza.getAttribute('id') as string, error))
			return
		}

		// If all is well then add it to our roster
		const rosterItem = convertToRosterItems(stanza.children[0].children)[0]
		if (rosterItem.subscription === 'remove') store.contacts.delete(rosterItem.jid)
		else {
			const contact = store.contacts.get(rosterItem.jid) ?? {} as any
			contact.rosterItem = rosterItem
			store.contacts.set(rosterItem.jid, contact)
		}
	}
}

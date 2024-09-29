import { store } from "@/stores/main";
import { $pres, Strophe } from "strophe.js";
import { getCombinedNodeFlags } from "typescript";

// rfc6121
// ---------------------

// NOTE: 'to' must be the **BARE** JID of the recipient
//
// Section 3.1.1 Client Generation of Outbound Subscription Request
export function requestSubscription(to: string) {
  const existingRosterItem = store.contacts.get(to)
  if (
    existingRosterItem &&
    (existingRosterItem.rosterItem.subscription === 'to' || existingRosterItem.rosterItem.subscription === 'both')
  ) {
    console.log(`You are already subscribed to ${to}`)
    return
  }

  if (to === store.connection.authzid) {
    console.log(`You cannot make a subscription request to yourself`)
    return
  }

  store.connection.sendPresence(
    $pres({ to, type: 'subscribe' }),
    undefined,
    (stanza: Element | null) => {
      if (stanza) console.error('Error requesting subscription: ' + stanza.outerHTML)
      else console.error('Error requesting subscription')
    }
  )

  // Approve any subscription requests from `to`
  approveSubscriptionRequest(to)
}

// Section 3.1 Requesting a Subscription

// NOTE: 'from' must be the **BARE** JID of the user who sent the request
export function approveSubscriptionRequest(from: string) {
  if (!store.subscriptionRequests.includes(from)) {
    console.log(`No subscription request from ${from}. Ignoring approval`)
    return
  }

  store.connection.sendPresence(
    $pres({ to: from, type: 'subscribed' }),
    undefined,
    (stanza: Element | null) => {
      if (stanza) console.error('Error approving subscription request: ' + stanza.outerHTML)
      else console.error('Error approving subscription request')
    }
  )

  store.subscriptionRequests = store.subscriptionRequests
    .filter(subscriptionRequest => subscriptionRequest !== from)
}

export function initPresenceListener() {
  store.connection.addHandler(
    (stanza: Element) => {
      try {
        const type = stanza.getAttribute('type');
        if (type === 'subscribe') onPresenceSubscribe(stanza)
        else if (!type || type === 'unavailable') onPresence(stanza)
      }
      catch (ex: any) {
        console.error(ex)
      }
      finally {
        // Return true to indicate that this handler should remain active
        return true
      }
    },
    null, 'presence', null
  )

  function onPresenceSubscribe(stanza: Element) {
    const to = stanza.getAttribute('to')
    const from = stanza.getAttribute('from')

    if (from !== null) {
      if (to !== store.connection.authzid) {
        console.warn(`Received alleged subscription request from ${from} but it was addressed to ${to}. Ignoring`)
        return
      }

      store.subscriptionRequests.push(from)

      // Auto approve mutual subscription requests.
      // The server is not allowed to do this for us.
      if (store.contacts.has(from)) {
        approveSubscriptionRequest(from)
        return
      }
    }
  }

  function onPresence(stanza: Element) {
    let from = stanza.getAttribute('from')
    if (from?.includes('/') !== true) return
    from = Strophe.getBareJidFromJid(from)
    const contact = store.contacts.get(from)
    if (!contact) return

    const show = stanza.getElementsByTagName('show')[0]
    const status = stanza.getElementsByTagName('status')[0]
    console.warn(store.contacts)
    contact.presence = {
      type: stanza.getAttribute('type') ?? undefined,
      show: show ? show.textContent as Show : undefined,
      status: status ? status.textContent as string : undefined,
    }
    store.contacts.set(from, contact)
    console.warn(store.contacts)
  }
}

// Section 3.2 Canceling a Subscription
// i.e. remove their subscription to your presence, or reject their request

export function cancelSubscription(jid: string) {
  store.connection.sendPresence(
    $pres({ to: jid, type: 'unsubscribed' }),
    undefined,
    (stanza: Element | null) => {
      if (stanza) console.error('Error canceling subscription: ' + stanza.outerHTML)
      else console.error('Error canceling subscription')
    }
  )

  store.subscriptionRequests = store.subscriptionRequests
    .filter(subscriptionRequest => subscriptionRequest !== jid)
}

// Section 3.3 Unsubscribing
// i.e. remove your subscription to their presence

export function unsubscribe(jid: string) {
  const existingRosterItem = store.contacts.get(jid)
  if (existingRosterItem === undefined || existingRosterItem.rosterItem.subscription === 'none') {
    console.log(`You don't have a subscription to ${jid}`)
    return
  }

  store.connection.sendPresence(
    $pres({ to: jid, type: 'unsubscribe' }),
    undefined,
    (stanza: Element | null) => {
      if (stanza) console.error('Error unsubscribing: ' + stanza.outerHTML)
      else console.error('Error unsubscribing')
    }
  )
}

// Section 4.4.1 Client Generation of Subsequent Presence Broadcast
// TODO presence broadcast (changing presence)

// TODO directed presence for non-friend chat and MUC

// Section 4.7 Presence Syntax

export enum Show {
  // Temporarily away
  Away = 'away',
  // Interested in chatting
  Chat = 'chat',
  // Do not disturb
  Dnd = 'dnd',
  // Extended away
  Xa = 'xa',
}

export type Presence = {
  type?: string;
  show?: Show;
  status?: string;
}

// TODO see section 4.7.3 for communication encryption info?

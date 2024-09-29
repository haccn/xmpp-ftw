import { store } from "@/stores/main";
import { $pres } from "strophe.js";

// rfc6121
// ---------------------

// NOTE: 'to' must be the **BARE** JID of the recipient
//
// Section 3.1.1 Client Generation of Outbound Subscription Request
export function requestSubscription(to: string) {
  const existingRosterItem = store.roster.get(to)
  if (
    existingRosterItem &&
    (existingRosterItem.subscription === 'to' || existingRosterItem.subscription === 'both')
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
      try { onPresenceSubscribe(stanza) }
      finally {
        // Return true to indicate that this handler should remain active
        return true
      }
    },
    null, 'presence', 'subscribe'
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
      if (store.roster.has(from)) {
        approveSubscriptionRequest(from)
        return
      }
    }
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
  const existingRosterItem = store.roster.get(jid)
  if (existingRosterItem === undefined || existingRosterItem.subscription === 'none') {
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
  Away,
  // Interested in chatting
  Chat,
  // Do not disturb
  Dnd,
  // Extended away
  Xa,
}

export type Presence = {
  type?: string;
  show?: Show;
  status?: string;
}

// TODO see section 4.7.3 for communication encryption info?

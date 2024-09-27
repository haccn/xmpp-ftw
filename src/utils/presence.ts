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

// Section 3.1.4 Client Processing of Inbound Subscription Request

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

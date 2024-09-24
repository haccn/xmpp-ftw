export enum Subscription {
  None = 'none',
  To = 'to',
  From = 'from',
  Both = 'both',
  Remove = 'remove',
}

export type Contact = {
  jid: string;
  subscription: Subscription;
}

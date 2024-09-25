import { $iq } from "strophe.js";

export function $err(id: string, error: string) {
  return $iq({ id, type: 'error' })
    .c('error').t(error)
}

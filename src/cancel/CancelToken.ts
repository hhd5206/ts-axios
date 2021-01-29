import { Canceler, CancelExector, CancelTokenSource } from '../types'
import Cancel from './Cancel'

interface ReslovePromise {
  (reason?: Cancel): void
}
export default class CancelToken {
  promise: Promise<Cancel>
  reason?: Cancel
  constructor(exector: CancelExector) {
    let reslovePromise: ReslovePromise
    this.promise = new Promise<Cancel>(reslove => {
      reslovePromise = reslove
    })

    exector(message => {
      if (this.reason) {
        return
      }
      this.reason = new Cancel(message)
      reslovePromise(this.reason)
    })
  }

  throwIfRequested() {
    if (this.reason) {
      throw this.reason
    }
  }

  static source(): CancelTokenSource {
    let cancel!: Canceler
    const token = new CancelToken(c => {
      cancel = c
    })
    return {
      cancel,
      token
    }
  }
}

/// <reference path='../../public/types/MessageTypes.d.ts'/>

import MessageBroker from '../../private/MessageBroker'
import {
  packActionInGivenContext,
  packActionInNonTrackingContext
} from '../utils'

const SymbolAnim = Symbol('Animation')

class AnimationController {
  private static MAX_ANIM_NUM = 10000

  private animid = 0
  private untrackAnims: {
    [animid: number]: RecordContext[]
  } = {}

  /* public */

  public addUntrackContextTo(element: Element) {
    const animid = element[SymbolAnim] || this.setAnimIDOnElement(element)
    const context = MessageBroker.getContext()

    if (!this.untrackAnims.hasOwnProperty(animid)) {
      this.untrackAnims[animid] = []
    }
    this.untrackAnims[animid].push(context)
  }

  public getUntrackContextFrom(element: Element): RecordContext {
    if (!element.hasOwnProperty(SymbolAnim)) {
      return
    }
    const untrackList = this.untrackAnims[element[SymbolAnim]]
    // @NOTE: each element will animate by queueing order
    const context = untrackList.shift()

    if (untrackList.length === 0) {
      delete element[SymbolAnim]
    }
    return context
  }

  /* private */

  private setAnimIDOnElement(element: Element): number {
    return element[SymbolAnim] = (this.animid++ % AnimationController.MAX_ANIM_NUM + 1)
  }
}
export const AnimController = new AnimationController()

export function packAnimInGivenContextOnce(
  animFunc: (...args: any[]) => void,
  context: RecordContext
): (...args: any[]) => void {
  return new Proxy(animFunc, {
    apply: function (target, thisArg, argumentList) {
      // @NOTE: when this function is called while queueing (MessageBroker is not empty),
      // it should not send any RecordContextMessage
      const result = MessageBroker.isEmpty()
        ? packActionInGivenContext(target, context).apply(thisArg, argumentList)
        : target.apply(thisArg, argumentList)
      // @NOTE: reset animFunc and ignore already tracked actions (track only once)
      this.apply = packActionInNonTrackingContext(function (target, thisArg, argumentList) {
        return target.apply(thisArg, argumentList)
      })
      return result
    }
  })
}



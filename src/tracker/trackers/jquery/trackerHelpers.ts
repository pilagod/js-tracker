/// <reference path='../../types/RecordMessage.d.ts'/>

import MessageBroker from '../../private/MessageBroker'
import { callActionInGivenContext } from '../utils'

const SymbolAnim = Symbol('Animation')

class AnimationController {
  private static MAX_ANIM_NUM = 10000

  private animid = 0
  private untrackAnims: {
    [animid: number]: RecordContext[]
  } = {}

  /* public */

  public addUntrackContext(element: Element) {
    if (MessageBroker.isEmpty()) {
      return
    }
    const context = MessageBroker.getContext()
    const animid = element[SymbolAnim] || this.setAnimIDOnElement(element)

    if (!this.untrackAnims.hasOwnProperty(animid)) {
      this.untrackAnims[animid] = []
    }
    this.untrackAnims[animid].push(context)
  }

  public getUntrackContext(element: Element): RecordContext {
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

export function callAnimInGivenContextOnce(
  animFunc: (...args: any[]) => void,
  context: RecordContext
): (...args: any[]) => void {
  if (!context) {
    // @NOTE: animFunc here is not a tracking target
    return animFunc
  }
  return new Proxy(animFunc, {
    apply: function (target, thisArg, argumentList) {
      // @NOTE: when this function is called directly while queueing,
      // it should not send any RecordContextMessage
      const result = MessageBroker.isEmpty()
        ? callActionInGivenContext(() => target.apply(thisArg, argumentList), context)
        : target.apply(thisArg, argumentList)
      // @NOTE: reset animFunc and ignore already tracked actions (track only once)
      this.apply = function (target, thisArg, argumentList) {
        return callActionInNonTrackingContext(() => {
          return target.apply(thisArg, argumentList)
        })
      }
      return result
    }
  })
}

export function callActionInNonTrackingContext(actionFunc: () => any) {
  try {
    MessageBroker.startBlocking()
    return actionFunc.call(this)
  } catch (e) {
    throw (e)
  } finally {
    MessageBroker.stopBlocking()
  }
}

export function callActionInTrackingContext(actionFunc: () => any) {
  const isInNonTrackingContext = MessageBroker.isBlocking()

  try {
    if (isInNonTrackingContext) {
      MessageBroker.stopBlocking()
    }
    return actionFunc.call(this)
  } catch (e) {
    throw (e)
  } finally {
    if (isInNonTrackingContext) {
      MessageBroker.startBlocking()
    }
  }
}

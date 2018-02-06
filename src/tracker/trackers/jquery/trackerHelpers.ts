import ActionType from '../../public/ActionType'
import MessageBroker, { ISubscriber } from '../../private/MessageBroker'
import OwnerManager from '../../private/OwnerManager'

const SymbolAnim = Symbol('Animation')

class AnimationAfterFirstTickAddStyleFilter implements ISubscriber {
  private element: Element

  constructor(element: Element) {
    this.element = element
  }

  public flush(messages: RecordMessage[]) {
    MessageBroker.unsubscribe(this)

    const owner = OwnerManager.getOwner(this.element)

    if (owner.hasTrackID()) {
      MessageBroker.addFilter(owner.getTrackID(), ActionType.Style)
    }
  }
}

class AnimationController {
  private static MAX_ANIM_NUM = 10000

  private animid = 0
  private untrackAnims: {
    [animid: number]: RecordSource[]
  } = {}

  /* public */

  public addAnimationFilterAfterFirstTick(element: Element) {
    MessageBroker.subscribe(
      new AnimationAfterFirstTickAddStyleFilter(element)
    )
  }

  public addSourceToUntrackList(element: Element) {
    if (MessageBroker.isEmpty()) {
      return
    }
    const source = MessageBroker.getCurrentSource()
    const animid = element[SymbolAnim] || this.setAnimIDOnElement(element)

    if (!this.untrackAnims.hasOwnProperty(animid)) {
      this.untrackAnims[animid] = []
    }
    this.untrackAnims[animid].push(source)
  }

  public getSourceFromUntrackList(element: Element): RecordSource {
    if (!element.hasOwnProperty(SymbolAnim)) {
      return
    }
    const untrackList = this.untrackAnims[element[SymbolAnim]]
    // @NOTE: each element will animate by queueing order
    const source = untrackList.shift()

    if (untrackList.length === 0) {
      delete element[SymbolAnim]
    }
    return source
  }

  public getSourceFromMessageBroker(): RecordSource {
    return MessageBroker.getCurrentSource()
  }

  public wrapAnimWithSourceMessagesOnce(
    animFunc: (...args: any[]) => void,
    source: RecordSource
  ): (...args: any[]) => void {
    if (!source) {
      // @NOTE: func is not a tracking target
      return animFunc
    }
    return new Proxy(animFunc, {
      apply: function (target, thisArg, argumentList) {
        // @NOTE: when this function is called from jquery queue, 
        // it should not send any RecordSourceMessage
        const shouldReproduce = MessageBroker.isEmpty()

        if (shouldReproduce) {
          MessageBroker.send({ state: 'record_start', data: source })
        }
        const result = target.apply(thisArg, argumentList)

        if (shouldReproduce) {
          MessageBroker.send({ state: 'record_end', data: source })
        }
        // @NOTE: reset func (track only once)
        this.apply = function (target, thisArg, argumentList) {
          return target.apply(thisArg, argumentList)
        }
        return result
      }
    })
  }

  public clearAnimation(element: Element) {
    const owner = OwnerManager.getOwner(element)

    if (owner.hasTrackID()) {
      MessageBroker.removeFilter(owner.getTrackID(), ActionType.Style)
    }
  }

  /* private */

  private setAnimIDOnElement(element: Element): number {
    return element[SymbolAnim] = (this.animid++ % AnimationController.MAX_ANIM_NUM + 1)
  }
}
export default new AnimationController()

/// <reference path='../../types/RecordMessage.d.ts'/>

import ActionType from '../../public/ActionType'
import MessageBroker, { ISubscriber } from '../../private/MessageBroker'
import OwnerManager from '../../private/OwnerManager'
import { recordWrapper } from '../utils'

class AnimationOnFirstTickAddStyleFilter implements ISubscriber {
  private element: Element

  constructor(element: Element) {
    this.element = element
  }

  public flush(messages: RecordMessage[]) {
    const owner = OwnerManager.getOwner(this.element)

    if (!owner.hasTrackID()) {
      return
    }
    MessageBroker.addFilter(owner.getTrackID(), ActionType.Style)
    MessageBroker.unsubscribe(this)
  }
}
const SIMULT_ANIMATION = 1000
const SymbolAnimation = Symbol('Animation')
const trackedApis = ['addClass', 'after', 'ajaxComplete', 'ajaxError', 'ajaxSend', 'ajaxStart', 'ajaxStop', 'ajaxSuccess', 'animate', 'append', 'appendTo', 'attr', 'before', 'bind', 'blur', 'change', 'click', 'contextmenu', 'css', 'dblclick', 'delegate', 'detach', 'die', 'empty', 'error', 'fadeIn', 'fadeOut', 'fadeTo', 'fadeToggle', 'focus', 'focusin', 'focusout', 'height', 'hide', 'hover', 'html', 'innerHeight', 'innerWidth', 'insertAfter', 'insertBefore', 'keydown', 'keypress', 'keyup', 'live', 'load', 'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'off', 'offset', 'on', 'one', 'outerHeight', 'outerWidth', 'prepend', 'prependTo', 'prop', 'ready', 'remove', 'removeAttr', 'removeClass', 'removeProp', 'replaceAll', 'replaceWith', 'resize', 'scroll', 'scrollLeft', 'scrollTop', 'select', 'show', 'slideDown', 'slideToggle', 'slideUp', 'submit', 'text', 'toggle', 'toggleClass', 'trigger', 'triggerHandler', 'unbind', 'undelegate', 'unload', 'unwrap', 'val', 'width', 'wrap', 'wrapAll', 'wrapInner']
const untrackedAnimations: {
  [animationID: number]: RecordWrapMessage[]
} = {}
let animationID = 0

export default (jquery) => {
  // @NOTE: never wrap init !!
  trackedApis.map((api) => {
    jquery.prototype[api] = ((actionFunc) => {
      return function (...args: any[]) {
        return recordWrapper(() => {
          return actionFunc.call(this, ...args)
        })
      }
    })(jquery.prototype[api])
  })
  // @NOTE: process of animation
  // queue -> speed -> queue ? wait : dequeue -> stop ? null : speed.complete -> dequeue

  // @TODO: save wrap in queue
  jquery.prototype.queue = ((queue) => {
    return function (type, data) {
      if (!MessageBroker.isEmpty()) {
        const wrap = MessageBroker.getWrapMessage()

        data = new Proxy(data, {
          apply: function (target, thisArg, argumentList) {
            const shouldReproduce = MessageBroker.isEmpty()

            if (shouldReproduce) {
              MessageBroker.send(wrap)
            }
            const result = target.apply(thisArg, argumentList)

            if (shouldReproduce) {
              MessageBroker.send(Object.assign({}, wrap, { state: 'record_end' }))
            }
            return result
          }
        })

        this.each(function () {
          const element = this
          const animID = element[SymbolAnimation] || (element[SymbolAnimation] = (animationID++ % SIMULT_ANIMATION) + 1)

          if (!untrackedAnimations.hasOwnProperty(animID)) {
            untrackedAnimations[animID] = []
          }
          untrackedAnimations[animID].push(wrap)
        })
      }
      return queue.call(this, type, data)
    }
  })(jquery.prototype.queue)

  jquery.fx.timer = ((fxTimer) => {
    return function (timer) {
      const element = timer.elem
      const animID = element[SymbolAnimation]

      if (!animID) {
        return fxTimer.call(this, timer)
      }
      if (untrackedAnimations[animID].length === 0) {
        delete element[SymbolAnimation]
        return fxTimer.call(this, timer)
      }
      MessageBroker.subscribe(
        new AnimationOnFirstTickAddStyleFilter(element)
      )
      let shouldTrack = true
      const wrap = untrackedAnimations[animID].shift()
      if (untrackedAnimations[animID].length === 0) {
        delete element[SymbolAnimation]
      }
      const proxyTimer = new Proxy(timer, {
        apply: function (target, thisArg, argumentList) {
          const shouldReproduce = MessageBroker.isEmpty()

          if (shouldTrack && shouldReproduce) {
            MessageBroker.send(wrap)
          }
          const result = target.apply(thisArg, argumentList)

          if (shouldTrack && shouldReproduce) {
            MessageBroker.send(Object.assign({}, wrap, { state: 'record_end' }))
          }
          shouldTrack = false
          return result
        }
      })
      return fxTimer.call(this, proxyTimer)
    }
  })(jquery.fx.timer)

  jquery.prototype.stop = ((stop) => {
    return function (...args) {
      const result = stop.apply(this, args)

      this.each(function () {
        const owner = OwnerManager.getOwner(this)

        if (owner.hasTrackID()) {
          MessageBroker.removeFilter(owner.getTrackID(), ActionType.Style)
        }
      })
      return result
    }
  })(jquery.prototype.stop)

  jquery.speed = ((speed) => {
    return function (...args) {
      const opt = speed.apply(this, args)

      opt.complete = new Proxy(opt.complete, {
        apply: function (target, thisArg, argumentList) {
          const owner = OwnerManager.getOwner(thisArg)

          if (owner.hasTrackID()) {
            MessageBroker.removeFilter(owner.getTrackID(), ActionType.Style)
          }
          return target.apply(thisArg, argumentList)
        }
      })
      return opt
    }
  })(jquery.speed)
}

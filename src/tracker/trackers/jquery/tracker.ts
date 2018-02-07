/// <reference path='../../types/RecordMessage.d.ts'/>

import MessageBroker from '../../private/MessageBroker';
import OwnerManager from '../../private/OwnerManager'
import { wrapActionWithSourceMessages } from '../utils'
import { AnimController } from './trackerHelpers'
import ActionType from '../../public/ActionType';

let jquery

export default function main(__jquery__) {
  jquery = __jquery__

  trackGeneralCases()
  trackAnimation()
  trackTriggerHandler(jquery.prototype.triggerHandler)
}

function trackGeneralCases() {
  const trackedApis = ['addClass', 'after', 'ajaxComplete', 'ajaxError', 'ajaxSend', 'ajaxStart', 'ajaxStop', 'ajaxSuccess', 'animate', 'append', 'appendTo', 'attr', 'before', 'bind', 'blur', 'change', 'click', 'contextmenu', 'css', 'dblclick', 'delegate', 'detach', 'die', 'empty', 'error', 'fadeIn', 'fadeOut', 'fadeTo', 'fadeToggle', 'focus', 'focusin', 'focusout', 'height', 'hide', 'hover', 'html', 'innerHeight', 'innerWidth', 'insertAfter', 'insertBefore', 'keydown', 'keypress', 'keyup', 'live', 'load', 'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'off', 'offset', 'on', 'one', 'outerHeight', 'outerWidth', 'prepend', 'prependTo', 'prop', 'ready', 'remove', 'removeAttr', 'removeClass', 'removeProp', 'replaceAll', 'replaceWith', 'resize', 'scroll', 'scrollLeft', 'scrollTop', 'select', 'show', 'slideDown', 'slideToggle', 'slideUp', 'submit', 'text', 'toggle', 'toggleClass', 'trigger', /*'triggerHandler',*/ 'unbind', 'undelegate', 'unload', 'unwrap', 'val', 'width', 'wrap', 'wrapAll', 'wrapInner']
  // @NOTE: never wrap init !!
  trackedApis.map((api) => {
    jquery.prototype[api] = ((actionFunc) => {
      return function (...args: any[]) {
        return wrapActionWithSourceMessages(() => {
          return actionFunc.call(this, ...args)
        })
      }
    })(jquery.prototype[api])
  })
}

function trackAnimation() {
  // @NOTE: process of animation
  // queue -> speed -> is processing ? wait : dequeue -> animating ? wait : timer -> stop ? null : speed.complete -> dequeue -> next animation
  trackAnimationEntryPoint()
  trackAnimationExitPoint()
}

function trackAnimationEntryPoint() {
  trackQueue(jquery.prototype.queue)
  trackTimer(jquery.fx.timer)

  function trackQueue(queue) {
    jquery.prototype.queue = function (type, doAnimation) {
      this.each(function (this: Element) {
        AnimController.addUntrackSource(this)
      })
      // @NOTE: first time call doAnimation will do many other operations,
      // thus doAnimation also need to be wrapped
      return queue.call(
        this,
        type,
        AnimController.wrapAnimWithSourceMessagesOnce(
          doAnimation,
          AnimController.getSourceFromMessageBroker()
        )
      )
    }
  }

  function trackTimer(fxTimer) {
    jquery.fx.timer = function (timer) {
      // @NOTE: timer is where animation actually executing
      AnimController.addAnimationFilterAfterFirstTick(timer.elem)
      return fxTimer.call(
        this,
        AnimController.wrapAnimWithSourceMessagesOnce(
          timer,
          AnimController.getUntrackSource(timer.elem)
        )
      )
    }
  }
}

function trackAnimationExitPoint() {
  trackStop(jquery.prototype.stop)
  trackSpeed(jquery.speed)

  function trackStop(stop) {
    jquery.prototype.stop = function (...args) {
      const result = stop.apply(this, args)

      this.each(function (this: Element) {
        AnimController.clearAnimation(this)
      })
      return result
    }
  }

  function trackSpeed(speed) {
    jquery.speed = function (...args) {
      const opt = speed.apply(this, args)
      // @NOTE: stop api will skip opt.complete
      opt.complete = new Proxy(opt.complete, {
        apply: function (target, thisArg, argumentList) {
          AnimController.clearAnimation(thisArg)
          return target.apply(thisArg, argumentList)
        }
      })
      return opt
    }
  }
}

function trackTriggerHandler(triggerHandler) {
  jquery.prototype.triggerHandler = function (...args) {
    return wrapActionWithSourceMessages(() => {
      MessageBroker.stackMessages()

      const result = triggerHandler.apply(this, args)

      MessageBroker.restoreMessages()

      const owner = OwnerManager.getOwner(this[0])

      if (!owner.hasTrackID()) {
        owner.setTrackID()
      }
      MessageBroker.send({
        state: 'record',
        data: {
          trackid: owner.getTrackID(),
          type: ActionType.Behav | ActionType.Event
        }
      })
    })
  }
}
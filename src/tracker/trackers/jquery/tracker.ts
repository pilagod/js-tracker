/// <reference path='../../types/RecordMessage.d.ts'/>

import AnimationController from './trackerHelpers'
import { wrapActionWithSourceMessages } from '../utils'

export default function main(jquery) {
  trackGeneralCases(jquery)
  trackAnimation(jquery)
}

function trackGeneralCases(jquery) {
  const trackedApis = ['addClass', 'after', 'ajaxComplete', 'ajaxError', 'ajaxSend', 'ajaxStart', 'ajaxStop', 'ajaxSuccess', 'animate', 'append', 'appendTo', 'attr', 'before', 'bind', 'blur', 'change', 'click', 'contextmenu', 'css', 'dblclick', 'delegate', 'detach', 'die', 'empty', 'error', 'fadeIn', 'fadeOut', 'fadeTo', 'fadeToggle', 'focus', 'focusin', 'focusout', 'height', 'hide', 'hover', 'html', 'innerHeight', 'innerWidth', 'insertAfter', 'insertBefore', 'keydown', 'keypress', 'keyup', 'live', 'load', 'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'off', 'offset', 'on', 'one', 'outerHeight', 'outerWidth', 'prepend', 'prependTo', 'prop', 'ready', 'remove', 'removeAttr', 'removeClass', 'removeProp', 'replaceAll', 'replaceWith', 'resize', 'scroll', 'scrollLeft', 'scrollTop', 'select', 'show', 'slideDown', 'slideToggle', 'slideUp', 'submit', 'text', 'toggle', 'toggleClass', 'trigger', 'triggerHandler', 'unbind', 'undelegate', 'unload', 'unwrap', 'val', 'width', 'wrap', 'wrapAll', 'wrapInner']
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

function trackAnimation(jquery) {
  // @NOTE: process of animation
  // queue -> speed -> is processing ? wait : dequeue -> animating ? wait : timer -> stop ? null : speed.complete -> dequeue -> next animation
  trackAnimationEntryPoint(jquery)
  trackAnimationExitPoint(jquery)
}

function trackAnimationEntryPoint(jquery) {
  trackQueue(jquery.prototype.queue)
  trackTimer(jquery.fx.timer)

  function trackQueue(queue) {
    jquery.prototype.queue = function (type, doAnimation) {
      this.each(function (this: Element) {
        AnimationController.addSourceToUntrackList(this)
      })
      // @NOTE: first time call doAnimation will do many other operations,
      // thus doAnimation also need to be wrapped
      return queue.call(
        this,
        type,
        AnimationController.wrapAnimWithSourceMessagesOnce(
          doAnimation,
          AnimationController.getSourceFromMessageBroker()
        )
      )
    }
  }

  function trackTimer(fxTimer) {
    jquery.fx.timer = function (timer) {
      // @NOTE: timer is where animation actually executing
      AnimationController.addAnimationFilterAfterFirstTick(timer.elem)
      return fxTimer.call(
        this,
        AnimationController.wrapAnimWithSourceMessagesOnce(
          timer,
          AnimationController.getSourceFromUntrackList(timer.elem)
        )
      )
    }
  }
}

function trackAnimationExitPoint(jquery) {
  trackStop(jquery.prototype.stop)
  trackSpeed(jquery.speed)

  function trackStop(stop) {
    jquery.prototype.stop = function (...args) {
      const result = stop.apply(this, args)

      this.each(function (this: Element) {
        AnimationController.clearAnimation(this)
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
          AnimationController.clearAnimation(thisArg)
          return target.apply(thisArg, argumentList)
        }
      })
      return opt
    }
  }
}


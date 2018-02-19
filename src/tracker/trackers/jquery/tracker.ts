/// <reference path='../../types/RecordMessage.d.ts'/>

import ActionType from '../../public/ActionType';
import MessageBroker from '../../private/MessageBroker';
import {
  AnimController,
  callAnimInGivenContextOnce,
  callActionInNonTrackingContext,
  callActionInTrackingContext
} from './trackerHelpers'
import {
  callActionInCallerContext,
  callActionInIsolatedContext,
  saveRecordDataTo
} from '../utils'

let jquery

export default function main(__jquery__) {
  jquery = __jquery__

  trackGeneralCases()
  trackAnimation()
  trackEventTriggers()
}

function trackGeneralCases() {
  const trackedApis = ['addClass', 'after', 'ajaxComplete', 'ajaxError', 'ajaxSend', 'ajaxStart', 'ajaxStop', 'ajaxSuccess', 'animate', 'append', 'appendTo', 'attr', 'before', 'bind', 'blur', 'change', 'click', 'contextmenu', 'css', 'dblclick', 'delegate', 'detach', 'die', 'empty', 'error', 'fadeIn', 'fadeOut', 'fadeTo', 'fadeToggle', 'focus', 'focusin', 'focusout', 'height', 'hide', 'hover', 'html', 'innerHeight', 'innerWidth', 'insertAfter', 'insertBefore', 'keydown', 'keypress', 'keyup', 'live', 'load', 'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'off', 'offset', 'on', 'one', 'outerHeight', 'outerWidth', 'prepend', 'prependTo', 'prop', 'ready', 'remove', 'removeAttr', 'removeClass', 'removeProp', 'replaceAll', 'replaceWith', 'resize', 'scroll', 'scrollLeft', 'scrollTop', 'select', 'show', 'slideDown', 'slideToggle', 'slideUp', 'submit', 'text', 'toggle', 'toggleClass', 'trigger', 'triggerHandler', 'unbind', 'undelegate', 'unload', 'unwrap', 'val', 'width', 'wrap', 'wrapAll', 'wrapInner']
  // @NOTE: never wrap jQuery.prototype init !!
  trackedApis.map((api) => {
    jquery.prototype[api] = ((actionFunc) => {
      return function (...args: any[]) {
        return callActionInCallerContext(() => {
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
        AnimController.addUntrackContext(this)
      })
      // @NOTE: first time call doAnimation will do many other operations,
      // thus doAnimation also need to be wrapped
      return queue.call(
        this,
        type,
        callAnimInGivenContextOnce(doAnimation, MessageBroker.getContext())
      )
    }
  }

  function trackTimer(fxTimer) {
    jquery.fx.timer = function (timer) {
      // @NOTE: timer is where animation actually executing
      return fxTimer.call(
        this,
        callAnimInGivenContextOnce(timer, AnimController.getUntrackContext(timer.elem))
      )
    }
  }
}

function trackAnimationExitPoint() {
  trackSpeed(jquery.speed)

  function trackSpeed(speed) {
    jquery.speed = function (...args) {
      const opt = speed.apply(this, args)
      // @NOTE: stop api will skip opt.complete
      opt.complete = new Proxy(opt.complete, {
        apply: function (target, thisArg, argumentList) {
          // @NOTE: complete is called during last animation tick,
          // actions in not first tick will call in non-tracking context,
          // in order to track actions in complete properly, we need to
          // call complete in tracking context
          return callActionInTrackingContext(() => {
            return target.apply(thisArg, argumentList)
          })
        }
      })
      return opt
    }
  }
}

function trackEventTriggers() {
  hookPropEventTriggered()
  trackEventTrigger(jquery.event.trigger)
  trackSpecialTriggers(jquery.event.special)

  function hookPropEventTriggered() {
    // @NOTE: trigger process:
    //  trigger() 
    //  -> call jquery and property handlers 
    //  -> set jQuery.event.triggered to event type (invalidate jquery handlers)
    //  -> call element native behavior (e.g., click(), focus())
    //  -> unset jQuery.event.triggered to undefined (restore jquery handlers)
    let triggered

    Reflect.defineProperty(jquery.event, 'triggered', {
      set: function (value) {
        if (value) {
          // @NOTE: native trigger is about to begin, take out messages 
          // before trigger record process to give native trigger a right source
          MessageBroker.restoreSnapshot()
        } else {
          // @NOTE: native trigger is about to end, put back messages to 
          // continue trigger restore process
          MessageBroker.stackSnapshot()
        }
        triggered = value
      },
      get: function () {
        return triggered
      }
    })
  }

  function trackEventTrigger(trigger) {
    // @NOTE: all trigger methods, like click and mouseenter, are all based on trigger
    jquery.event.trigger = function (event, data, elem, onlyHandlers) {
      const result = callActionInIsolatedContext(() => {
        return trigger.call(this, event, data, elem, onlyHandlers)
      })
      // @NOTE: in jQuery.ajax, it will call event.trigger with no elem for 
      // series of ajax events, we should not track these low-level actions  
      const hasEventTarget = !!elem
      // @NOTE: in order to simulate focusin/out, jquery will directly call 
      // event.trigger (in event.simulate) when focus/blur event happens
      const isCalledByTrackedApi = !MessageBroker.isEmpty()

      if (hasEventTarget && isCalledByTrackedApi) {
        saveRecordDataTo(elem, ActionType.Behav | ActionType.Event)
      }
      return result
    }
  }

  function trackSpecialTriggers(specials: object) {
    ['focus', 'blur', 'click'].map((action: string) => {
      const trigger = specials[action].trigger

      specials[action].trigger = function () {
        return callActionInNonTrackingContext(() => {
          return trigger.call(this)
        })
      }
    })
  }
}
import ActionType from '../../public/ActionType';
import ActionRecorder from '../../private/ActionRecorder'
import {
  AnimController,
  packAnimInGivenContextOnce,
} from './trackerHelpers'
import {
  packActionInCallerContext,
  packActionInIsolatedContext,
  packActionInNonTrackingContext,
  packActionInTrackingContext,
  saveActionDataTo
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
      return packActionInCallerContext(function (...args) {
        return actionFunc.apply(this, args)
      })
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
      if (!ActionRecorder.isRecording()) {
        return queue.call(this, type, doAnimation)
      }
      this.each(function (this: Element) {
        AnimController.addUntrackContextTo(this)
      })
      // @NOTE: first time call doAnimation will do many other operations,
      // thus doAnimation also need to be wrapped
      return queue.call(
        this,
        type,
        packAnimInGivenContextOnce(doAnimation, ActionRecorder.getRecordContext())
      )
    }
  }

  function trackTimer(timer) {
    jquery.fx.timer = function (tick) {
      // @NOTE: timer is where animation actually executing,
      // and it is only used in animation
      return timer.call(
        this,
        packAnimInGivenContextOnce(tick, AnimController.getUntrackContextFrom(tick.elem))
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
        apply: packActionInTrackingContext(function (target, thisArg, argumentList) {
          // @NOTE: complete is called during last animation tick,
          // actions in not first tick will call in non-tracking context,
          // in order to track actions in complete properly, we need to
          // call complete in tracking context
          return target.apply(thisArg, argumentList)
        })
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
          ActionRecorder.restoreSnapshot()
        } else {
          // @NOTE: native trigger is about to end, put back messages to 
          // continue trigger restore process
          ActionRecorder.saveSnapshot()
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
    const isolatedTrigger =
      packActionInIsolatedContext(trigger)

    jquery.event.trigger = function (event, data, elem, onlyHandlers) {
      const result = isolatedTrigger.call(this, event, data, elem, onlyHandlers)
      // @NOTE: in jQuery.ajax, it will call event.trigger with no elem for 
      // series of ajax events, we should not track these low-level actions  
      const hasEventTarget = !!elem
      // @NOTE: in order to simulate focusin/out, jquery will directly call 
      // event.trigger (in event.simulate) when focus/blur event happens
      const isCalledByTrackedApi = ActionRecorder.isRecording()

      if (hasEventTarget && isCalledByTrackedApi) {
        saveActionDataTo(elem, ActionType.Behav | ActionType.Event)
      }
      return result
    }
  }

  function trackSpecialTriggers(specials: object) {
    ['focus', 'blur', 'click'].map((action: string) => {
      // @NOTE: jquery 1.8.2 has no special triggers
      if (specials[action] && specials[action].trigger) {
        specials[action].trigger =
          packActionInNonTrackingContext(specials[action].trigger)
      }
    })
  }
}
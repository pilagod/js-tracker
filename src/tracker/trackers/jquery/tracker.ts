import { recordWrapper } from '../utils'

const apis = ['addClass', 'after', 'ajaxComplete', 'ajaxError', 'ajaxSend', 'ajaxStart', 'ajaxStop', 'ajaxSuccess', 'animate', 'append', 'appendTo', 'attr', 'before', 'bind', 'blur', 'change', 'click', 'contextmenu', 'css', 'dblclick', 'delay', 'delegate', 'detach', 'die', 'empty', 'error', 'fadeIn', 'fadeOut', 'fadeTo', 'fadeToggle', 'finish', 'focus', 'focusin', 'focusout', 'height', 'hide', 'hover', 'html', 'innerHeight', 'innerWidth', 'insertAfter', 'insertBefore', 'keydown', 'keypress', 'keyup', 'live', 'load', 'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'off', 'offset', 'on', 'one', 'outerHeight', 'outerWidth', 'prepend', 'prependTo', 'prop', 'remove', 'removeAttr', 'removeClass', 'removeProp', 'replaceAll', 'replaceWith', 'resize', 'scroll', 'scrollLeft', 'scrollTop', 'select', 'show', 'slideDown', 'slideToggle', 'slideUp', 'stop', 'submit', 'text', 'toggle', 'toggleClass', 'trigger', 'triggerHandler', 'unbind', 'undelegate', 'unload', 'unwrap', 'val', 'width', 'wrap', 'wrapAll', 'wrapInner']

export default (jquery) => {
  // @NOTE: never wrap init !!
  apis.map((api) => {
    jquery.prototype[api] = ((actionFunc) => {
      return function (...args: any[]) {
        return recordWrapper(() => {
          return actionFunc.call(this, ...args)
        })
      }
    })(jquery.prototype[api])
  })
}

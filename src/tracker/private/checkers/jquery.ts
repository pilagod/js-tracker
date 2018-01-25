class JqueryChecker {
  // @NOTE: http://api.jquery.com
  // @NOTE: use below script to fetch all callable apis
  // Array.prototype.slice.call(document.querySelectorAll('.entry-title')).map(function (title) {
  //   var a = title.getElementsByTagName('a')[0];
  //   var regexp = /\.([\w]*?)\(\)/;
  //   var match = regexp.exec(a.innerText)
  //   return match ? match[1] : null
  // }).filter(function (api) { return !!api }).join(', ')
  private apis: string[] = ['addClass', 'after', 'ajaxComplete', 'ajaxError', 'ajaxSend', 'ajaxStart', 'ajaxStop', 'ajaxSuccess', 'animate', 'append', 'appendTo', 'attr', 'before', 'bind', 'blur', 'change', 'click', 'contextmenu', 'css', 'dblclick', 'delay', 'delegate', 'detach', 'die', 'empty', 'error', 'fadeIn', 'fadeOut', 'fadeTo', 'fadeToggle', 'finish', 'focus', 'focusin', 'focusout', 'height', 'hide', 'hover', 'html', 'innerHeight', 'innerWidth', 'insertAfter', 'insertBefore', 'keydown', 'keypress', 'keyup', 'live', 'load', 'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'off', 'offset', 'on', 'one', 'outerHeight', 'outerWidth', 'prepend', 'prependTo', 'prop', 'remove', 'removeAttr', 'removeClass', 'removeProp', 'replaceAll', 'replaceWith', 'resize', 'scroll', 'scrollLeft', 'scrollTop', 'select', 'show', 'slideDown', 'slideToggle', 'slideUp', 'stop', 'submit', 'text', 'toggle', 'toggleClass', 'trigger', 'triggerHandler', 'unbind', 'undelegate', 'unload', 'unwrap', 'val', 'width', 'wrap', 'wrapAll', 'wrapInner']
  private apiDict: { [firstLetter: string]: string[] } = (() => {
    const dict = {}

    this.apis.map((api) => {
      if (!dict.hasOwnProperty(api[0])) {
        dict[api[0]] = []
      }
      dict[api[0]].push(api)
    })
    return dict
  })()

  /* public */

  public check(stackframe: StackTrace.StackFrame) {
    return this.isJqueryCall(stackframe) && (this.isKnownAPI(stackframe) || this.isAnonymousAPI(stackframe))
  }

  /* private */

  private isJqueryCall(stackframe: StackTrace.StackFrame) {
    return (/^jquery/i).test(stackframe.functionName)
  }

  private isKnownAPI(stackframe: StackTrace.StackFrame) {
    // @NOTE: jQUery.fn.init.${api}
    const api = stackframe.functionName.split('.').slice(-1)[0]

    return this.isAPI(api)
  }

  private isAnonymousAPI(stackframe: StackTrace.StackFrame) {
    // @NOTE: jQUery.fn.init.jQuery.fn.(anonymous function) [as show/hide]
    const match = (/\[as (\w+)\]$/i).exec(stackframe.functionName)

    return match && this.isAPI(match[1])
  }

  private isAPI(apiName: string): boolean {
    return (this.apiDict[apiName[0]] || []).indexOf(apiName) >= 0
  }
}
export default ((jqueryChecker) => {
  return function (stackframe: StackTrace.StackFrame) {
    return jqueryChecker.check(stackframe)
  }
})(new JqueryChecker())
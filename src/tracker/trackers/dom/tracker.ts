/// <reference path='../../types/ActionTarget.d.ts'/>

import ActionMap from '../../private/ActionMap'
import Anomalies from '../../private/Anomalies'
import OwnerManager from '../../private/OwnerManager'
import ShadowElement from '../../private/ShadowElement'
import {
  decorators,
  trackTemplate
} from './trackerHelpers'

export default function main() {
  setupShadowElement()
  setupWindow()
  setupDocument()
  trackGeneralCases()
  trackHTMLElementAnomalies()
  trackSVGElementAnomalies()
  trackElementAnomalies()
  trackEventTargetAnomalies()
  trackAttrAnomalies()
  trackNamedNodeMapAnomalies()
}

/* setup custom elements */

function setupShadowElement(): void {
  customElements.define(ShadowElement.TagName, ShadowElement)
}

function setupWindow(): void {
  setupNonElementTarget(window, 'window')
}

function setupDocument(): void {
  setupNonElementTarget(document, 'document')
}

function setupNonElementTarget(target: ActionTarget, name: string): void {
  const infoElementName = `${name}-info`

  customElements.define(
    infoElementName,
    class extends HTMLElement { }
  )
  const infoElement =
    document.createElement(infoElementName)

  OwnerManager.setOwner(target, infoElement)
  document.documentElement.appendChild(infoElement)
}

/* trackGeneralCases */

function trackGeneralCases(): void {
  ActionMap.visit((target) => {
    const proto = window[target].prototype

    Object.getOwnPropertyNames(proto).forEach((action) => {
      if (ActionMap.has(target, action) && !Anomalies.has(target, action)) {
        trackTemplate({ target, action, decorator: decorators.general })
      }
    })
  })
}

/* trackHTMLElementAnomalies */

function trackHTMLElementAnomalies(): void {
  trackDataset()
  trackStyle()
  trackBehaviors()

  function trackDataset(): void {
    trackTemplate({
      target: 'HTMLElement',
      action: 'dataset',
      decorator: decorators.DOMStringMap,
      getter: true
    })
  }

  function trackStyle(): void {
    trackTemplate({
      target: 'HTMLElement',
      action: 'style',
      decorator: decorators.CSSStyleDeclaration,
      getter: true
    })
  }

  function trackBehaviors() {
    ['blur', 'click', 'focus'].map((behav) => {
      trackTemplate({
        target: 'HTMLElement',
        action: behav,
        decorator: decorators.trigger,
        getter: true
      })
    })
  }
}

/* trackElementAnomalies */

function trackSVGElementAnomalies() {
  trackDataset()
  trackStyle()
  trackBehaviors()

  function trackDataset(): void {
    trackTemplate({
      target: 'SVGElement',
      action: 'dataset',
      decorator: decorators.DOMStringMap,
      getter: true
    })
  }

  function trackStyle(): void {
    trackTemplate({
      target: 'SVGElement',
      action: 'style',
      decorator: decorators.CSSStyleDeclaration,
      getter: true
    })
  }

  function trackBehaviors() {
    ['blur', 'focus'].map((behav) => {
      trackTemplate({
        target: 'SVGElement',
        action: behav,
        decorator: decorators.trigger,
        getter: true
      })
    })
  }
}

/* trackElementAnomalies */

function trackElementAnomalies(): void {
  setupOwner()
  trackAttributes()
  trackClassList()
  trackSetAttributeNode()

  function setupOwner(): void {
    OwnerManager.setOwnerByGetter(
      Element.prototype,
      (context: Element) => context
    )
  }

  function trackAttributes(): void {
    trackTemplate({
      target: 'Element',
      action: 'attributes',
      decorator: decorators.NamedNodeMap,
      getter: true
    })
  }

  function trackClassList(): void {
    trackTemplate({
      target: 'Element',
      action: 'classList',
      decorator: decorators.DOMTokenList,
      getter: true
    })
  }

  function trackSetAttributeNode(): void {
    for (let anomaly of [
      'setAttributeNode',
      'setAttributeNodeNS'
    ]) {
      trackTemplate({
        target: 'Element',
        action: anomaly,
        decorator: decorators.setAttributeNode
      })
    }
  }
}

/* trackEventAnomalies */

function trackEventTargetAnomalies() {
  trackDispatchEvent()

  function trackDispatchEvent() {
    trackTemplate({
      target: 'EventTarget',
      action: 'dispatchEvent',
      decorator: decorators.trigger
    })
  }
}

/* trackAttrAnomalies */

function trackAttrAnomalies(): void {
  setupAttr()
  trackValue()

  function setupAttr(): void {
    OwnerManager.setOwnerByGetter(
      Attr.prototype,
      (context: Attr) => context.ownerElement
    )
  }

  function trackValue(): void {
    trackTemplate({
      target: 'Attr',
      action: 'value',
      decorator: decorators.value
    })
  }
}

/* trackNamedNodeMapAnomalies */

function trackNamedNodeMapAnomalies(): void {
  for (let anomaly of [
    'setNamedItem',
    'setNamedItemNS'
  ]) {
    trackTemplate({
      target: 'NamedNodeMap',
      action: anomaly,
      decorator: decorators.setAttributeNode
    })
  }
}
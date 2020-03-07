// @ts-ignore: Ignore import of compiled template
import template from '../templates/components/interact-base';
import Component from '@ember/component';
import { layout, tagName } from '@ember-decorators/component';
import { action } from '@ember/object';

import { assign } from '@ember/polyfills';
import { bind } from '@ember/runloop';
import {
  DOMElement,
  DraggableOptions,
  Interactable, Listener,
  OnEventName,
  ResizableOptions
} from '@interactjs/types/types';
import interact from 'interactjs';

type ActionName =
  'onDragStart' |
  'onDragMove' |
  'onDragInertiaStart' |
  'onDragEnd' |
  'onResizeStart' |
  'onResizeMove' |
  'onResizeInertiaStart' |
  'onResizeEnd' |
  'onGestureStart' |
  'onGestureMove' |
  'onGestureEnd' |
  'onDropActivate' |
  'onDropDeactivate' |
  'onDragEnter' |
  'onDragLeave' |
  'onDropMove' |
  'onDrop' |
  'onDown' |
  'onMove' |
  'onUp' |
  'onCancel' |
  'onTap' |
  'onDoubleTap' |
  'onHold';

const eventActionMap: [OnEventName, ActionName][] = [
  ['dragstart', 'onDragStart'],
  ['dragmove', 'onDragMove'],
  ['draginertiastart', 'onDragInertiaStart'],
  ['dragend', 'onDragEnd'],
  ['resizestart', 'onResizeStart'],
  ['resizemove', 'onResizeMove'],
  ['resizeinertiastart', 'onResizeInertiaStart'],
  ['resizeend', 'onResizeEnd'],
  ['gesturestart', 'onGestureStart'],
  ['gesturemove', 'onGestureMove'],
  ['gestureend', 'onGestureEnd'],
  // drop
  ['dropactivate', 'onDropActivate'],
  ['dropdeactivate', 'onDropDeactivate'],
  ['dragenter', 'onDragEnter'],
  ['dragleave', 'onDragLeave'],
  ['dropmove', 'onDropMove'],
  ['drop', 'onDrop'],
  // pointer events
  ['down', 'onDown'],
  ['move', 'onMove'],
  ['up', 'onUp'],
  ['cancel', 'onCancel'],
  ['tap', 'onTap'],
  ['doubletap', 'onDoubleTap'],
  ['hold', 'onHold']
];

@tagName("")
@layout(template)
export default class InteractBase extends Component {
  draggable: DraggableOptions | boolean = false;
  resizable: ResizableOptions | boolean = false;
  interactable?: Interactable;
  restrictToElement?: DOMElement;

  get _draggable(): DraggableOptions | boolean {
    const orig = this.draggable;
    const defaults: DraggableOptions = {
    };

    if (this.restrictToElement) {
      defaults.restrict = {
        restriction: this.restrictToElement,
        elementRect: { left: 0, right: 1, top: 0, bottom: 1 }
      }
    }

    if (orig === false) {
      return false;
    }
    if (orig === true) {
      return defaults;
    }
    return assign({}, defaults, orig);
  }

  get _resizable(): ResizableOptions | boolean {
    const orig = this.resizable;
    const defaults: ResizableOptions = {
      edges: { left: true, right: true, bottom: true, top: true },
    };

    if (this.restrictToElement) {
      defaults.restrictEdges = {
        outer: this.restrictToElement
      };
    }

    if (orig === false) {
      return false;
    }
    if (orig === true) {
      return defaults;
    }
    return assign({}, defaults, orig);
  }

  @action
  setupInteractable(element: HTMLElement) {
    if (this.interactable) {
      this.interactable.set({
        drag: this._draggable,
        resize: this._resizable,
      });
      return;
    }

    const interactable: Interactable = interact(element)
      .draggable(this._draggable)
      .resizable(this._resizable);

    eventActionMap
      .forEach(([eventName, actionName]) => {
        const fn = this[actionName];
        if (typeof fn === 'function') {
          interactable.on(eventName, bind(this, fn));
        }
      });

    this.interactable = interactable;
  }

  onDragStart?: Listener;
  onDragMove?: Listener;
  onDragInertiaStart?: Listener;
  onDragEnd?: Listener;
  onResizeStart?: Listener;
  onResizeMove?: Listener;
  onResizeInertiaStart?: Listener;
  onResizeEnd?: Listener;
  onGestureStart?: Listener;
  onGestureMove?: Listener;
  onGestureEnd?: Listener;
  onDropActivate?: Listener;
  onDropDeactivate?: Listener;
  onDragEnter?: Listener;
  onDragLeave?: Listener;
  onDropMove?: Listener;
  onDrop?: Listener;
  onDown?: Listener;
  onMove?: Listener;
  onUp?: Listener;
  onCancel?: Listener;
  onTap?: Listener;
  onDoubleTap?: Listener;
  onHold?: Listener;

  onClick(_e: MouseEvent) {}

  @action
  handleClick(e: MouseEvent) {
    this.onClick(e);
  }

  willDestroyElement() {
    if (this.interactable) {
      this.interactable.unset();
    }
  }
}

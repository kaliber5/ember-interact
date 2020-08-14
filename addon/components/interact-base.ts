import Component from '@glimmer/component';
import { action } from '@ember/object';
import { assign } from '@ember/polyfills';
import { bind } from '@ember/runloop';
import { DraggableOptions, Interactable, Listener, ResizableOptions } from '@interactjs/types/typings';
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

const eventActionMap: [string, ActionName][] = [
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

export interface InteractBaseArgs {
  draggable: DraggableOptions | boolean;
  resizable: ResizableOptions | boolean;

  style: object;
  restrictToElement?: HTMLElement;

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
}

export default class InteractBase extends Component<InteractBaseArgs> {
  interactable?: Interactable;

  get _draggable(): DraggableOptions | boolean {
    const orig = this.args.draggable;
    const defaults: DraggableOptions = {
    };

    if (this.args.restrictToElement) {
      // @todo restrict feature needs to be refactored
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      defaults.restrict = {
        restriction: this.args.restrictToElement,
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
    const orig = this.args.resizable;
    const defaults: ResizableOptions = {
      edges: { left: true, right: true, bottom: true, top: true },
    };

    if (this.args.restrictToElement) {
      // @todo restrict feature needs to be refactored
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      defaults.restrictEdges = {
        outer: this.args.restrictToElement
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
        const fn = this.args[actionName];
        if (typeof fn === 'function') {
          interactable.on(eventName, bind(this, fn));
        }
      });

    this.interactable = interactable;
  }

  willDestroyElement() {
    if (this.interactable) {
      this.interactable.unset();
    }
  }
}

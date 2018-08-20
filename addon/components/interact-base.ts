// @ts-ignore: Ignore import of compiled template
import template from 'ember-interact/templates/components/interact-base';
import Component from '@ember/component';
import { attribute, classNames, layout } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import interact, {
  DraggableOptions,
  ResizableOptions,
  Interactable,
  OnEventName,
  Listener
} from 'interactjs';
import { assign } from '@ember/polyfills';
import { bind } from '@ember/runloop';

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

@layout(template)
@classNames('interact')
export default class InteractBase extends Component {
  draggable: DraggableOptions | boolean = this.draggable || false;
  resizable: ResizableOptions | boolean = this.resizable || false;
  interactable?: Interactable;

  @attribute
  style?: string;

  @computed('draggable')
  get _draggable(): ResizableOptions | boolean {
    return this.draggable;
  }

  @computed('resizable')
  get _resizable(): ResizableOptions | boolean {
    let orig = this.resizable;
    let defaults: ResizableOptions = {
      edges: { left: true, right: true, bottom: true, top: true }
    };

    if (orig === false) {
      return false;
    }
    if (orig === true) {
      return defaults;
    }
    return assign({}, defaults, orig);
  }

  setupInteractable() {
    let interactable: Interactable;

    interactable = interact(this.element)
      .draggable(this._draggable)
      .resizable(this._resizable);

    eventActionMap
      .forEach(([eventName, actionName]) => {
        let fn = this[actionName];
        if (typeof fn === 'function') {
          interactable.on(eventName, bind(this, fn))
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

  click(e: MouseEvent) {
    this.onClick(e);
  }

  didInsertElement() {
    this.setupInteractable();
  }

  willDestroyElement() {
    if (this.interactable) {
      this.interactable.unset();
    }
  }
};

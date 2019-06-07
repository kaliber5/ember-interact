import Component from '@ember/component';
// @ts-ignore: Ignore import of compiled template
import template from '../templates/components/interact-widget';
import { layout, tagName } from '@ember-decorators/component';
import { action, computed } from '@ember/object';
import { DraggableOptions, ResizableOptions } from 'interactjs';
import { assign } from '@ember/polyfills';
import { readOnly, reads } from '@ember/object/computed';
import { UpdateParams } from './interact-element';
import { next } from '@ember/runloop';

@tagName('')
@layout(template)
export default class InteractWidget extends Component {
  draggable: DraggableOptions | boolean = false;
  resizable: ResizableOptions | boolean = false;
  selectable: boolean = false;
  selected: boolean = false;

  resizeHandles?: boolean | 'center' | 'corner' = true;

  onChange(_params: UpdateParams) {
  }

  onChangeEnd(_params: UpdateParams) {
  }

  onSelect() {
  }

  onDeselect() {
  }

  @computed('resizeHandles', 'isResizable')
  get hasCenterHandles() {
    let handles = this.resizeHandles;
    return this.isResizable && (handles === true || handles === 'center');
  }

  @computed('resizeHandles', 'isResizable')
  get hasCornerHandles() {
    let handles = this.resizeHandles;
    return this.isResizable && (handles === true || handles === 'corner');
  }

  @computed('selectable', 'selected')
  get showHandles(): boolean {
    return !this.selectable || this.selected;
  }

  @computed('_resizable')
  get isResizable() {
    let resizable = this._resizable;
    return resizable !== false && resizable.enabled !== false;
  }

  @reads('hasCornerHandles') hasUpperLeftHandle?: boolean;
  @reads('hasCornerHandles') hasUpperRightHandle?: boolean;
  @reads('hasCornerHandles') hasLowerLeftHandle?: boolean;
  @reads('hasCornerHandles') hasLowerRightHandle?: boolean;

  @reads('hasCenterHandles') hasTopCenterHandle?: boolean;
  @reads('hasCenterHandles') hasRightCenterHandle?: boolean;
  @reads('hasCenterHandles') hasBottomCenterHandle?: boolean;
  @reads('hasCenterHandles') hasLeftCenterHandle?: boolean;

  @computed('resizable')
  get _resizable(): ResizableOptions | false {
    let orig = this.get('resizable');
    let defaults: ResizableOptions = {
      allowFrom: '.interact__handle',
      margin: 1
    };

    if (orig === false) {
      return false;
    }
    if (orig === true) {
      return defaults;
    }
    return assign({}, defaults, orig);
  }

  @readOnly('draggable') _draggable?: DraggableOptions;

  @action
  select() {
    if (this.selectable) {
      this.onSelect();
    }
  }

  // make this an class field, so this is bound to the instance
  deselect = (event: MouseEvent) => {
    if (this.ignoreDeselect) {
      this.ignoreDeselect = false;
      return;
    }
    if (this.selectable
      && !(event.target instanceof HTMLElement
        && event.target.matches('.interact, .interact *'))
    ) {
      next(this, () => {
        if (!this.isDestroyed
          && !this.isDestroying
          && !event.defaultPrevented) {
          this.onDeselect();
        }
      });
    }
  };

  ignoreDeselect = false;

  validateDeselect = (event: MouseEvent) => {
    if (event.target instanceof HTMLElement && event.target.matches('.interact, .interact *')) {
      this.ignoreDeselect = true
    }
  };

  didInsertElement() {
    document.addEventListener('click', this.deselect, false);
    document.addEventListener('mousedown', this.validateDeselect, true);
  }


  willDestroyElement() {
    document.removeEventListener('click', this.deselect, false);
    document.removeEventListener('mousedown', this.validateDeselect, true);
  }
};

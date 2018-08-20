import Component from '@ember/component';
// @ts-ignore: Ignore import of compiled template
import template from '../templates/components/interact-widget';
import { layout, tagName } from '@ember-decorators/component';
import { action, computed } from '@ember-decorators/object';
import { DraggableOptions, ResizableOptions } from 'interactjs';
import { assign } from '@ember/polyfills';
import { or, readOnly, reads } from '@ember-decorators/object/computed';
import { UpdateParams } from './interact-element';

@tagName('')
@layout(template)
export default class InteractWidget extends Component {
  draggable: DraggableOptions | boolean = this.draggable || false;
  resizable: ResizableOptions | boolean = this.resizable || false;
  selectable: boolean = this.selectable || false;
  selected: boolean = this.selected || false;

  resizeHandles?: boolean | 'center' | 'corner' = this.resizeHandles !== undefined ? this.resizeHandles : true;

  onChange(_params: UpdateParams) {
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

  @or('hasCenterHandles', 'hasCornerHandles') hasHandles?: boolean;

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
      allowFrom: '.interact__handle'
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
    if (this.selectable && !(event.target instanceof HTMLElement &&
      event.target.matches('.interact, .interact *'))) {
      this.onDeselect();
    }
  };

  didInsertElement() {
    document.body.addEventListener('mousedown', this.deselect, true); // use capture phase
  }

  willDestroyElement() {
    document.body.removeEventListener('mousedown', this.deselect, true);
  }
};

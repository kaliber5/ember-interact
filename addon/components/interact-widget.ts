import Component from '@glimmer/component';
import { action } from '@ember/object';
import { assign } from '@ember/polyfills';
import { UpdateParams } from './interact-element';
import { next } from '@ember/runloop';
import { DraggableOptions, ResizableOptions } from '@interactjs/types/types';
import { isArray } from '@ember/array';

export enum handleIdentifiers {
  UPPER_LEFT = 'ul',
  UPPER_RIGHT = 'ur',
  LOWER_LEFT = 'll',
  LOWER_RIGHT = 'lr',
  CENTER_TOP = 'tc',
  CENTER_RIGHT = 'rc',
  CENTER_BOTTOM = 'bc',
  CENTER_LEFT = 'lc'
}

const cornerHandles = [handleIdentifiers.UPPER_LEFT, handleIdentifiers.UPPER_RIGHT, handleIdentifiers.LOWER_LEFT, handleIdentifiers.LOWER_RIGHT];

export interface InteractWidgetArgs {
  draggable: DraggableOptions | boolean;
  resizable: ResizableOptions | boolean;
  selectable: boolean;
  selected: boolean;
  resizeHandles?: boolean | 'center' | 'corner' | handleIdentifiers[];

  x?: number;
  y?: number;
  width?: number;
  height?: number;

  onChange?: (params: UpdateParams) => void;
  onChangeEnd?: (params: UpdateParams) => void;
  onSelect?: () => void;
  onDeselect?: () => void;
}

export default class InteractWidget extends Component<InteractWidgetArgs> {

  get resizeHandles() {
    return this.args.resizeHandles ?? true;
  }

  get hasCenterHandles(): boolean {
    const handles = this.resizeHandles;
    return (this.isResizable && handles === true || handles === 'center');
  }

  get hasCornerHandles(): boolean {
    const handles = this.resizeHandles;
    return (this.isResizable && handles === true || handles === 'corner');
  }

  get showHandles(): boolean {
    return !this.args.selectable || this.args.selected;
  }

  get isResizable(): boolean {
    const resizable = this._resizable;
    return resizable !== false && resizable.enabled !== false;
  }

  get hasUpperLeftHandle(): boolean {
    return this.hasHandle(handleIdentifiers.UPPER_LEFT);
  }

  get hasUpperRightHandle(): boolean {
    return this.hasHandle(handleIdentifiers.UPPER_RIGHT);
  }

  get hasLowerLeftHandle(): boolean {
    return this.hasHandle(handleIdentifiers.LOWER_LEFT);
  }

  get hasLowerRightHandle(): boolean {
    return this.hasHandle(handleIdentifiers.LOWER_RIGHT);
  }

  get hasTopCenterHandle(): boolean {
    return this.hasHandle(handleIdentifiers.CENTER_TOP);
  }

  get hasRightCenterHandle(): boolean {
    return this.hasHandle(handleIdentifiers.CENTER_RIGHT);
  }

  get hasBottomCenterHandle(): boolean {
    return this.hasHandle(handleIdentifiers.CENTER_BOTTOM);
  }

  get hasLeftCenterHandle(): boolean {
    return this.hasHandle(handleIdentifiers.CENTER_LEFT);
  }

  private hasHandle(handleId: handleIdentifiers): boolean {
    return (isArray(this.args.resizeHandles) && this.args.resizeHandles.includes(handleId)) || (cornerHandles.includes(handleId) ? this.hasCornerHandles : this.hasCenterHandles);
  }

  get _resizable(): ResizableOptions | false {
    const orig = this.args.resizable;
    const defaults: ResizableOptions = {
      allowFrom: '.interact__handle', margin: 1
    };

    if (orig === false) {
      return false;
    }
    if (orig === true) {
      return defaults;
    }
    return assign({}, defaults, orig);
  }

  get _draggable(): DraggableOptions | boolean {
    return this.args.draggable;
  }

  @action select(): void {
    if (this.args.selectable) {
      this.args.onSelect?.();
    }
  }

  @action deselect(event: MouseEvent): void {
    if (this.ignoreDeselect) {
      this.ignoreDeselect = false;
      return;
    }
    if (this.args.selectable && !(event.target instanceof HTMLElement && event.target.matches('.interact, .interact *'))) {
      next(this, () => {
        if (!this.isDestroyed && !this.isDestroying && !event.defaultPrevented) {
          this.args.onDeselect?.();
        }
      });
    }
  }

  ignoreDeselect = false;

  @action validateDeselect(event: MouseEvent): void {
    if (event.target instanceof HTMLElement && event.target.matches('.interact, .interact *')) {
      this.ignoreDeselect = true;
    }
  }
}

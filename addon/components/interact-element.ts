// @ts-ignore: Ignore import of compiled template
import template from '../templates/components/interact-element';
import Component from '@ember/component';
import { layout, tagName } from '@ember-decorators/component';
import { action, computed } from '@ember/object';
import { htmlSafe } from '@ember/string';
import { DraggableOptions, ResizableOptions, ResizeEvent, InteractEvent } from '@interactjs/types/types';

export interface UpdateParams {
  x: number;
  y: number;
  width: number;
  height: number;
}

@tagName('')
@layout(template)
export default class InteractElement extends Component {

  draggable: DraggableOptions | boolean = false;
  resizable: ResizableOptions | boolean = false;

  x?: number;
  y?: number;
  width?: number;
  height?: number;

  @computed('x')
  get _x() {
    return this.x || 0;
  }
  set _x(_value) {
    // @ts-ignore
    return _value;
  }

  @computed('y')
  get _y() {
    return this.y || 0;
  }
  set _y(_value) {
    // @ts-ignore
    return _value;
  }

  @computed('width')
  get _width() {
    return this.width || 100;
  }
  set _width(_value) {
    // @ts-ignore
    return _value;
  }

  @computed('height')
  get _height() {
    return this.height || 100;
  }
  set _height(_value) {
    // @ts-ignore
    return _value;
  }

  @computed('_x', '_y', '_width', '_height')
  get style() {
    return htmlSafe(`transform: translate3d(${this._x}px, ${this._y}px, 0); width: ${this._width}px; height: ${this._height}px`);
  }

  onChange(_params: UpdateParams) {
  }

  onChangeEnd(_params: UpdateParams) {
  }

  update(params: UpdateParams) {
    const { x: _x, y: _y, width: _width, height: _height } = params;
    this.setProperties({
      _x,
      _y,
      _width,
      _height
    });
    this.onChange(params);
  }

  @action
  onMove(e: InteractEvent) {
    this.update({
      x: this._x + e.dx,
      y: this._y + e.dy,
      width: this._width,
      height: this._height
    });
  }

  @action
  onResize(event: ResizeEvent) {
    if (event.deltaRect) {
      this.update({
        x: this._x + event.deltaRect.left,
        y: this._y + event.deltaRect.top,
        width: event.rect.width,
        height: event.rect.height
      });
    }
  }

  @action
  onInteractEnd(_e: InteractEvent) {
    this.onChangeEnd({
      x: this._x,
      y: this._y,
      width: this._width,
      height: this._height
    });
  }
}

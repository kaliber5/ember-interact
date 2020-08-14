import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { DraggableOptions, InteractEvent, ResizableOptions, ResizeEvent } from '@interactjs/types/typings';

export interface UpdateParams {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface InteractElementArgs {
  draggable?: DraggableOptions | boolean;
  resizable?: ResizableOptions | boolean;

  x?: number;
  y?: number;
  width?: number;
  height?: number;

  onChange?: (params: UpdateParams) => void;
  onChangeEnd?: (params: UpdateParams) => void;
}

export default class InteractElement extends Component<InteractElementArgs> {

  @tracked __x?: number;
  @tracked __y?: number;
  @tracked __width?: number;
  @tracked __height?: number;

  get _x() {
    return this.__x ?? this.args.x ?? 0;
  }
  set _x(value) {
    this.__x = value;
  }

  get _y() {
    return this.__y ?? this.args.y ?? 0;
  }
  set _y(value) {
    this.__y = value
  }

  get _width() {
    return this.__width ?? this.args.width ?? 100;
  }
  set _width(value) {
    this.__width = value;
  }

  get _height() {
    return this.__height ?? this.args.height ?? 100;
  }
  set _height(value) {
    this.__height = value;
  }

  get style() {
    return {
      transform: `translate3d(${this._x}px, ${this._y}px, 0)`,
      width: `${this._width}px`,
      height: `${this._height}px`
    };
  }

  update(params: UpdateParams) {
    const { x: _x, y: _y, width: _width, height: _height } = params;
    this._x = _x;
    this._y = _y;
    this._width = _width;
    this._height = _height;
    this.args.onChange?.(params);
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
    this.args.onChangeEnd?.({
      x: this._x,
      y: this._y,
      width: this._width,
      height: this._height
    });
  }
}

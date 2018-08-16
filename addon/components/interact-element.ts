// @ts-ignore: Ignore import of compiled template
import template from 'ember-interact/templates/components/interact-element';
import Component from '@ember/component';
import { attribute, classNames, layout } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import interact, { DraggableOptions, ResizableOptions, InteractEvent } from 'interactjs';
import { assign } from '@ember/polyfills';
import { htmlSafe } from "@ember/string";
import { bind } from '@ember/runloop';

@layout(template)
@classNames('interact-element')
export default class InteractElement extends Component {
  draggable: DraggableOptions | boolean = this.draggable || false;
  resizable: ResizableOptions | boolean = this.resizable || false;

  x: number = this.x || 0;
  y: number = this.y || 0;

  width: number = this.width || 100;
  height: number = this.height || 100;

  // @computed('draggable')
  // get _draggable(): DraggableOptions | boolean {
  //   let orig = this.get('draggable');
  //   let defaults: DraggableOptions = {
  //   };
  //
  //   if (orig === false) {
  //     return false;
  //   }
  //   if (orig === true) {
  //     return defaults;
  //   }
  //   return assign({}, defaults, orig);
  // }

  @computed('resizable')
  get _resizable(): ResizableOptions | boolean {
    let orig = this.get('draggable');
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

  @attribute
  @computed('x', 'y', 'width', 'height')
  get style() {
    return htmlSafe(`transform: translate(${this.x}px, ${this.y}px); width: ${this.width}px; height: ${this.height}px`);
  }

  setupInteractable() {
    interact(this.element)
      .draggable(this.get('draggable'))
      .resizable(this.get('_resizable'))
      .on('dragmove', bind(this, this.onMove))
      .on('resizemove', bind(this, this.onResize));
  }

  didInsertElement() {
    this.setupInteractable();
  }

  onMove(e: InteractEvent) {
    this.setProperties({
        x: this.get('x') + e.dx,
        y: this.get('y') + e.dy
    });
  }

  onResize(event: InteractEvent) {
    this.setProperties({
      x: this.get('x') + event.deltaRect.left,
      y: this.get('y') + event.deltaRect.top,
      width: event.rect.width,
      height: event.rect.height
    });
  }
};

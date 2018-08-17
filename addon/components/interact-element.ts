// @ts-ignore: Ignore import of compiled template
import template from 'ember-interact/templates/components/interact-element';
import Component from '@ember/component';
import { layout, tagName } from '@ember-decorators/component';
import { action, computed } from '@ember-decorators/object';
import { DraggableOptions, ResizableOptions, InteractEvent } from 'interactjs';
import { htmlSafe } from "@ember/string";

@tagName('')
@layout(template)
export default class InteractElement extends Component {
  draggable: DraggableOptions | boolean = this.draggable || false;
  resizable: ResizableOptions | boolean = this.resizable || false;

  // @todo make these strictly one-way
  x: number = this.x || 0;
  y: number = this.y || 0;
  width: number = this.width || 100;
  height: number = this.height || 100;

  @computed('x', 'y', 'width', 'height')
  get style() {
    return htmlSafe(`transform: translate(${this.x}px, ${this.y}px); width: ${this.width}px; height: ${this.height}px`);
  }

  @action
  onMove(e: InteractEvent) {
    this.setProperties({
        x: this.get('x') + e.dx,
        y: this.get('y') + e.dy
    });
  }

  @action
  onResize(event: InteractEvent) {
    this.setProperties({
      x: this.get('x') + event.deltaRect.left,
      y: this.get('y') + event.deltaRect.top,
      width: event.rect.width,
      height: event.rect.height
    });
  }
};

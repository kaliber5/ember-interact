// @ts-ignore: Ignore import of compiled template
import template from 'ember-interact/templates/components/interact-element';
import Component from '@ember/component';
import { attribute, classNames, layout } from '@ember-decorators/component';
import { computed } from '@ember-decorators/object';
import interact, { DraggableOptions, InteractEvent } from 'interactjs';
import { assign } from '@ember/polyfills';
import { htmlSafe } from "@ember/string";

@layout(template)
@classNames('interact-element')
export default class InteractElement extends Component {
  draggable: DraggableOptions | boolean = this.draggable || false;

  x: number = 0;
  y: number = 0;

  @computed('draggable')
  get _draggable(): DraggableOptions | boolean {
    let orig = this.get('draggable');
    let defaults: DraggableOptions = {
      onmove: (e) => this.onMove(e)
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
  @computed('x', 'y')
  get style() {
    return htmlSafe(`transform: translate(${this.x}px, ${this.y}px)`);
  }

  setupInteractable() {
    interact(this.element)
      .draggable(this.get('_draggable'));
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
};

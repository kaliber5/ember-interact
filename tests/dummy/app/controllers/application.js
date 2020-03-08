import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class ApplicationController extends Controller {
  x = 100;
  y = 100;
  width = 300;
  height = 200;
  selected = false;

  @action
  reset() {
    this.setProperties({
      x: 100,
      y: 100,
      width: 300,
      height: 200
    });
  }

  @action
  update(params) {
    this.setProperties(params);
  }

  @action
  noop(e) {
    if (e) {
      e.stopPropagation();
    }
  }

}

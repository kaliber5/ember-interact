import Controller from '@ember/controller';

export default Controller.extend({
  x: 100,
  y: 100,
  width: 300,
  height: 200,

  actions: {
    reset() {
      this.setProperties({
        x: 100,
        y: 100,
        width: 300,
        height: 200
      });
    },

    update(params) {
      this.setProperties(params);
    }
  }

})

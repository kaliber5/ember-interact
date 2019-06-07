'use strict';

module.exports = {
  name: require('./package').name,
  included(app) {
    this._super.included.apply(this, arguments);

    let hasSass = !!app.registry.availablePlugins['ember-cli-sass'];

    // Don't include the precompiled css file if the user has Sass
    if (!hasSass) {
      this.import('vendor/ember-interact.css');
    }
  }
};

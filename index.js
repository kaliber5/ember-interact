'use strict';

module.exports = {
  name: '@kaliber5/ember-interact',
  included(app) {
    this._super.included.apply(this, arguments);

    let hasSass = !!app.registry.availablePlugins['ember-cli-sass'];

    // Don't include the precompiled css file if the user has Sass
    if (!hasSass) {
      this.import('vendor/ember-interact.css');
    }
  }
};

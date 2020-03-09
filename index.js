'use strict';

module.exports = {
  name: require('./package').name,
  included(app) {
    // eslint-disable-next-line prefer-rest-params
    this._super.included.apply(this, arguments);

    const hasSass = !!app.registry.availablePlugins['ember-cli-sass'];

    // Don't include the precompiled css file if the user has Sass
    if (!hasSass) {
      this.import('vendor/ember-interact.css');
    }
  }
};

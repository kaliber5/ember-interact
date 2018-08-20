import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | interact-canvas', function(hooks) {
  setupRenderingTest(hooks);

  test('it yields components', async function(assert) {
    await render(hbs`
      {{#interact-canvas as |canvas|}}
        {{canvas.base}}
        {{canvas.element}}
        {{canvas.widget}}
      {{/interact-canvas}}
    `);

    assert.dom('.interact').exists({ count: 3 });
  });
});

import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | interact-element', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders as a block', async function(assert) {
    await render(hbs`
      {{#interact-element}}
        template block text
      {{/interact-element}}
    `);

    assert.dom('.interact').hasText('template block text');
  });

  test('it receives position and scale props', async function(assert) {
    await render(hbs`{{interact-element x=10 y=20 width=50 height=200}}`);

    let rect = find('.interact').getBoundingClientRect();

    assert.equal(rect.left, 10);
    assert.equal(rect.top, 20);
    assert.equal(rect.width, 50);
    assert.equal(rect.height, 200);
  });

});

import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { click, find, render, triggerEvent, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { setupSinonSinoff } from 'ember-sinon-sinoff/test-support';
import { handleIdentifiers } from '@kaliber5/ember-interact/components/interact-widget';

module('Integration | Component | interact-widget', function(hooks) {
  setupRenderingTest(hooks);
  setupSinonSinoff(hooks);

  test('it renders as a block', async function(assert) {
    await render(hbs`
      {{#interact-widget}}
        template block text
      {{/interact-widget}}
    `);

    assert.dom('.interact').hasText('template block text');
  });

  test('it receives position and scale props', async function(assert) {
    await render(hbs`{{interact-widget x=10 y=20 width=50 height=200}}`);

    const el = find('.interact');
    const rect = el.getBoundingClientRect();

    assert.equal(rect.left, 10);
    assert.equal(rect.top, 20);
    assert.equal(el.clientWidth, 50);
    assert.equal(el.clientHeight, 200);
  });

  test('renders handles', async function(assert) {
    await render(hbs`{{interact-widget resizable=true resizeHandles=resizeHandles}}`);

    this.set('resizeHandles', false);
    await settled();
    assert.dom('.interact__handle').doesNotExist();

    this.set('resizeHandles', true);
    await settled();
    assert.dom('.interact__handle').exists({ count: 8 });
    assert.dom('.interact__handle--center').exists({ count: 4 });
    assert.dom('.interact__handle--corner').exists({ count: 4 });

    this.set('resizeHandles', 'corner');
    await settled();
    assert.dom('.interact__handle').exists({ count: 4 });
    assert.dom('.interact__handle--corner').exists({ count: 4 });

    this.set('resizeHandles', 'center');
    await settled();
    assert.dom('.interact__handle').exists({ count: 4 });
    assert.dom('.interact__handle--center').exists({ count: 4 });

    for (const id of Object.values(handleIdentifiers)) {
      this.set('resizeHandles', [id]);
      await settled();
      assert.dom('.interact__handle').exists({ count: 1 });
      assert.dom(`.interact__handle--${id}`).exists({ count: 1 });
    }
  });

  test('it can be selected and deselected', async function(assert) {
    this.set('selected', false);
    await render(hbs`{{interact-widget selectable=true selected=selected}}`);

    assert.dom('.interact').hasNoClass('interact--selected');
    this.set('selected', true);
    await settled();
    assert.dom('.interact').hasClass('interact--selected');
  });

  test('it calls onSelect and onDeselect', async function(assert) {
    const select = this.sandbox.spy();
    this.set('select', select);
    const deselect = this.sandbox.spy();
    this.set('deselect', deselect);
    await render(hbs`{{interact-widget selectable=true onSelect=select onDeselect=deselect}}`);

    await triggerEvent('.interact', 'pointerdown');
    assert.ok(select.calledOnce, 'onSelect action has been called.');

    await click(document.body);
    assert.ok(deselect.calledOnce, 'onDeselect action has been called.');
  });

  test('it hides handles when deselected ', async function(assert) {
    this.set('selected', false);
    await render(hbs`{{interact-widget resizable=true selectable=true selected=selected}}`);

    assert.dom('.interact__handle').doesNotExist();

    this.set('selected', true);
    assert.dom('.interact__handle').exists({ count: 8 });

    this.set('selected', false);
    assert.dom('.interact__handle').doesNotExist();
  });
});

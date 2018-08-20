import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { find, render, click, settled } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { run } from '@ember/runloop';
import { setupSinonSandbox } from 'ember-sinon-sandbox/test-support';

module('Integration | Component | interact-widget', function(hooks) {
  setupRenderingTest(hooks);
  setupSinonSandbox(hooks);

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

    let el = find('.interact');
    let rect = el.getBoundingClientRect();

    assert.equal(rect.left, 10);
    assert.equal(rect.top, 20);
    assert.equal(el.clientWidth, 50);
    assert.equal(el.clientHeight, 200);
  });

  test('renders handles', async function(assert) {
    await render(hbs`{{interact-widget resizable=true resizeHandles=resizeHandles}}`);
    assert.dom('.interact__handle').exists({ count: 8 });
    assert.dom('.interact__handle--center').exists({ count: 4 });
    assert.dom('.interact__handle--corner').exists({ count: 4 });

    run(() => this.set('resizeHandles', false));
    await settled();
    assert.dom('.interact__handle').doesNotExist();

    run(() => this.set('resizeHandles', true));
    await settled();
    assert.dom('.interact__handle').exists({ count: 8 });
    assert.dom('.interact__handle--center').exists({ count: 4 });
    assert.dom('.interact__handle--corner').exists({ count: 4 });

    run(() => this.set('resizeHandles', 'corner'));
    await settled();
    assert.dom('.interact__handle').exists({ count: 4 });
    assert.dom('.interact__handle--corner').exists({ count: 4 });

    run(() => this.set('resizeHandles', 'center'));
    await settled();
    assert.dom('.interact__handle').exists({ count: 4 });
    assert.dom('.interact__handle--center').exists({ count: 4 });
  });

  test('it can be selected and deselected', async function(assert) {
    this.set('selected', false);
    await render(hbs`{{interact-widget selectable=true selected=selected}}`);

    assert.dom('.interact').hasNoClass('interact--selected');
    run(() => this.set('selected', true));
    assert.dom('.interact').hasClass('interact--selected');
  });

  test('it calls onSelected and onDeselcted', async function(assert) {
    let select = this.sandbox.spy();
    this.set('select', select);
    let deselect = this.sandbox.spy();
    this.set('deselect', deselect);
    await render(hbs`{{interact-widget selectable=true onSelect=select onDeselect=deselect}}`);

    await click('.interact');
    assert.ok(select.calledOnce, 'onSelect action has been called.');

    await click(document.body);
    assert.ok(deselect.calledOnce, 'onDeselect action has been called.');
  });
});

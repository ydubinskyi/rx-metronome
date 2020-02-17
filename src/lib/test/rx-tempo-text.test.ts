import {expect, fixture, html} from '@open-wc/testing';

import {RxTempoTextElement} from '../rx-tempo-text.element';

describe('rx-tempo-text', () => {
  it('works', async () => {
    const el = await fixture(html`
      <rx-tempo-text></rx-tempo-text>
    `);

    expect(el).to.be.ok;
  });
});

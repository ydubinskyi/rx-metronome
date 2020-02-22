import {expect, fixture, html} from '@open-wc/testing';

import {RxTempoTextElement} from './rx-tempo-text.element';

describe('rx-tempo-text', () => {
  let element: RxTempoTextElement;

  it('works', async () => {
    element = await fixture(html`
      <rx-tempo-text></rx-tempo-text>
    `);

    expect(element).to.be.ok;
  });
});

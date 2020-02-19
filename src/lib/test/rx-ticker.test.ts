import {expect, fixture, html} from '@open-wc/testing';

import {RxTickerElement} from '../rx-ticker.element';

describe('rx-ticker', () => {
  let element: RxTickerElement;

  it('works', async () => {
    element = await fixture(html`
      <rx-ticker></rx-ticker>
    `);

    expect(element).to.be.ok;
  });
});

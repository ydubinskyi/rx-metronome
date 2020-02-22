import {expect} from '@open-wc/testing';

import {RxTickerElement} from './rx-ticker.element';

describe('rx-ticker', () => {
  let element: RxTickerElement;

  beforeEach(() => {
    element = new RxTickerElement();
  });

  it('works', async () => {
    expect(element).to.be.ok;
  });

  it('properly generate items', async () => {
    element.beatsPerBar = 4;

    expect(element.items).to.be.deep.equal([0, 1, 2, 3]);
  });
});

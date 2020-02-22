import {expect} from '@open-wc/testing';

import {MyAppElement} from './app.element';

describe('my-app', () => {
  let element: MyAppElement;

  beforeEach(() => {
    element = new MyAppElement();
  });

  it('works', async () => {
    expect(element).to.be.ok;
  });
});

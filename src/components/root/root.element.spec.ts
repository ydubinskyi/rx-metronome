import {expect} from '@open-wc/testing';

import {AppRootElement} from './root.element';

describe('my-app', () => {
  let element: AppRootElement;

  beforeEach(() => {
    element = new AppRootElement();
  });

  it('works', () => {
    expect(element).to.be.ok;
  });
});

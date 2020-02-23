import {expect} from '@open-wc/testing';
import {stub} from 'sinon';

import {AppRootElement} from './root.element';

describe('my-app', () => {
  let element: AppRootElement;

  beforeEach(() => {
    element = new AppRootElement();
  });

  it('works', () => {
    expect(element).to.be.ok;
  });

  describe('toggleDarkMode', () => {
    beforeEach(() => {
      stub(element, 'changeThemeColor');
      stub(localStorage, 'setItem');
    });

    it('should toggle darkTheme prop', () => {
      element.darkTheme = false;

      element.toggleDarkMode();

      expect(element.darkTheme).to.equal(true);
    });
  });
});

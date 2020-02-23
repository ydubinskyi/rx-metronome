import {expect} from '@open-wc/testing';
import {restore, stub} from 'sinon';

import {AppRootElement} from './root.element';

describe('my-app', () => {
  let element: AppRootElement;

  beforeEach(() => {
    element = new AppRootElement();
  });

  afterEach(() => {
    restore();
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

  describe('firstUpdated', () => {
    it('should set dark theme properly', () => {
      element.darkTheme = true;
      stub(localStorage, 'getItem').returns('light');

      element.firstUpdated();

      expect(element.darkTheme).to.equal(false);
    });

    it('should set dark theme to true, if no theme saved in local storage', () => {
      element.darkTheme = false;
      stub(localStorage, 'getItem').returns(undefined);

      element.firstUpdated();

      expect(element.darkTheme).to.equal(true);
    });
  });
});

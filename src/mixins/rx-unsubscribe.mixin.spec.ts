import {expect} from '@open-wc/testing';
import {restore, stub} from 'sinon';

import {BaseClass} from '../test-utils';
import {RxUnsubscribeMixin} from './rx-unsubscribe.mixin';

class ClassWithMixin extends RxUnsubscribeMixin(BaseClass as any) {
  constructor() {
    super();
  }
}

describe('RxUnsubscribeMixin', () => {
  let instance: ClassWithMixin;

  beforeEach(() => {
    instance = new ClassWithMixin();
  });

  afterEach(() => {
    restore();
  });

  it('works', () => {
    expect(instance).to.be.ok;
  });

  describe('disconnectedCallback', () => {
    it('should complete unsubscribe subject', () => {
      stub(instance.unsubscribe$, 'next');
      stub(instance.unsubscribe$, 'complete');

      instance.disconnectedCallback();

      expect(instance.unsubscribe$.next).to.be.called;
      expect(instance.unsubscribe$.complete).to.be.called;
    });
  });
});

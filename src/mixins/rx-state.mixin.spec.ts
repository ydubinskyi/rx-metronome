import {expect} from '@open-wc/testing';
import {restore, stub} from 'sinon';

import {BaseClass} from '../test-utils';
import {RxStateMixin} from './rx-state.mixin';

class ClassWithMixin extends RxStateMixin(BaseClass as any) {
  constructor() {
    super();
  }
}

describe('RxStateMixin', () => {
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
});

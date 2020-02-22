import {LitElement} from 'lit-element';
import {Subject} from 'rxjs';

import {Constructor} from './types';

export function RxUnsubscribeMixin<TBase extends Constructor<LitElement>>(Base: TBase) {
  class Mixin extends Base {
    protected unsubscribe$ = new Subject();

    public disconnectedCallback() {
      this.unsubscribe$.next();
      this.unsubscribe$.complete();

      super.disconnectedCallback();
    }
  }

  return Mixin;
}

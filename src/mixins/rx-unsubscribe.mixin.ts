import { LitElement } from 'lit';
import { Subject } from 'rxjs';

import { Constructor } from '../types';

export declare class RxUnsubscribeMixinInterface {
  public unsubscribe$: Subject<unknown>;
}

export function RxUnsubscribeMixin<TBase extends Constructor<LitElement>>(superClass: TBase) {
  class Mixin extends superClass {
    public unsubscribe$ = new Subject();

    public disconnectedCallback() {
      this.unsubscribe$.next(null);
      this.unsubscribe$.complete();

      super.disconnectedCallback();
    }
  }

  return Mixin as Constructor<RxUnsubscribeMixinInterface> & TBase;
}

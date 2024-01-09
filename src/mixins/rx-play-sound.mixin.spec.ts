// import { expect } from '@open-wc/testing';
// import { restore, stub } from 'sinon';

// import { BaseClass } from '../test-utils';
// import { RxPlaySoundMixin } from './rx-play-sound.mixin';

// class ClassWithMixin extends RxPlaySoundMixin(BaseClass as any) {
//   constructor() {
//     super();
//   }
// }

// describe('RxPlaySoundMixin', () => {
//   let instance: ClassWithMixin;

//   beforeEach(() => {
//     instance = new ClassWithMixin();
//   });

//   afterEach(() => {
//     restore();
//   });

//   it('works', () => {
//     expect(instance).to.be.ok;
//   });

//   describe('disconnectedCallback', () => {
//     it('should stop audio context', () => {
//       stub(instance.audioContext, 'close');

//       instance.disconnectedCallback();

//       expect(instance.audioContext.close).to.be.called;
//     });
//   });
// });
export {};

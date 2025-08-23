import { createTimeline } from 'animejs';

export class ModalAnimation {
  constructor() {
    this.openAnimation = null;
    this.closeAnimation = null;
  }

  setModal(modal) {
    this.modal = modal;
    return this;
  }

  setOverlay(modalOverlay) {
    this.modalOverlay = modalOverlay;
    return this;
  }

  open() {
    if (this.closeAnimation) this.closeAnimation.pause();

    this.modalOverlay.style.display = 'flex';

    this.openAnimation = createTimeline({
      easing: 'easeInOutCubic',
      duration: 1200,
    });

    this.openAnimation
      .add({
        targets: this.modalOverlay,
        opacity: [0, 1],
        duration: 500,
        easing: 'easeOutExpo',
      })
      .add(
        {
          targets: this.modal,
          opacity: [0, 1],
          scale: [0.95, 1],
          rotateY: ['45deg', '0deg'],
          filter: ['blur(16px)', 'blur(0px)'],
        },
        '-=400'
      );
  }

  close() {
    if (this.openAnimation) this.openAnimation.pause();

    this.closeAnimation = createTimeline({
      easing: 'easeInOutCubic',
      duration: 1200,
      complete: () => {
        this.modalOverlay.style.display = 'none';
      },
    });

    this.closeAnimation
      .add({
        targets: this.modal,
        opacity: [1, 0],
        scale: [1, 0.95],
        rotateY: ['0deg', '45deg'],
        filter: ['blur(0px)', 'blur(16px)'],
      })
      .add(
        {
          targets: this.modalOverlay,
          opacity: [1, 0],
          duration: 500,
          easing: 'easeInExpo',
        },
        '-=1100'
      );
  }
}
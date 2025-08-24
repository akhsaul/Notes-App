import { createTimeline, waapi } from 'animejs';

export class ModalAnimation {
  constructor() {
    this.openAnimation = null;
    this.closeAnimation = null;
  }

  setModal(modal) {
    this.modal = modal;

    // required attributes
    this.modal.style.backgroundColor = 'transparent';
    this.modal.style.transformStyle = 'preserve-3d';

    // create an overlay as a backdrop
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.style.opacity = 0;
    // assign before modal
    this.modal.before(overlay);
    this.modalOverlay = overlay;

    return this;
  }

  open() {
    // sometime user trigger open too fast
    // while 'close animation' still playing
    // so we have to stop and free previous animation
    // to prevent glitch
    if (this.closeAnimation) {
      // stop previous close animation
      // and free up memory
      this.closeAnimation.cancel();
      this.closeAnimation = null;
    }

    const animation = createTimeline({
      defaults: {
        ease: 'inOutCubic',
        duration: 1200,
        autoplay: false,
      },
      onBegin: () => {
        this.modal.showModal();
      },
    });

    animation
      .add(this.modalOverlay, {
        opacity: [0, 1],
        duration: 500,
        ease: 'outExpo',
      })
      .add(
        this.modal,
        {
          opacity: [0, 1],
          filter: ['blur(10px)', 'blur(0px)'],
          perspective: ['500px', '500px'],
          scale: [0.95, 1],
          translateZ: ['-100px', '0px'],
          rotateX: ['5deg', '0deg'],
          rotateY: ['25deg', '0deg'],
        },
        '-=400'
      );

    this.openAnimation = animation;
    this.openAnimation.play();
  }

  /**
   * Close the modal with animation. use onComplete to run function when animation is complete
   * @param {Function} onComplete a Function to call when the animation is complete
   */
  close(onComplete) {
    // sometime user trigger close too fast
    // while 'open animation' still playing
    // so we have to stop and free previous animation
    // to prevent glitch
    if (this.openAnimation) {
      // stop previous open animation
      // and free up memory
      this.openAnimation.cancel();
      this.openAnimation = null;
    }

    const animation = createTimeline({
      defaults: {
        ease: 'inOutCubic',
        duration: 1200,
        autoplay: false,
      },
      onComplete: () => {
        this.modal.close();
        if (onComplete) onComplete();
      },
    });

    animation
      .add(this.modal, {
        opacity: [1, 0],
        filter: ['blur(0px)', 'blur(10px)'],
        perspective: ['500px', '500px'],
        scale: [1, 0.95],
        translateZ: ['0px', '-100px'],
        rotateX: ['0deg', '5deg'],
        rotateY: ['0deg', '25deg'],
      })
      .add(
        this.modalOverlay,
        {
          opacity: [1, 0],
          duration: 500,
          ease: 'inExpo',
        },
        '-=1100'
      );

    this.closeAnimation = animation;
    this.closeAnimation.play();
  }
}

import { createTimeline, waapi, eases } from 'animejs';

export class ModalAnimation {
  constructor() {
    this.openTimeline = null;
    this.closeTimeline = null;
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
    if (this.closeTimeline) {
      // stop previous close animation
      // and free up memory
      this.closeTimeline.cancel();
      this.closeTimeline = null;
    }

    const timeline = createTimeline({
      defaults: {
        ease: eases.inOutCubic,
        duration: 1200,
        autoplay: false,
      },
      onBegin: () => {
        this.modal.showModal();
      },
    });

    const overlayAnimation = waapi.animate(this.modalOverlay, {
      autoplay: false,
      opacity: [0, 1],
      duration: 500,
      ease: eases.outExpo,
    });

    const modalAnimation = waapi.animate(this.modal, {
      autoplay: false,
      opacity: [0, 1],
      filter: ['blur(10px)', 'blur(0px)'],
      perspective: ['500px', '500px'],
      scale: [0.95, 1],
      translateZ: ['-100px', '0px'],
      rotateX: ['5deg', '0deg'],
      rotateY: ['25deg', '0deg'],
    });

    timeline.sync(overlayAnimation).sync(modalAnimation, '-=400');

    this.openTimeline = timeline;
    this.openTimeline.play();
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
    if (this.openTimeline) {
      // stop previous open animation
      // and free up memory
      this.openTimeline.cancel();
      this.openTimeline = null;
    }

    const timeline = createTimeline({
      defaults: {
        ease: eases.inOutCubic,
        duration: 1200,
        autoplay: false,
      },
      onComplete: () => {
        this.modal.close();
        if (onComplete) onComplete();
      },
    });

    const modalAnimation = waapi.animate(this.modal, {
      autoplay: false,
      opacity: [1, 0],
      filter: ['blur(0px)', 'blur(10px)'],
      perspective: ['500px', '500px'],
      scale: [1, 0.95],
      translateZ: ['0px', '-100px'],
      rotateX: ['0deg', '5deg'],
      rotateY: ['0deg', '25deg'],
    });

    const overlayAnimation = waapi.animate(this.modalOverlay, {
      autoplay: false,
      opacity: [1, 0],
      duration: 500,
      ease: eases.inExpo,
    });
    timeline.sync(modalAnimation).sync(overlayAnimation, '-=1100');

    this.closeTimeline = timeline;
    this.closeTimeline.play();
  }
}

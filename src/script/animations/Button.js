import { animate } from 'animejs';

export class ButtonAnimation {
  constructor() {
    this.button = undefined;
    this.startText = 'Hold to confirm';
    this.processingText = 'Processing...';
    this.holdDuration = 3000;
  }

  setButton(button) {
    this.button = button;
    return this;
  }

  setStartText(text) {
    this.startText = text;
    return this;
  }

  setProcessingText(text) {
    this.processingText = text;
    return this;
  }

  setHoldDuration(duration) {
    this.holdDuration = duration;
    return this;
  }

  apply() {
    if (!this.button) {
      console.error('Button not set for animation.');
      return;
    }

    const originalText = this.button.textContent.trim();
    this.button.innerHTML = '';

    const btnFill = document.createElement('div');
    btnFill.classList.add('button-fill');

    const btnText = document.createElement('span');
    btnText.classList.add('button-text');
    btnText.textContent = this.startText || originalText;

    this.button.appendChild(btnFill);
    this.button.appendChild(btnText);
    this.button.classList.add('delete-button');

    let pressTimer = null;
    let fillAnimation = null;

    const confirmAction = () => {
      this.button.dispatchEvent(new CustomEvent('confirm', { bubbles: true }));
    };

    const startHold = (e) => {
      e.preventDefault();
      if (fillAnimation) {
        fillAnimation.pause();
      }
      this.button.classList.add('is-holding');

      fillAnimation = animate({
        targets: btnFill,
        width: '100%',
        duration: this.holdDuration,
        easing: 'linear',
      });

      pressTimer = setTimeout(confirmAction, this.holdDuration);
      btnText.textContent = this.processingText;
    };

    const cancelHold = () => {
      clearTimeout(pressTimer);
      pressTimer = null;
      this.button.classList.remove('is-holding');

      if (fillAnimation) {
        fillAnimation.pause();
      }

      animate({
        targets: btnFill,
        width: '0%',
        duration: 400,
        easing: 'easeOutExpo',
      });

      btnText.textContent = this.startText || originalText;
    };

    this.button.addEventListener('mousedown', startHold);
    this.button.addEventListener('touchstart', startHold, { passive: true });

    document.addEventListener('mouseup', cancelHold);
    this.button.addEventListener('mouseleave', cancelHold);
    document.addEventListener('touchend', cancelHold);
  }
}

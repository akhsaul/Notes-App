import { animate } from 'animejs';

export class ButtonAnimation {
  constructor() {
    this.button = undefined;
    this.startText = 'Hold to confirm';
    this.processingText = 'Processing...';
    this.holdDuration = 3000;
    this._startHold = null;
    this._cancelHold = null;
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
      this.button.dispatchEvent(
        new CustomEvent('delete-confirmed', { bubbles: true })
      );
    };

    this._startHold = (e) => {
      e.preventDefault();
      if (fillAnimation) {
        fillAnimation.pause();
      }
      this.button.classList.add('is-holding');

      fillAnimation = animate(btnFill, {
        width: '100%',
        duration: this.holdDuration,
        ease: 'linear',
      });

      pressTimer = setTimeout(confirmAction, this.holdDuration);
      btnText.textContent = this.processingText;
    };

    this._cancelHold = () => {
      clearTimeout(pressTimer);
      pressTimer = null;
      this.button.classList.remove('is-holding');

      if (fillAnimation) {
        fillAnimation.pause();
      }

      animate(btnFill, {
        width: '0%',
        duration: 400,
        ease: 'outExpo',
      });

      btnText.textContent = this.startText || originalText;
    };

    this.button.addEventListener('mousedown', this._startHold);
    this.button.addEventListener('touchstart', this._startHold, {
      passive: true,
    });

    document.addEventListener('mouseup', this._cancelHold);
    this.button.addEventListener('mouseleave', this._cancelHold);
    document.addEventListener('touchend', this._cancelHold);
    document.body.addEventListener('mouseleave', this._cancelHold);
  }

  destroy() {
    this.button.removeEventListener('mousedown', this._startHold);
    this.button.removeEventListener('touchstart', this._startHold);
    document.removeEventListener('mouseup', this._cancelHold);
    this.button.removeEventListener('mouseleave', this._cancelHold);
    document.removeEventListener('touchend', this._cancelHold);
    document.body.removeEventListener('mouseleave', this._cancelHold);
  }
}

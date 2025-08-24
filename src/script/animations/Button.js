import { eases, animate } from 'animejs';

export class ButtonAnimation {
  constructor() {
    this.button = undefined;
    this.startText = 'Hold to confirm';
    this.processingText = 'Processing...';
    this.holdDuration = 3000;
    this._startHold = null;
    this._cancelHold = null;
    this.isInitialized = false;
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

    if (this.isInitialized) {
      console.warn('Button animation already applied.');
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

    let fillAnimation = null;

    const startHold = (e) => {
      e.preventDefault();
      if (fillAnimation) {
        fillAnimation.cancel();
      }

      // enter transition for text
      btnText.style.transition = `color 500ms ease`;

      fillAnimation = animate(btnFill, {
        width: '100%',
        duration: this.holdDuration,
        ease: eases.linear(),
        onComplete: () => {
          this.button.dispatchEvent(
            new CustomEvent('delete-confirmed', { bubbles: true })
          );
        },
      });

      btnText.textContent = this.processingText;
    };

    const cancelHold = () => {
      // exit transition for text
      btnText.style.transition = `color ${this.holdDuration}ms ease`;

      if (fillAnimation) {
        fillAnimation.cancel();
      }

      fillAnimation = animate(btnFill, {
        width: '0%',
        duration: this.holdDuration,
        ease: eases.outExpo,
      });

      btnText.textContent = this.startText || originalText;
    };

    // starting only when user press the button element
    this.button.addEventListener('pointerdown', startHold);

    // cancel when user release input (mouse, touch, etc) in any element
    document.addEventListener('pointerup', cancelHold);
    this.isInitialized = true;
  }
}

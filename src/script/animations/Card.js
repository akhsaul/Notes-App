import { createTimeline, stagger, waapi, eases, animate, utils } from 'animejs';

export class CardAnimation {
  constructor() {
    this.timeline = null;
  }

  addBorderPulseAnimation(card) {
    let hoverAnimation = null;
    const duration = 1000;
    card.style.border = 'var(--border) solid transparent';

    card.addEventListener('mouseenter', () => {
      if (hoverAnimation) {
        hoverAnimation.restart();
        return;
      }
      const target = { progress: 0 };
      const startColor = utils.get(card, '--color-base-100');
      const targetColor = utils.get(card, '--color-accent');

      hoverAnimation = animate(target, {
        progress: 100,
        onRender: (anim) => {
          const t = (anim.currentTime % duration) / duration;
          // Switch to target halfway through, then back — no interpolation
          const color = t < 0.5 ? startColor : targetColor;
          card.style.borderColor = color;
        },
        autoplay: true,
        duration: duration,
        loop: true,
        ease: eases.inOutQuad,
      });
    });

    card.addEventListener('mouseleave', () => {
      if (hoverAnimation) {
        hoverAnimation.cancel();
      }
      card.style.borderColor = 'transparent';
    });
  }

  /**
   *
   * @param {Array<Element>} cardElements
   */
  add(cardElements) {
    if (this.timeline) {
      this.timeline.cancel();
      this.timeline = null;
    }
    // Now, create a single timeline to animate them
    const timeline = createTimeline({
      defaults: {
        autoplay: false,
      },
    });

    cardElements.forEach((card, i) => {
      const slideStartTime = i * 500;
      const swingStartTime = slideStartTime + 1000;

      this.addBorderPulseAnimation(card);

      const slideAnimation = waapi.animate(card, {
        autoplay: false,
        opacity: [0, 1],
        translateX: [100, 0],
        duration: 1000,
        ease: eases.outExpo,
      });

      const swingAnimation = waapi.animate(card, {
        autoplay: false,
        rotate: [0, 15, -10, 5, -5, 0],
        transformOrigin: ['top center', 'top center'],
        duration: 1000,
        delay: stagger(80),
        ease: eases.inOutQuad,
      });

      timeline
        .sync(slideAnimation, slideStartTime)
        .sync(swingAnimation, swingStartTime);
    });

    this.timeline = timeline;
    timeline.play();
  }
}

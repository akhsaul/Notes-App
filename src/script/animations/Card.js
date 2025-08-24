import { createTimeline } from 'animejs';

export class CardAnimation {
  /**
   *
   * @param {Array<Element>} cardElements
   */
  add(cardElements) {
    // Now, create a single timeline to animate them
    const tl = createTimeline();
    cardElements.forEach((card, i) => {
      const slideStartTime = i * 500;
      const swingStartTime = slideStartTime + 1000;

      tl.add(
        card,
        {
          opacity: [0, 1],
          translateX: [100, 0],
          duration: 1000,
          ease: 'outExpo',
        },
        slideStartTime
      ).add(
        card,
        {
          rotate: [0, 15, -10, 5, -5, 0],
          transformOrigin: ['top center', 'top center'],
          duration: 1000,
          delay: stagger(80),
          ease: 'inOutQuad',
        },
        swingStartTime
      );
    });
    tl.play();
  }
}

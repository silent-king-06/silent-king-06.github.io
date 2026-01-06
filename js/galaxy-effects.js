/**
 * 🌊 GRAVITY RIPPLE - Performance-First Click Effect
 * Pure CSS animation triggered by lightweight JS
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    outerColor: 'rgba(5, 217, 232, 0.4)',   // Cyan
    innerColor: 'rgba(157, 78, 221, 0.3)',  // Purple
    outerSize: 60,
    innerSize: 30,
    duration: 600
  };

  /**
   * Creates a ripple element at the click position
   */
  function createRipple(x, y, size, color) {
    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    ripple.style.cssText = `
      left: ${x - size / 2}px;
      top: ${y - size / 2}px;
      width: ${size}px;
      height: ${size}px;
      border: 2px solid ${color};
      background: transparent;
    `;
    return ripple;
  }

  /**
   * Handle click events
   */
  function handleClick(e) {
    const x = e.clientX;
    const y = e.clientY;

    // Create outer ring (cyan)
    const outerRipple = createRipple(x, y, CONFIG.outerSize, CONFIG.outerColor);
    document.body.appendChild(outerRipple);

    // Create inner ring (purple) with slight delay
    setTimeout(() => {
      const innerRipple = createRipple(x, y, CONFIG.innerSize, CONFIG.innerColor);
      document.body.appendChild(innerRipple);
      
      // Cleanup inner
      setTimeout(() => innerRipple.remove(), CONFIG.duration);
    }, 50);

    // Cleanup outer
    setTimeout(() => outerRipple.remove(), CONFIG.duration);
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    document.addEventListener('click', handleClick);
    console.log('🌊 Gravity Ripple initialized');
  }

})();

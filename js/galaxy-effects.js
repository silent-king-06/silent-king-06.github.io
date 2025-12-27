/**
 * 🪐 SOLAR SYSTEM CURSOR EFFECTS
 * - Cursor becomes Jupiter with orbiting moons
 * - Click to explode planets outward
 */

(function() {
  'use strict';

  // Hide default cursor
  const style = document.createElement('style');
  style.textContent = `
    * { cursor: none !important; }
    a, button, [role="button"], input, select, textarea { cursor: none !important; }
  `;
  document.head.appendChild(style);

  // ==========================================
  // 🪐 PLANET DEFINITIONS
  // ==========================================
  
  const PLANETS = {
    jupiter: {
      radius: 18,
      colors: ['#c9a86c', '#d4b483', '#a67c52', '#8b6914', '#e6d5a8'],
      bands: 6
    },
    saturn: {
      radius: 14,
      color: '#e6d5a8',
      ringColor: '#c9a86c'
    },
    mars: {
      radius: 8,
      color: '#c1440e'
    },
    earth: {
      radius: 9,
      colors: ['#1e90ff', '#228b22', '#1e90ff', '#228b22']
    },
    venus: {
      radius: 8,
      color: '#ffd700'
    },
    neptune: {
      radius: 10,
      color: '#4169e1'
    },
    uranus: {
      radius: 9,
      color: '#40e0d0'
    },
    mercury: {
      radius: 5,
      color: '#a9a9a9'
    },
    moon: {
      radius: 4,
      color: '#d3d3d3'
    }
  };

  // ==========================================
  // 🌌 MAIN CANVAS
  // ==========================================
  
  class SolarSystemCursor {
    constructor() {
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.mouse = { x: -100, y: -100 };
      this.moons = [];
      this.explosions = [];
      this.stars = [];
      
      this.init();
    }

    init() {
      this.canvas.id = 'solar-cursor';
      this.canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 99999;
      `;
      document.body.appendChild(this.canvas);
      
      this.resize();
      window.addEventListener('resize', () => this.resize());
      
      // Track mouse
      document.addEventListener('mousemove', (e) => {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
      });
      
      // Click to explode
      document.addEventListener('click', (e) => {
        this.createExplosion(e.clientX, e.clientY);
      });
      
      // Create orbiting moons
      this.createMoons();
      
      // Create background stars
      this.createStars();
      
      this.animate();
    }

    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.createStars();
    }

    createStars() {
      this.stars = [];
      const count = Math.floor((this.canvas.width * this.canvas.height) / 10000);
      
      for (let i = 0; i < count; i++) {
        this.stars.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          size: Math.random() * 1.5 + 0.5,
          twinkle: Math.random() * Math.PI * 2,
          speed: 0.02 + Math.random() * 0.02
        });
      }
    }

    createMoons() {
      // Create 4 moons orbiting Jupiter cursor
      const moonConfigs = [
        { radius: 35, speed: 0.03, size: 4, color: '#ffd700' },  // Io
        { radius: 45, speed: 0.02, size: 5, color: '#d3d3d3' },  // Europa
        { radius: 58, speed: 0.015, size: 6, color: '#a9a9a9' }, // Ganymede
        { radius: 72, speed: 0.01, size: 5, color: '#8b7355' }   // Callisto
      ];
      
      moonConfigs.forEach((config, i) => {
        this.moons.push({
          ...config,
          angle: (Math.PI * 2 / 4) * i,
          trail: []
        });
      });
    }

    createExplosion(x, y) {
      const explosion = {
        x, y,
        planets: [],
        rings: [],
        startTime: Date.now()
      };
      
      // Create exploding planets
      const planetTypes = ['mars', 'earth', 'venus', 'neptune', 'uranus', 'mercury', 'saturn'];
      const numPlanets = 8 + Math.floor(Math.random() * 5);
      
      for (let i = 0; i < numPlanets; i++) {
        const angle = (Math.PI * 2 / numPlanets) * i + Math.random() * 0.5;
        const speed = 3 + Math.random() * 4;
        const type = planetTypes[Math.floor(Math.random() * planetTypes.length)];
        
        explosion.planets.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          type,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.1,
          scale: 0.5 + Math.random() * 0.8,
          life: 1,
          trail: []
        });
      }
      
      // Create expanding rings
      for (let i = 0; i < 3; i++) {
        explosion.rings.push({
          radius: 0,
          maxRadius: 100 + i * 40,
          speed: 4 + i * 1.5,
          color: ['#ffd700', '#ff6b6b', '#4ecdc4'][i],
          life: 1
        });
      }
      
      // Create sparkle particles
      for (let i = 0; i < 30; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 5;
        explosion.planets.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          type: 'spark',
          size: 2 + Math.random() * 3,
          color: ['#fff', '#ffd700', '#ff6b6b', '#4ecdc4'][Math.floor(Math.random() * 4)],
          life: 1
        });
      }
      
      this.explosions.push(explosion);
    }

    drawJupiter(x, y) {
      const r = PLANETS.jupiter.radius;
      
      // Glow effect
      const glow = this.ctx.createRadialGradient(x, y, r * 0.5, x, y, r * 2.5);
      glow.addColorStop(0, 'rgba(201, 168, 108, 0.4)');
      glow.addColorStop(0.5, 'rgba(201, 168, 108, 0.1)');
      glow.addColorStop(1, 'transparent');
      this.ctx.fillStyle = glow;
      this.ctx.beginPath();
      this.ctx.arc(x, y, r * 2.5, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Main body
      const gradient = this.ctx.createLinearGradient(x - r, y - r, x + r, y + r);
      gradient.addColorStop(0, '#e6d5a8');
      gradient.addColorStop(0.3, '#c9a86c');
      gradient.addColorStop(0.5, '#d4b483');
      gradient.addColorStop(0.7, '#a67c52');
      gradient.addColorStop(1, '#8b6914');
      
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(x, y, r, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Jupiter's bands
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(x, y, r, 0, Math.PI * 2);
      this.ctx.clip();
      
      const bandColors = ['#d4b483', '#c9a86c', '#a67c52', '#8b6914', '#d4b483', '#c9a86c'];
      const bandHeight = r * 2 / bandColors.length;
      
      bandColors.forEach((color, i) => {
        this.ctx.fillStyle = color;
        this.ctx.globalAlpha = 0.6;
        this.ctx.fillRect(x - r, y - r + i * bandHeight, r * 2, bandHeight);
      });
      
      // Great Red Spot
      this.ctx.globalAlpha = 0.8;
      this.ctx.fillStyle = '#c1440e';
      this.ctx.beginPath();
      this.ctx.ellipse(x + r * 0.3, y + r * 0.2, r * 0.35, r * 0.2, 0, 0, Math.PI * 2);
      this.ctx.fill();
      
      this.ctx.restore();
      
      // Highlight
      this.ctx.globalAlpha = 0.3;
      const highlight = this.ctx.createRadialGradient(x - r * 0.4, y - r * 0.4, 0, x, y, r);
      highlight.addColorStop(0, '#fff');
      highlight.addColorStop(1, 'transparent');
      this.ctx.fillStyle = highlight;
      this.ctx.beginPath();
      this.ctx.arc(x, y, r, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.globalAlpha = 1;
    }

    drawPlanet(x, y, type, scale = 1, rotation = 0) {
      const planet = PLANETS[type];
      if (!planet) return;
      
      const r = planet.radius * scale;
      
      this.ctx.save();
      this.ctx.translate(x, y);
      this.ctx.rotate(rotation);
      
      // Glow
      const glow = this.ctx.createRadialGradient(0, 0, r * 0.5, 0, 0, r * 2);
      glow.addColorStop(0, `${planet.color || planet.colors?.[0]}66`);
      glow.addColorStop(1, 'transparent');
      this.ctx.fillStyle = glow;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, r * 2, 0, Math.PI * 2);
      this.ctx.fill();
      
      if (type === 'earth') {
        // Earth with continents
        const earthGrad = this.ctx.createRadialGradient(-r * 0.3, -r * 0.3, 0, 0, 0, r);
        earthGrad.addColorStop(0, '#4da6ff');
        earthGrad.addColorStop(1, '#1e90ff');
        this.ctx.fillStyle = earthGrad;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, r, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Continents
        this.ctx.fillStyle = '#228b22';
        this.ctx.beginPath();
        this.ctx.ellipse(-r * 0.2, -r * 0.1, r * 0.3, r * 0.4, 0.3, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.ellipse(r * 0.3, r * 0.2, r * 0.25, r * 0.3, -0.2, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (type === 'saturn') {
        // Saturn with rings
        this.ctx.fillStyle = planet.color;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, r, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Rings
        this.ctx.strokeStyle = planet.ringColor;
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, r * 1.8, r * 0.5, 0.2, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.strokeStyle = '#d4b483';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, r * 2.1, r * 0.6, 0.2, 0, Math.PI * 2);
        this.ctx.stroke();
      } else {
        // Simple planet
        const grad = this.ctx.createRadialGradient(-r * 0.3, -r * 0.3, 0, 0, 0, r);
        grad.addColorStop(0, this.lightenColor(planet.color, 30));
        grad.addColorStop(1, planet.color);
        this.ctx.fillStyle = grad;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, r, 0, Math.PI * 2);
        this.ctx.fill();
      }
      
      // Highlight
      this.ctx.globalAlpha = 0.4;
      const highlight = this.ctx.createRadialGradient(-r * 0.4, -r * 0.4, 0, 0, 0, r);
      highlight.addColorStop(0, '#fff');
      highlight.addColorStop(1, 'transparent');
      this.ctx.fillStyle = highlight;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, r, 0, Math.PI * 2);
      this.ctx.fill();
      
      this.ctx.restore();
    }

    lightenColor(color, percent) {
      const num = parseInt(color.replace('#', ''), 16);
      const amt = Math.round(2.55 * percent);
      const R = Math.min(255, (num >> 16) + amt);
      const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
      const B = Math.min(255, (num & 0x0000FF) + amt);
      return `rgb(${R},${G},${B})`;
    }

    animate() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Draw twinkling stars
      this.stars.forEach(star => {
        star.twinkle += star.speed;
        const alpha = (Math.sin(star.twinkle) + 1) / 2 * 0.6 + 0.4;
        
        this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        this.ctx.fill();
      });
      
      // Draw explosions
      for (let e = this.explosions.length - 1; e >= 0; e--) {
        const explosion = this.explosions[e];
        const elapsed = (Date.now() - explosion.startTime) / 1000;
        let hasActive = false;
        
        // Draw rings
        explosion.rings.forEach(ring => {
          if (ring.life > 0) {
            hasActive = true;
            ring.radius += ring.speed;
            ring.life = 1 - (ring.radius / ring.maxRadius);
            
            this.ctx.strokeStyle = ring.color;
            this.ctx.globalAlpha = ring.life * 0.6;
            this.ctx.lineWidth = 3 * ring.life;
            this.ctx.shadowBlur = 15;
            this.ctx.shadowColor = ring.color;
            this.ctx.beginPath();
            this.ctx.arc(explosion.x, explosion.y, ring.radius, 0, Math.PI * 2);
            this.ctx.stroke();
            this.ctx.shadowBlur = 0;
            this.ctx.globalAlpha = 1;
          }
        });
        
        // Draw planets
        for (let i = explosion.planets.length - 1; i >= 0; i--) {
          const p = explosion.planets[i];
          
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.98;
          p.vy *= 0.98;
          p.vy += 0.05; // gravity
          p.life -= 0.012;
          
          if (p.rotation !== undefined) {
            p.rotation += p.rotationSpeed;
          }
          
          if (p.life <= 0) {
            explosion.planets.splice(i, 1);
            continue;
          }
          
          hasActive = true;
          
          if (p.type === 'spark') {
            // Draw spark
            this.ctx.globalAlpha = p.life;
            this.ctx.fillStyle = p.color;
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
            this.ctx.globalAlpha = 1;
          } else {
            // Draw planet with trail
            p.trail.push({ x: p.x, y: p.y });
            if (p.trail.length > 8) p.trail.shift();
            
            // Draw trail
            p.trail.forEach((pos, idx) => {
              const alpha = (idx / p.trail.length) * 0.3 * p.life;
              this.ctx.globalAlpha = alpha;
              this.ctx.fillStyle = PLANETS[p.type]?.color || '#fff';
              this.ctx.beginPath();
              this.ctx.arc(pos.x, pos.y, PLANETS[p.type]?.radius * p.scale * 0.5 || 3, 0, Math.PI * 2);
              this.ctx.fill();
            });
            this.ctx.globalAlpha = p.life;
            
            this.drawPlanet(p.x, p.y, p.type, p.scale * p.life, p.rotation);
            this.ctx.globalAlpha = 1;
          }
        }
        
        if (!hasActive) {
          this.explosions.splice(e, 1);
        }
      }
      
      // Draw orbiting moons around cursor
      this.moons.forEach(moon => {
        moon.angle += moon.speed;
        
        const x = this.mouse.x + Math.cos(moon.angle) * moon.radius;
        const y = this.mouse.y + Math.sin(moon.angle) * moon.radius;
        
        // Moon trail
        moon.trail.push({ x, y });
        if (moon.trail.length > 12) moon.trail.shift();
        
        moon.trail.forEach((pos, idx) => {
          const alpha = (idx / moon.trail.length) * 0.3;
          this.ctx.globalAlpha = alpha;
          this.ctx.fillStyle = moon.color;
          this.ctx.beginPath();
          this.ctx.arc(pos.x, pos.y, moon.size * 0.6, 0, Math.PI * 2);
          this.ctx.fill();
        });
        this.ctx.globalAlpha = 1;
        
        // Orbit path (subtle)
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.arc(this.mouse.x, this.mouse.y, moon.radius, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Moon glow
        this.ctx.shadowBlur = 8;
        this.ctx.shadowColor = moon.color;
        
        // Moon body
        const grad = this.ctx.createRadialGradient(x - moon.size * 0.3, y - moon.size * 0.3, 0, x, y, moon.size);
        grad.addColorStop(0, '#fff');
        grad.addColorStop(1, moon.color);
        this.ctx.fillStyle = grad;
        this.ctx.beginPath();
        this.ctx.arc(x, y, moon.size, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.shadowBlur = 0;
      });
      
      // Draw Jupiter cursor
      this.drawJupiter(this.mouse.x, this.mouse.y);
      
      requestAnimationFrame(() => this.animate());
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new SolarSystemCursor());
  } else {
    new SolarSystemCursor();
  }

  console.log('🪐 Solar System Cursor Initialized!');

})();

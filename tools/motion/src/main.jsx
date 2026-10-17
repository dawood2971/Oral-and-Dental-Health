// Motion layer for «صحة الفم والأسنان». Built into assets/motion.js (+ motion.css) by `npm run build`.
// Lenis drives scrolling from the GSAP ticker so ScrollTrigger and Lenis share one clock.
// Nothing here changes text or colours; with prefers-reduced-motion the page stays still.
import { createRoot } from 'react-dom/client';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import BlurText from './react-bits/BlurText.jsx';
import LightRays from './react-bits/LightRays.jsx';
import StarBorder from './react-bits/StarBorder.jsx';
import CountUp from './react-bits/CountUp.jsx';
import './motion.css';

const root = document.documentElement;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const css = name => getComputedStyle(root).getPropertyValue(name).trim();
const mount = (el, node) => createRoot(el).render(node);

gsap.registerPlugin(ScrollTrigger);

// ---------- smooth scroll ----------
if (!reduced) {
  const lenis = new Lenis({ autoRaf: false, lerp: 0.12, anchors: true, allowNestedScroll: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  window.lenis = lenis;
}

// ---------- hero: title, light rays, main button ----------
const hero = document.querySelector('.hero');
if (hero) {
  const h1 = hero.querySelector('h1');
  if (h1 && !reduced) {
    const text = h1.textContent.trim();
    h1.textContent = '';
    mount(h1, <BlurText as="span" text={text} animateBy="words" direction="top" delay={160} stepDuration={0.45} blur={8} distance={24} trigger="load" />);
  }

  const rays = document.createElement('div');
  rays.className = 'hero-rays';
  rays.setAttribute('aria-hidden', 'true');
  hero.prepend(rays);
  mount(rays, (
    <LightRays
      raysOrigin="top-center"
      raysColor={css('--c1') || '#1f8fbf'}
      lightMode
      raysSpeed={reduced ? 0 : 0.5}
      lightSpread={0.9}
      rayLength={1.6}
      intensity={0.75}
      glow={0.4}
      haze={0.2}
      followMouse={false}
      cursorShadow={false}
      clickPulse={false}
      intro={!reduced}
      opacity={0.8}
    />
  ));

  const cta = hero.querySelector('.hero-cta .btn:not(.ghost)');
  if (cta) {
    const bg = getComputedStyle(cta).backgroundColor;
    const holder = document.createElement('span');
    holder.className = 'cta-star';
    cta.replaceWith(holder);
    mount(holder, (
      <StarBorder
        as="a"
        href={cta.getAttribute('href')}
        className={cta.className}
        theme="light"
        color="#ffffff"
        backgroundColor={bg}
        textColor="#ffffff"
        borderColor="rgba(255, 255, 255, 0.35)"
        radius={14}
        thickness={1.5}
        duration={6}
        glow={0.4}
      >
        {cta.textContent}
      </StarBorder>
    ));
  }
}

// ---------- numbers count up when they come into view ----------
const COUNT_IN = '.hc-t span, .ph p, .sh p, .hint';
document.querySelectorAll(COUNT_IN).forEach(box => {
  const walker = document.createTreeWalker(box, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) if (/\d/.test(walker.currentNode.nodeValue)) nodes.push(walker.currentNode);
  nodes.forEach(node => {
    const parts = node.nodeValue.split(/(\d+)/);
    const frag = document.createDocumentFragment();
    parts.forEach((part, i) => {
      if (i % 2 === 0) { if (part) frag.append(part); return; }
      const n = Number(part);
      const slot = document.createElement('span');
      slot.className = 'count-num';
      slot.style.minWidth = `${part.length}ch`;
      frag.append(slot);
      mount(slot, <CountUp from={0} to={n} duration={1.4} />);
    });
    node.replaceWith(frag);
  });
});

// ---------- sections appear softly on scroll ----------
// Opacity only (not visibility), so keyboard focus can still reach a section before it fades in.
if (!reduced) {
  const groups = [
    ['.ph', 0],
    ['main .blk', 0],
    ['.hgrid .hc', 0.08],
    ['nav.next a', 0.05],
  ];
  groups.forEach(([sel, stagger]) => {
    const items = gsap.utils.toArray(sel);
    if (!items.length) return;
    gsap.set(items, { opacity: 0, y: 24 });
    ScrollTrigger.batch(items, {
      start: 'top 90%',
      once: true,
      onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', stagger, overwrite: true, clearProps: 'transform,opacity' }),
    });
  });
  window.addEventListener('load', () => ScrollTrigger.refresh());
}
root.classList.add('motion-ready');

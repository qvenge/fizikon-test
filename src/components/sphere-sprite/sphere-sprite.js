import gradientsData from './gradients.json';
import './sphere-sprite.css';

export class SphereSprite {
  constructor(params = {}) {
    this._className = 'sphere-sprite';
    this._elem = null;
    this._r = params.radius ?? 10;
    this._cx = params.cx ?? 5;
    this._cy = params.cy ?? 5;
    this._init();
  }

  getElem() {
    return this._elem;
  }

  getPosition() {
    return { x: this._cx, y: this._cy };
  }

  setPosition({ x, y }) {
    this._cx = x;
    this._cy = y;
    this._circle.setAttributeNS(null, 'cx', x);
    this._circle.setAttributeNS(null, 'cy', y);
  }

  getRadius() {
    return this._r;
  }

  setRadius(radius) {
    this._r = radius;
    this._circle.setAttributeNS(null, 'r', radius);
  }

  _init() {
    this._elem = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this._elem.classList.add(this._className);
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.classList.add(`${this._className}__circle`);
    circle.setAttributeNS(null, 'cx', this._cx);
    circle.setAttributeNS(null, 'cy', this._cy);
    circle.setAttributeNS(null, 'r', this._r);
    this._circle = circle;

    const gradients = gradientsData
      .filter(({ colors }) => colors && colors.length > 1)
      .map(({ id, cx, cy, r, colors }) =>
        [
          `<radialGradient id="${id}" cx="${cx ?? 0.5}" cy="${cy ?? 0.5}" r="${r ?? 0.5}">`,
          ...colors.map((color, index, { length }) => `<stop offset="${index / (length - 1)}" stop-color="${color}"/>`),
          '</radialGradient>',
        ].join(''),
      );

    if (gradients.length) {
      this._elem.innerHTML = `<defs>\n${gradients.join('\n')}\n</defs>`;
    }

    this._elem.append(circle);
  }
}

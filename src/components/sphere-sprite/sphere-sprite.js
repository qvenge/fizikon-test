import settings from './settings.json';

import './sphere-sprite.css';

export class SphereSprite {
  constructor(params = {}) {
    this._className = 'sphere-sprite';
    this._elem = null;
    this._r = params.radius ?? settings.r;
    this._cx = params.cx ?? settings.cx;
    this._cy = params.cy ?? settings.cy;
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

    const gradients = settings.gradients
      .filter((gradient) => gradient?.colors?.length > 1)
      .map((gradient) =>
        [
          `<radialGradient id="SphereGradient" cx="${gradient.cx ?? 0.5}" cy="${gradient.cy ?? 0.5}" r="${
            gradient.r ?? 0.5
          }">`,
          ...gradient.colors.map(
            (color, index, { length }) => `<stop offset="${index / (length - 1)}" stop-color="${color}"/>`,
          ),
          '</radialGradient>',
        ].join(''),
      );

    if (gradients.length) {
      this._elem.innerHTML = `<defs>\n${gradients.join('\n')}\n</defs>`;
    }

    this._elem.append(circle);
  }
}

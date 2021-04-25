import { SpringSprite } from '../spring-sprite/spring-sprite';
import { SphereSprite } from '../sphere-sprite/sphere-sprite';
import './mass-spring.css';

const DEFAULT_VIEWBOX = [400, 300];

export class MassSpring {
  constructor(props = {}) {
    this._className = 'mass-spring';
    this._elem = null;
    this._springSprite = null;
    this._massSprite = null;
    this._viewbox = props.viewbox ?? DEFAULT_VIEWBOX;

    this._init(props);
  }

  getElem() {
    return this._elem;
  }

  setMassRadius(value) {
    this._massSprite.setRadius(value);
  }

  extendSpring(value) {
    this._springSprite.extend(value);
    this._updateMassPosition();
  }

  _init(props) {
    this._elem = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    this._elem.classList.add(this._className);
    this._elem.setAttribute('viewBox', `0 0 ${this._viewbox[0]} ${this._viewbox[1]}`);
    this._elem.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

    this._springSprite = this._createSpringSptite(props);
    this._massSprite = this._createMassSprite(props);
    this._updateMassPosition();

    this._elem.append(this._springSprite.getElem(), this._massSprite.getElem());
  }

  _createSpringSptite(props) {
    return new SpringSprite({
      position: [this._viewbox[0] / 2, 0],
      coils: props.coils,
      coilDiameter: props.coilDiameter,
      springWidth: props.springWidth,
      extension: props.extension,
    });
  }

  _createMassSprite(props) {
    const position = this._springSprite.getEndPoint();
    return new SphereSprite({
      cx: position.x,
      cy: position.y,
      radius: props.massRadius,
    });
  }

  _updateMassPosition() {
    const massPosition = this._springSprite.getEndPoint();
    const radius = this._massSprite.getRadius();
    this._massSprite.setPosition({
      x: massPosition.x,
      y: massPosition.y + radius - 2,
    });
  }
}

import './button.css';

export class Button {
  constructor(props = {}) {
    this._className = 'button';
    this._elem = null;
    this._init(props);
  }

  getElem() {
    return this._elem;
  }

  getText() {
    return this._elem.textContent;
  }

  setText(value) {
    this._elem.textContent = value;
  }

  _init(props) {
    this._elem = document.createElement('button');
    this._elem.className = this._className;
    this._elem.textContent = props.text ?? 'Button';

    if (typeof props.onClick === 'function') {
      this._elem.addEventListener('click', () => props.onClick.call(null, this));
    }
  }
}

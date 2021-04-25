import './label.css';

export class Label {
  constructor(props = {}) {
    this._className = 'label';
    this._elem = null;
    this._init(props);
  }

  getElem() {
    return this._elem;
  }

  _init(props) {
    this._elem = document.createElement('div');
    this._elem.className = this._className;
    this._elem.textContent = props.text ?? 'Text';
  }

  getText() {
    return this._elem.textContent;
  }

  setText(value) {
    this._elem.textContent = value;
  }
}

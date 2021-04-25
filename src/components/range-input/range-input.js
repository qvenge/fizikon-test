import './range-input.css';

const PARAM_NAMES = ['min', 'max', 'step', 'value', 'name'];

export class RangeInput {
  constructor(props = {}) {
    this._className = 'range-input';
    this._elem = null;
    this._value = props.value;
    this._inputElem = null;
    this._labelElem = null;

    this._init(props);
  }

  getElem() {
    return this._elem;
  }

  // имеет смысл вызывать только в обработчике onChange
  abortChange() {
    this._inputElem.value = this._value;
  }

  getLabel() {
    return this._labelElem.textContent;
  }

  setLabel(text) {
    this._labelElem.textContent = text;
  }

  getValue() {
    return this._inputElem.value;
  }

  setValue(value) {
    this._inputElem.value = value;
    this._value = this._inputElem.value;
  }

  getStep() {
    return this._inputElem.step;
  }

  setStep(value) {
    this._inputElem.step = value;
  }

  getMin() {
    return this._inputElem.min;
  }

  setMin(value) {
    this._inputElem.min = value;
  }

  getMax() {
    return this._inputElem.max;
  }

  setMax(value) {
    this._inputElem.max = value;
  }

  disable() {
    this._inputElem.disabled = true;
  }

  enable() {
    this._inputElem.disabled = false;
  }

  _init(props) {
    this._elem = document.createElement('label');
    this._elem.className = this._className;

    this._labelElem = document.createElement('span');
    this._labelElem.className = `${this._className}__label`;
    this._labelElem.textContent = props.label ?? '';

    this._inputElem = document.createElement('input');
    this._inputElem.className = `${this._className}__input`;
    this._inputElem.setAttribute('type', 'range');

    const params = Array.from(Object.keys(props)).filter((attr) => PARAM_NAMES.includes(attr));

    params.forEach((paramName) => {
      this._inputElem.setAttribute(paramName, `${props[paramName]}`);
    });

    this._inputElem.addEventListener(
      'input',
      typeof props.onChange === 'function'
        ? () => {
            props.onChange.call(null, this);
            this._value = this._inputElem.value;
          }
        : () => {
            this._value = this._inputElem.value;
          },
    );

    this._elem.append(this._labelElem, this._inputElem);
  }
}

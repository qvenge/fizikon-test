/* 
  все длины в сантиметрах, а время в секундах

  m   - масса груза
  k   - коэффициент упругости пружины
  A   - амплитуда колебаний (отклонение от состояния равновесия)
  w   - циклическая частота
  t   - время прошедшее после старта
  x0  - положение конца пружины в состоянии равновесия
  dx  - отколнение конца пружины относительно состояния равновесия
  x   - текущее положение конца пружины
  n   - количество колебаний
*/

const DEFAULT_PARAMS = { m: 0.5, k: 5, A: 10 };
const calcExtension = ({ m, k }) => (100 * 9.8 * m) / k;
const calcAngularFrequency = ({ m, k }) => Math.sqrt(k / m);

export class MassSpringModel {
  constructor(params = {}) {
    this._callbacks = new Set();
    this._time = 0;
    this._startTime = null;
    this._params = { ...DEFAULT_PARAMS };
    this._angularFrequency = calcAngularFrequency(DEFAULT_PARAMS);
    // растяжение пружины под действием веса в состоянии покоя
    this._initialExtension = calcExtension(DEFAULT_PARAMS);
    this.setParams(params);
  }

  isActive() {
    return this._startTime !== null;
  }

  getState() {
    const time = this._getTime();
    const offset = this._calcOffset(time);
    return {
      ...this._params,
      w: this._angularFrequency,
      t: time,
      x0: this._initialExtension,
      dx: offset,
      x: this._initialExtension + offset,
      n: this._calcNumberOfVibration(time),
      active: this.isActive(),
    };
  }

  setParams(params) {
    const newParams = { ...this._params };
    let stateChanged = false;

    Object.entries(this._params).forEach(([paramName, prevParamValue]) => {
      if (Object.prototype.hasOwnProperty.call(params, paramName)) {
        const paramValue = params[paramName];

        if (this._isValidParam(paramName, paramValue) && prevParamValue !== paramValue) {
          stateChanged = true;
          newParams[paramName] = paramValue;
        }
      }
    });

    if (stateChanged) {
      this._params = newParams;
      this._initialExtension = calcExtension(newParams);
      this._angularFrequency = calcAngularFrequency(newParams);
      this.reset();
      this.notify();
    }
  }

  reset() {
    this._time = 0;
    this._startTime = this.isActive() ? performance.now() : null;
    this.notify();
  }

  start() {
    if (!this.isActive()) {
      this._startTime = performance.now();
      this.notify();
    }
  }

  stop() {
    if (this.isActive()) {
      this._time = this._getTime();
      this._startTime = null;
      this.notify();
    }
  }

  attach(callback) {
    this._callbacks.add(callback);
  }

  detach(callback) {
    this._callbacks.delete(callback);
  }

  notify() {
    this._callbacks.forEach((callback) => {
      callback.call(null, this);
    });
  }

  _isValidParam(name, value) {
    switch (name) {
      case 'm':
      case 'k':
        // масса и коэффициент упругости не могут быть отрицательными
        return typeof value === 'number' && value > 0;
      case 'A':
        // заданное отклонение не может быть по модулю больше изначального растяжения пружины
        return typeof value === 'number' && Math.abs(value) <= this._initialExtension;
      default:
        return false;
    }
  }

  // возвращает время прошедшее с начала процесса
  _getTime() {
    const shift = this.isActive() ? (performance.now() - this._startTime) / 1000 : 0;
    return this._time + shift;
  }

  _calcNumberOfVibration(time) {
    return (this._angularFrequency * time) / (2 * Math.PI);
  }

  _calcOffset(time) {
    return this._params.A * Math.cos(this._angularFrequency * time);
  }
}

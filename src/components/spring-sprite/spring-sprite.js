/* eslint-disable class-methods-use-this */
import defaultSettings from './settings.json';
import './spring-sprite.css';

// коэффициент, который помогает высчитывать положение контрольных точек кривых
const K = 0.37;

export class SpringSprite {
  constructor(params = {}) {
    this._className = 'spring-sprite';
    this._elem = null;
    this._paths = [];
    this._coils = params.coils ?? defaultSettings.coils;
    this._startPosition = params.position ?? defaultSettings.position;
    this._springWidth = params.springWidth ?? defaultSettings.springWidth;
    this._coilDiameter = params.coilDiameter ?? defaultSettings.coilDiameter;
    this._endPoint = null;

    this._init(params.extension ?? defaultSettings.extension);
  }

  getElem() {
    return this._elem;
  }

  // метод растягивает пружину
  extend(value) {
    const pathsData = this._generateCommandsOfPaths(value);
    this._paths.forEach((path, index) => {
      const d = this._renderPathData(pathsData[index].commands);
      path.setAttributeNS(null, 'd', d);
      // this._applyPoints(path, pathsData[index].data);
    });
  }

  // метод возращает координаты конца пружины
  // это нужно, чтобы спозиционировать шар
  getEndPoint() {
    const lastSeg = this._paths[this._paths.length - 1].pathSegList.getItem(2);
    return {
      x: lastSeg.x + this._springWidth / 4,
      y: lastSeg.y,
    };
  }

  _init(extension) {
    this._paths = this._generateCommandsOfPaths(extension).map(({ type, commands }) =>
      this._createPath(type, this._renderPathData(commands)),
    );
    this._elem = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    this._elem.classList.add(this._className);
    this._elem.append(...this._paths);
  }

  _calcHalfPeriod(extension) {
    return (extension / (this._coils + 1) + this._springWidth) / 2;
  }

  // метод высчитывает комманды для всех путей
  // возвращает двойной массив
  _generateCommandsOfPaths(extension) {
    const { _startPosition: startPosition, _coilDiameter: coilDiameter, _coils: coils } = this;
    // половина расстояние между витками пружины
    let halfPeriod = this._calcHalfPeriod(extension);
    // длина одного витка
    const L = Math.PI * coilDiameter;

    const frontPaths = [];
    const backPaths = [];

    if (halfPeriod > L / 2) {
      halfPeriod = L / 2;
    }

    const xShift = coilDiameter - ((2 * halfPeriod) / L) * coilDiameter;
    const rectHeight = 20;

    let startPoint = startPosition;

    // создаем верхний стержень
    const startRectPoints = { startPoint: [...startPoint], endPoint: [startPoint[0], startPoint[1] + rectHeight] };
    frontPaths.push(this._calcRectCommands(startRectPoints));

    startPoint = [startPosition[0], startPosition[1] + rectHeight - this._springWidth];

    // создаем верхнюю четвертинку витка
    const startCurvePoints = {};
    startCurvePoints.startPoint = [...startPoint];
    startCurvePoints.endPoint = [startPoint[0] - xShift / 2, startPoint[1] + halfPeriod / 2];
    startCurvePoints.controlPoint1 = startCurvePoints.startPoint;
    startCurvePoints.controlPoint2 = [startCurvePoints.endPoint[0], startCurvePoints.endPoint[1] - K * halfPeriod];
    frontPaths.push(this._calcCurveCommands(startCurvePoints));

    startPoint = startCurvePoints.endPoint;

    // создаем полувитки пружины
    for (let i = 0; i < 2 * coils - 1; ++i) {
      const dir = i % 2 ? -1 : 1;

      const pathPoints = {};
      pathPoints.startPoint = [...startPoint];
      pathPoints.endPoint = [startPoint[0] + dir * xShift, startPoint[1] + halfPeriod];
      pathPoints.controlPoint1 = [startPoint[0], startPoint[1] + K * halfPeriod];
      pathPoints.controlPoint2 = [pathPoints.endPoint[0], pathPoints.endPoint[1] - K * halfPeriod];

      const data = this._calcCurveCommands(pathPoints);
      if (dir < 0) frontPaths.push(data);
      else backPaths.push(data);

      startPoint = pathPoints.endPoint;
    }

    // Создаем нижнюю четвертинку витка
    const endCurvePoints = {};
    endCurvePoints.startPoint = [...startPoint];
    endCurvePoints.endPoint = [startPoint[0] - xShift / 2, startPoint[1] + halfPeriod / 2];
    endCurvePoints.controlPoint1 = [startPoint[0], startPoint[1] + K * halfPeriod];
    endCurvePoints.controlPoint2 = endCurvePoints.endPoint;
    frontPaths.push(this._calcCurveCommands(endCurvePoints));

    startPoint = endCurvePoints.endPoint;

    // создаем нижний стержень
    const endRectPoints = { startPoint: [...startPoint], endPoint: [startPoint[0], startPoint[1] + rectHeight] };
    frontPaths.push(this._calcRectCommands(endRectPoints));

    // для корректного порядка отбражения путей
    // первыми в dom пойдут отдаленные части витков пружины
    return [
      ...backPaths.map((commands) => ({
        type: 'back',
        commands,
      })),
      ...frontPaths.map((commands) => ({
        type: 'front',
        commands,
      })),
    ];
  }

  // создает прямоугольник вдоль прямой с шириной springWidth / 2
  _calcRectCommands({ startPoint, endPoint }) {
    const width = this._springWidth / 4;
    return [
      {
        command: 'M',
        x: startPoint[0] + width,
        y: startPoint[1],
      },
      {
        command: 'L',
        x: startPoint[0] - width,
        y: startPoint[1],
      },
      {
        command: 'L',
        x: startPoint[0] - width,
        y: endPoint[1],
      },
      {
        command: 'L',
        x: startPoint[0] + width,
        y: endPoint[1],
      },
      {
        command: 'Z',
      },
    ];
  }

  // метод на вход принимает контрольные точки кубической кривой безье
  // создает такую же кривую ниже, соединяет эти кривые прямыми
  // и возвращает данные получившегося пути в виде массива комманд
  _calcCurveCommands({ startPoint, endPoint, controlPoint1, controlPoint2 }) {
    const { _springWidth: springWidth } = this;
    return [
      {
        command: 'M',
        x: startPoint[0],
        y: startPoint[1],
      },
      {
        command: 'C',
        x1: controlPoint1[0],
        y1: controlPoint1[1],
        x2: controlPoint2[0],
        y2: controlPoint2[1],
        x: endPoint[0],
        y: endPoint[1],
      },
      {
        command: 'L',
        x: endPoint[0],
        y: endPoint[1] + springWidth,
      },
      {
        command: 'C',
        x1: controlPoint2[0],
        y1: controlPoint2[1] + springWidth,
        x2: controlPoint1[0],
        y2: controlPoint1[1] + springWidth,
        x: startPoint[0],
        y: startPoint[1] + springWidth,
      },
      {
        command: 'Z',
      },
    ];
  }

  // на вход принимает массив комманд и возвращает строку
  _renderPathData(segments) {
    return segments
      .map((seg) => {
        let result = seg.command;
        if (seg.x1 !== undefined && seg.y1 !== undefined) {
          result += ` ${seg.x1} ${seg.y1}`;
        }
        if (seg.x2 !== undefined && seg.y2 !== undefined) {
          result += ` ${seg.x2} ${seg.y2}`;
        }
        if (seg.x !== undefined && seg.y !== undefined) {
          result += ` ${seg.x} ${seg.y}`;
        }
        return result;
      })
      .join(' ');
  }

  // возвращает path элемент
  _createPath(type, d) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.classList.add(`${this._className}__path`);
    path.classList.add(`${this._className}__path_${type}`);
    path.setAttributeNS(null, 'd', d);
    return path;
  }

  // _applyPoints(path, segments) {
  //   for (let i = 0; i < segments.length; ++i) {
  //     const pathSeg = path.pathSegList.getItem(i);
  //     const seg = segments[i];
  //     const props = Object.keys(seg);
  //     props.forEach((prop) => {
  //       if (prop in pathSeg) {
  //         pathSeg[prop] = seg[prop];
  //       }
  //     });
  //   }
  // }
}

import { MassSpring } from '../components/mass-spring/mass-spring';
import { RangeInput } from '../components/range-input/range-input';
import { Button } from '../components/button/button';
import { Label } from '../components/label/label';
import settings from './settings';
import './style.css';

const DEFAULT_MASS_RADIUS_FACTOR = 16;

export class MassSpringWidget {
  constructor(model, params = {}) {
    this._model = model;
    this._className = 'mass-spring';
    this._elem = null;
    this._requestId = null;
    this._inputComponents = null;
    this._massSpring = null;
    this._startStopButton = null;
    this._resetButton = null;
    this._labels = null;
    this._massRadiusFactor = params.massRadiusFactor ?? DEFAULT_MASS_RADIUS_FACTOR;
    this.update = this.update.bind(this);

    this._init(params);
  }

  getElem() {
    return this._elem;
  }

  // метод обновляет представление в соответствии с состоянием модели
  update() {
    const modelState = this._model.getState();
    // обновляем область визуализации
    this._updateVisualizationPanel(modelState);
    // обновляем область параметров
    this._updateControllPanel(modelState);
    // обновляем область характеристик
    this._updateInformationPanel(modelState);
    // запускаем или останваливаем анимацию процесса
    if (this._model.isActive()) {
      this._disableControllPanel();
      this._requestId = requestAnimationFrame(this.update);
    } else {
      this._enableControllPanel();
      cancelAnimationFrame(this._requestId);
    }
  }

  // ---- контроллер -----

  _toggleProcess() {
    this._model.isActive() ? this._model.stop() : this._model.start();
  }

  _resetProcess() {
    this._model.reset();
  }

  _setModelParam(param, value) {
    this._model.setParams({ [param]: Number(value) });
  }

  // ---------------------

  _init(params) {
    this._elem = document.createElement('div');
    this._elem.className = this._className;

    const visualizationPanel = this._createVisualizationPanel(params);
    const controllPanel = this._createControllPanel(params);
    const informationPanel = this._createInformationPanel(params);
    this._elem.append(visualizationPanel, controllPanel, informationPanel);

    // подписываемся на обновления модели
    this._model.attach(this.update);
    // сразу синхронизируем представление с моделью
    this.update();
  }

  _createVisualizationPanel(params) {
    const visualizationPanel = document.createElement('div');
    visualizationPanel.className = `${this._className}__panel ${this._className}__panel_visualization`;

    // создаем пружинный маятник
    this._massSpring = new MassSpring(params);

    const buttonList = document.createElement('div');
    buttonList.className = `${this._className}__button-list`;

    // создаем кнопку старта и остановки
    this._startStopButton = new Button({
      text: settings.startButtonText,
      onClick: this._toggleProcess.bind(this),
    });
    const startStopButtonWrapper = document.createElement('div');
    startStopButtonWrapper.className = `${this._className}__button`;
    startStopButtonWrapper.append(this._startStopButton.getElem());

    // создаем кнопку сброса
    this._resetButton = new Button({
      text: settings.resetButtonText,
      onClick: this._resetProcess.bind(this),
    });
    const resetButtonWrapper = document.createElement('div');
    resetButtonWrapper.className = `${this._className}__button`;
    resetButtonWrapper.append(this._resetButton.getElem());

    buttonList.append(startStopButtonWrapper, resetButtonWrapper);
    visualizationPanel.append(this._massSpring.getElem(), buttonList);
    return visualizationPanel;
  }

  _createControllPanel() {
    const controllPanel = document.createElement('div');
    controllPanel.className = `${this._className}__panel ${this._className}__panel_controll`;

    this._inputComponents = settings.inputs.map(({ paramName, inputParams, getText }) => ({
      paramName,
      getText,
      input: new RangeInput({
        ...inputParams,
        label: getText(inputParams.value),
        onChange: (input) => {
          this._setModelParam(paramName, input.getValue());
          // отменям изменение значения инпута
          // любые изменения view происходят в методе update
          input.abortChange();
        },
      }),
    }));

    const inputElems = this._inputComponents.map(({ input }) => {
      const inputWrapper = document.createElement('div');
      inputWrapper.className = `${this._className}__input`;
      inputWrapper.append(input.getElem());
      return inputWrapper;
    });

    controllPanel.append(...inputElems);
    return controllPanel;
  }

  _createInformationPanel() {
    const informationPanel = document.createElement('div');
    informationPanel.className = `${this._className}__panel ${this._className}__panel_information`;

    this._labels = settings.labels.map((getText) => ({
      getText,
      label: new Label(),
    }));

    const labelElems = this._labels.map(({ label }) => {
      const labelWrapper = document.createElement('div');
      labelWrapper.className = `${this._className}__label`;
      labelWrapper.append(label.getElem());
      return labelWrapper;
    });

    informationPanel.append(...labelElems);

    return informationPanel;
  }

  _updateVisualizationPanel(modelState) {
    // сначала устанавливаем радиус сферы, а потом растяжение пружины
    // т. к. положение сферы после растяжения пружины зависит от радиуса сферы
    this._massSpring.setMassRadius(this._calcMassRadius(modelState.m));
    this._massSpring.extendSpring(modelState.x);
    this._startStopButton.setText(modelState.active ? settings.stopButtonText : settings.startButtonText);
  }

  _updateControllPanel(modelState) {
    this._inputComponents.forEach(({ paramName, input, getText }) => {
      const value = modelState[paramName];
      if (value !== undefined) {
        input.setValue(value);
        input.setLabel(getText(value));
      }
    });
  }

  _updateInformationPanel(modelState) {
    this._labels.forEach(({ getText, label }) => label.setText(getText(modelState)));
  }

  _enableControllPanel() {
    const screen = this._elem.querySelector(`.${this._className}__panel_controll .${this._className}__screen`);

    if (screen) {
      screen.remove();
    }
  }

  _disableControllPanel() {
    const panel = this._elem.querySelector(`.${this._className}__panel_controll`);
    let screen = panel.querySelector(`.${this._className}__screen`);

    if (!screen) {
      screen = document.createElement('div');
      screen.className = `${this._className}__screen`;
    }

    panel.append(screen);
  }

  _calcMassRadius(mass) {
    return this._massRadiusFactor * Math.cbrt(mass);
  }
}

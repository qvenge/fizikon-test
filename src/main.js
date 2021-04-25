import { MassSpringWidget } from './MassSpringWidget';
import { MassSpringModel } from './MassSpringWidget/model';
import massSpringSettings from './MassSpringWidget/settings';
import './main.css';

const params = {};

massSpringSettings.inputs.forEach(({ paramName, inputParams: { value } }) => {
  params[paramName] = value;
});

const container = document.querySelector('.container');
const model = new MassSpringModel(params);
const widget = new MassSpringWidget(model, {
  viewbox: [400, 350],
  coils: 4,
  springWidth: 8,
  coilDiameter: 40,
  massRadiusFactor: 20,
});
container.append(widget.getElem());

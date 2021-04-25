export default {
  massRadiusFactor: 16,
  startButtonText: 'Запустить',
  stopButtonText: 'Остановить',
  resetButtonText: 'Сбросить',
  inputs: [
    {
      paramName: 'm',
      inputParams: {
        min: 0.5,
        max: 1,
        step: 0.1,
        value: 0.5,
      },
      getText: (value) => `Масса груза (m): ${value} кг`,
    },
    {
      paramName: 'k',
      inputParams: {
        min: 5,
        max: 9,
        step: 1,
        value: 5,
      },
      getText: (value) => `Жесткость пружины (k): ${value} Н/м`,
    },
    {
      paramName: 'A',
      inputParams: {
        min: 0,
        max: 20,
        step: 2,
        value: 10,
      },
      getText: (value) => `Отклонение (x0): ${value} см`,
    },
  ],
  labels: [
    (modelParams) => `Циклическая частота: ${modelParams.w.toFixed(2)} рад/с`,
    (modelParams) => `Время прошедшее после старта: ${modelParams.t.toFixed(2)} секунд`,
    (modelParams) => `Количество полных колебаний: ${Math.floor(modelParams.n)}`,
    (modelParams) => `Отклонение от равновесия: ${Math.round(modelParams.dx)} см`,
  ],
};

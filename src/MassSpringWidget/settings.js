export default {
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
    ({ w }) => `Циклическая частота: ${w.toFixed(2)} рад/с`,
    ({ t }) => `Время прошедшее после старта: ${t.toFixed(2)} секунд`,
    ({ n }) => `Количество полных колебаний: ${Math.floor(n)}`,
    ({ dx }) => `Отклонение от равновесия: ${Math.round(dx)} см`,
  ],
};

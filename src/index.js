import covid19ImpactEstimator from './estimator';
import './css/display.css';
import './css/styles.css';

const inputElements = document.querySelectorAll('.data');
const estimatedDataTableRows = document.querySelectorAll(
  'table#estimated-data tbody tr'
);
const inputtedDataTableRows = document.querySelectorAll(
  'table#inputted-data tbody tr'
);
const formElement = document.querySelector('#form');
const resultStatusElement = document.querySelector('#result-status');

const getStructuredData = elements => {
  const structuredData = {
    region: {
      name: '',
      avgAge: 0,
      avgDailyIncomeInUSD: 0,
      avgDailyIncomePopulation: 0
    },
    periodType: '',
    timeToElapse: 0,
    reportedCases: 0,
    population: 0,
    totalHospitalBeds: 0
  };

  elements.forEach(({ name, value, type }) => {
    const currentValue = type === 'number' ? Number(value) : value;

    switch (name) {
      case 'region':
        structuredData.region.name = currentValue;
        break;
      case 'avgDailyIncomeInUSD':
        structuredData.region[name] = currentValue;
        break;
      case 'avgDailyIncomePopulation':
        structuredData.region[name] = currentValue;
        break;
      default:
        structuredData[name] = currentValue;
        break;
    }
  });

  return structuredData;
};

const displayEstimatedResult = estimatedData => {
  estimatedDataTableRows.forEach(row => {
    const { id } = row;

    const impactDataElement = row.querySelector('td:nth-of-type(2)');
    const severeImpactDataElement = row.querySelector('td:nth-of-type(3)');

    impactDataElement.textContent = estimatedData.impact[id];
    severeImpactDataElement.textContent = estimatedData.severeImpact[id];
  });

  inputtedDataTableRows.forEach(row => {
    const { id } = row;
    const currentID = id.replace('Row', '');

    const inputtedDataElement = row.querySelector('td:nth-of-type(2)');

    switch (currentID) {
      case 'region':
        inputtedDataElement.textContent = estimatedData.data.region.name;
        break;
      case 'avgDailyIncomeInUSD':
        inputtedDataElement.textContent = estimatedData.data.region[currentID];
        break;
      case 'avgDailyIncomePopulation':
        inputtedDataElement.textContent = estimatedData.data.region[currentID];
        break;
      default:
        inputtedDataElement.textContent = estimatedData.data[currentID];
        break;
    }
  });
};

const handleSubmission = event => {
  event.preventDefault();

  const structuredData = getStructuredData(inputElements);

  const estimatedData = covid19ImpactEstimator(structuredData);

  displayEstimatedResult(estimatedData);

  resultStatusElement.classList.add('d-none');

  event.target.reset();
};

formElement.addEventListener('submit', handleSubmission);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then(r => r)
      .catch(e => e);
  });
}

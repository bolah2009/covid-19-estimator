const getProjectedNumbersByPeriodType = (
  currentlyInfected,
  timeToElapse,
  periodType
) => {
  let timeToElapseInDays = timeToElapse;
  if (periodType === 'weeks') {
    timeToElapseInDays = timeToElapse * 7;
  } else if (periodType === 'months') {
    timeToElapseInDays = timeToElapse * 30;
  }
  const durationSet = Math.floor(timeToElapseInDays / 3);
  const factor = 2 ** durationSet;

  const infectionsByRequestedTime = currentlyInfected * factor;
  const periodInDays = timeToElapseInDays;

  return { infectionsByRequestedTime, periodInDays };
};

const toFinancial = number => {
  return Number(number.toFixed(2));
};

const generateImpactData = (data, type) => {
  const {
    reportedCases,
    timeToElapse,
    periodType,
    totalHospitalBeds,
    region: { avgDailyIncomeInUSD, avgDailyIncomePopulation }
  } = data;

  const determinant = type === 'severeImpact' ? 50 : 10;

  const currentlyInfected = reportedCases * determinant;
  const {
    infectionsByRequestedTime,
    periodInDays
  } = getProjectedNumbersByPeriodType(
    currentlyInfected,
    timeToElapse,
    periodType
  );

  const severeCasesByRequestedTime = infectionsByRequestedTime * 15 * 0.01;

  const availableHospitalBeds = totalHospitalBeds * 35 * 0.01;

  const hospitalBedsByRequestedTime =
    availableHospitalBeds - severeCasesByRequestedTime;

  const casesForICUByRequestedTime = infectionsByRequestedTime * 5 * 0.01;

  const casesForVentilatorsByRequestedTime =
    infectionsByRequestedTime * 2 * 0.01;
  const dollarsInFlightFactor =
    periodInDays * avgDailyIncomeInUSD * avgDailyIncomePopulation;
  const dollarsInFlight = toFinancial(
    infectionsByRequestedTime * dollarsInFlightFactor
  );

  return {
    currentlyInfected,
    infectionsByRequestedTime,
    severeCasesByRequestedTime: Math.trunc(severeCasesByRequestedTime),
    hospitalBedsByRequestedTime: Math.trunc(hospitalBedsByRequestedTime),
    casesForICUByRequestedTime: Math.trunc(casesForICUByRequestedTime),
    casesForVentilatorsByRequestedTime: Math.trunc(
      casesForVentilatorsByRequestedTime
    ),
    dollarsInFlight
  };
};

export default generateImpactData;

import Big from 'big.js';

export const getProjectedNumbersByPeriodType = (
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

const getPercentage = (number, percent) => {
  const bigNumber = new Big(number);
  const percentage = bigNumber.div(100).times(percent);
  return Number(percentage);
};

export const generateImpactData = (
  data,
  type
) => {
  const {
    reportedCases,
    timeToElapse,
    periodType,
    totalHospitalBeds,
    region: {
      avgDailyIncomeInUSD,
      avgDailyIncomePopulation
    }
  } = data;
  const determinant = type === 'severeImpact' ? 50 : 10;

  const currentlyInfected = reportedCases * determinant;
  const { infectionsByRequestedTime, periodInDays } = getProjectedNumbersByPeriodType(
    currentlyInfected,
    timeToElapse,
    periodType
  );

  const severeCasesByRequestedTime = infectionsByRequestedTime * 0.15;
  const availableHospitalBeds = totalHospitalBeds * 0.35;
  const hospitalBedsByRequestedTime = availableHospitalBeds - severeCasesByRequestedTime;
  const casesForICUByRequestedTime = getPercentage(infectionsByRequestedTime, 5);
  const casesForVentilatorsByRequestedTime = getPercentage(infectionsByRequestedTime, 2);
  const dollarsInFlightFactor = periodInDays * avgDailyIncomeInUSD * avgDailyIncomePopulation;
  const dollarsInFlight = infectionsByRequestedTime * dollarsInFlightFactor;

  return {
    currentlyInfected,
    infectionsByRequestedTime,
    severeCasesByRequestedTime,
    hospitalBedsByRequestedTime,
    casesForICUByRequestedTime,
    casesForVentilatorsByRequestedTime,
    dollarsInFlight
  };
};

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

  return currentlyInfected * factor;
};

export const generateImpactData = (
  {
    reportedCases, timeToElapse, periodType, totalHospitalBeds
  },
  type
) => {
  const determinant = type === 'severeImpact' ? 50 : 10;

  const currentlyInfected = reportedCases * determinant;
  const infectionsByRequestedTime = getProjectedNumbersByPeriodType(
    currentlyInfected,
    timeToElapse,
    periodType
  );

  const severeCasesByRequestedTime = infectionsByRequestedTime * 0.15;
  const availableHospitalBeds = totalHospitalBeds * 0.35;
  const hospitalBedsByRequestedTime = availableHospitalBeds - severeCasesByRequestedTime;

  return {
    currentlyInfected,
    infectionsByRequestedTime,
    severeCasesByRequestedTime,
    hospitalBedsByRequestedTime
  };
};

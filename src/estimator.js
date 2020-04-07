// Input
// {
//   region: {
//   name: "Africa",
//   avgAge: 19.7,
//   avgDailyIncomeInUSD: 5,
//   avgDailyIncomePopulation: 0.71
//   },
//   periodType: "days",
//   timeToElapse: 58,
//   reportedCases: 674,
//   population: 66622705,
//   t

import { generateImpactData } from './util/calculations';

const covid19ImpactEstimator = (data) => {
  const result = {
    data: {},
    impact: { ...generateImpactData(data, 'impact') },
    severeImpact: {
      ...generateImpactData(data, 'severeImpact')
    }
  };
  return result;
};

export default covid19ImpactEstimator;

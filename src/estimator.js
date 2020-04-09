import generateImpactData from './util/calculations';

const covid19ImpactEstimator = data => {
  const result = {
    data,
    impact: { ...generateImpactData(data, 'impact') },
    severeImpact: {
      ...generateImpactData(data, 'severeImpact')
    }
  };
  return result;
};

export default covid19ImpactEstimator;

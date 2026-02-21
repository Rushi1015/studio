export type CalculationResult = {
  year: number;
  investment: number;
  wealth: number;
  totalInvestment: number;
};

export const calculateSIP = (
  monthlyInvestment: number,
  years: number,
  expectedReturn: number
) => {
  const months = years * 12;
  const monthlyRate = expectedReturn / 100 / 12;
  const results: CalculationResult[] = [];
  
  let totalWealth = 0;
  let totalInvestment = 0;

  for (let y = 1; y <= years; y++) {
    for (let m = 1; m <= 12; m++) {
      totalInvestment += monthlyInvestment;
      totalWealth = (totalWealth + monthlyInvestment) * (1 + monthlyRate);
    }
    results.push({
      year: y,
      investment: Math.round(totalInvestment),
      wealth: Math.round(totalWealth),
      totalInvestment: Math.round(totalInvestment),
    });
  }

  return {
    totalInvestment: Math.round(totalInvestment),
    estimatedReturns: Math.round(totalWealth - totalInvestment),
    totalValue: Math.round(totalWealth),
    yearlyData: results,
  };
};

export const calculateSWP = (
  initialInvestment: number,
  withdrawalAmount: number,
  years: number,
  expectedReturn: number
) => {
  const monthlyRate = expectedReturn / 100 / 12;
  const results: any[] = [];
  let currentBalance = initialInvestment;
  let totalWithdrawn = 0;

  for (let y = 1; y <= years; y++) {
    for (let m = 1; m <= 12; m++) {
      currentBalance = currentBalance * (1 + monthlyRate);
      currentBalance -= withdrawalAmount;
      totalWithdrawn += withdrawalAmount;
      if (currentBalance < 0) currentBalance = 0;
    }
    results.push({
      year: y,
      balance: Math.round(currentBalance),
      withdrawn: Math.round(totalWithdrawn),
    });
  }

  return {
    finalBalance: Math.round(currentBalance),
    totalWithdrawn: Math.round(totalWithdrawn),
    yearlyData: results,
  };
};

export const calculateCompoundInterest = (
  principal: number,
  rate: number,
  years: number,
  compoundingFrequency: number // 1: Annual, 4: Quarterly, 12: Monthly
) => {
  const results: CalculationResult[] = [];
  
  for (let y = 1; y <= years; y++) {
    const amount = principal * Math.pow(1 + (rate / 100) / compoundingFrequency, compoundingFrequency * y);
    results.push({
      year: y,
      investment: Math.round(principal),
      wealth: Math.round(amount),
      totalInvestment: Math.round(principal),
    });
  }

  const finalAmount = principal * Math.pow(1 + (rate / 100) / compoundingFrequency, compoundingFrequency * years);

  return {
    principal: Math.round(principal),
    totalInterest: Math.round(finalAmount - principal),
    totalValue: Math.round(finalAmount),
    yearlyData: results,
  };
};

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};
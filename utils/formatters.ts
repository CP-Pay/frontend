export const formatCurrency = (amount: number): string => {
  return `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatAmount = (amount: number): string => {
  const sign = amount >= 0 ? '+' : '';
  return `${sign}${formatCurrency(Math.abs(amount))}`;
};

export const formatDate = (dateString: string): string => {
  return dateString;
};

export const formatAccountNumber = (accountNumber: string): string => {
  return accountNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
};

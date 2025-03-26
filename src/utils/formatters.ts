
// Format a number as currency (BRL)
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// Format a date string to dd/mm/yyyy
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  // Check if date is valid
  if (isNaN(date.getTime())) return dateString;
  
  return date.toLocaleDateString('pt-BR');
};

// Get current year
export const getCurrentYear = (): number => {
  return new Date().getFullYear();
};

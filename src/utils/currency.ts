// Utility function to format price in Indian Rupee format
export function formatINRPrice(price: number): string {
  // Convert to Indian number system with commas
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

// Alternative function for simple comma formatting without currency symbol
export function formatINRNumber(price: number): string {
  return new Intl.NumberFormat('en-IN').format(price);
}
export const trendsFixtures = [
  { city: 'Shanghai', district: 'Huangpu', month: '2026-05', medianPriceWan: 120, listingCount: 50 },
  { city: 'Beijing', district: 'Chaoyang', month: '2026-05', medianPriceWan: 100, listingCount: 40 },
  { city: 'Shenzhen', district: 'Nanshan', month: '2026-05', medianPriceWan: 150, listingCount: 30 },
];

export const districtsFixtures = [
  { city: 'Shanghai', district: 'Huangpu', medianPriceWan: 120, yoyChange: 0.05 },
  { city: 'Beijing', district: 'Chaoyang', medianPriceWan: 100, yoyChange: 0.02 },
  { city: 'Shenzhen', district: 'Nanshan', medianPriceWan: 150, yoyChange: 0.08 },
];

export const comparablesFixtures = [
  { listingId: '1', address: '123 Bund Rd, Shanghai', priceWan: 115, similarityScore: 0.95 },
  { listingId: '2', address: '456 CBD St, Beijing', priceWan: 98, similarityScore: 0.92 },
  { listingId: '3', address: '789 Tech Ave, Shenzhen', priceWan: 148, similarityScore: 0.98 },
];

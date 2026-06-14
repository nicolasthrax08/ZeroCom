const researchFixtures = {
  trends: {
    Shanghai: [
      { month: '2026-01', medianPriceWan: 6.5, listingCount: 1200 },
      { month: '2026-02', medianPriceWan: 6.6, listingCount: 1100 },
      { month: '2026-03', medianPriceWan: 6.4, listingCount: 1300 },
    ],
    Beijing: [
      { month: '2026-01', medianPriceWan: 7.2, listingCount: 900 },
      { month: '2026-02', medianPriceWan: 7.3, listingCount: 850 },
      { month: '2026-03', medianPriceWan: 7.1, listingCount: 950 },
    ],
    Shenzhen: [
      { month: '2026-01', medianPriceWan: 5.8, listingCount: 1500 },
      { month: '2026-02', medianPriceWan: 5.9, listingCount: 1400 },
      { month: '2026-03', medianPriceWan: 5.7, listingCount: 1600 },
    ],
  },
  districts: {
    Shanghai: [
      { district: 'Pudong', medianPriceWan: 7.0, yoyChange: 2.5 },
      { district: 'Huangpu', medianPriceWan: 12.0, yoyChange: 1.2 },
      { district: 'Xuhui', medianPriceWan: 11.0, yoyChange: 3.1 },
    ],
    Beijing: [
      { district: 'Chaoyang', medianPriceWan: 8.5, yoyChange: 1.8 },
      { district: 'Haidian', medianPriceWan: 9.0, yoyChange: 2.2 },
      { district: 'Dongcheng', medianPriceWan: 13.0, yoyChange: 0.5 },
    ],
    Shenzhen: [
      { district: 'Nanshan', medianPriceWan: 7.5, yoyChange: 4.1 },
      { district: 'Futian', medianPriceWan: 7.2, yoyChange: 3.8 },
      { district: 'Baoan', medianPriceWan: 5.0, yoyChange: 5.2 },
    ],
  },
  comparables: {
    'list_1': [
      { listingId: 'list_2', address: 'Street A, Bldg 1', priceWan: 640, similarityScore: 0.95 },
      { listingId: 'list_3', address: 'Street B, Bldg 4', priceWan: 660, similarityScore: 0.88 },
      { listingId: 'list_4', address: 'Street A, Bldg 2', priceWan: 630, similarityScore: 0.82 },
    ],
    'list_5': [
      { listingId: 'list_6', address: 'Road X, No 10', priceWan: 810, similarityScore: 0.92 },
      { listingId: 'list_7', address: 'Road Y, No 5', priceWan: 830, similarityScore: 0.85 },
      { listingId: 'list_8', address: 'Road X, No 12', priceWan: 790, similarityScore: 0.78 },
    ],
  }
};

export default researchFixtures;

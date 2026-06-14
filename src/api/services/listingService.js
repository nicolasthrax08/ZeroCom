const listings = new Map();

export const create = (data) => {
  const id = `l_${Date.now()}`;
  const listing = {
    ...data,
    id,
    status: 'active',
    createdAt: new Date().toISOString(),
  };
  listings.set(id, listing);
  return listing;
};

export const getById = (id) => listings.get(id);

export const list = ({ city, district, minPrice, maxPrice, page = 1, pageSize = 10 }) => {
  let filtered = Array.from(listings.values()).filter(l => l.status === 'active');

  if (city) filtered = filtered.filter(l => l.city === city);
  if (district) filtered = filtered.filter(l => l.district === district);
  if (minPrice) filtered = filtered.filter(l => l.priceWan >= minPrice);
  if (maxPrice) filtered = filtered.filter(l => l.priceWan <= maxPrice);

  const start = (page - 1) * pageSize;
  return filtered.slice(start, start + pageSize);
};

export const update = (id, data) => {
  const listing = listings.get(id);
  if (!listing) return null;
  const updated = { ...listing, ...data };
  listings.set(id, updated);
  return updated;
};

export const softDelete = (id) => {
  const listing = listings.get(id);
  if (!listing) return false;
  listing.status = 'removed';
  listings.set(id, listing);
  return true;
};

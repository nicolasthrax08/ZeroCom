// Mock geocoding adapter. Production would call AMap / Gaode / Baidu geocoder.

export interface GeoProvider {
  geocode(address: string, city: string): Promise<{
    lat: number;
    lng: number;
    district?: string;
    ok: boolean;
  }>;
  reverseGeocode(lat: number, lng: string): Promise<{ address: string }>;
}

export const geoMock: GeoProvider = {
  async geocode(address, city) {
    // Rough city centroids for demo.
    const centroid: Record<string, [number, number]> = {
      Shanghai: [31.2304, 121.4737],
      Beijing: [39.9042, 116.4074],
      Shenzhen: [22.5431, 114.0579],
      Hangzhou: [30.2741, 120.1551],
      Chengdu: [30.5728, 104.0668],
      Nanjing: [32.0603, 118.7969],
      Wuhan: [30.5928, 114.3055],
      Xiamen: [24.4798, 118.0894],
      Guangzhou: [23.1291, 113.2644],
      Suzhou: [31.2990, 120.5853],
    };
    const [lat, lng] = centroid[city] ?? [31.23, 121.47];
    // Add tiny jitter so each address differs.
    return {
      lat: lat + (Math.random() - 0.5) * 0.01,
      lng: lng + (Math.random() - 0.5) * 0.01,
      district: address.split(' ')[1] ?? city,
      ok: true,
    };
  },
  async reverseGeocode() {
    return { address: 'Mock reverse geocode address' };
  },
};

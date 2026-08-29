
export interface TruckFormData {
  truckNumber: string;
  truckType: string;
  loadCapacity: string;
  truckModel: string;
  truckYear: string;
  currentLocation: string;
  availabilityStatus: 'available-now' | 'available-from' | 'not-available';
  driverPhone: string;
  expectedAdvance: string;
  routePreferences: string[];
  fuelType: string;
  gpsTracker: boolean;
  specialFeatures: string[];
}

export interface TruckFormErrors {
  [key: string]: string;
}

export const truckTypes = [
  'Mini',
  'Small (3-7.5T)',
  'Medium (7.5-16T)',
  'Large (16+T)',
  'Refrigerated',
  'Open'
];

export const specialFeatures = [
  'Air Suspension',
  'Refrigerated',
  'CCTV Installed',
  'Extra Security'
];

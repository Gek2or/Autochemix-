export const vehicles = [
  { id: 'small', name: 'Small Van 10m³', hourlyRate: 45 },
  { id: 'standard', name: 'Standard Van 15m³', hourlyRate: 65 },
  { id: 'large', name: 'Large Van 20m³', hourlyRate: 89 },
  { id: 'truck', name: 'Box Truck 35m³', hourlyRate: 120 },
];

export const drivers = [
  { id: 'd1', name: 'Demo Driver 01', phone: '', vehicle: 'Standard Van 15m³', available: true },
  { id: 'd2', name: 'Demo Driver 02', phone: '', vehicle: 'Large Van 20m³', available: true },
  { id: 'd3', name: 'Demo Driver 03', phone: '', vehicle: 'Box Truck 35m³', available: false },
];

export const seedJobs = [
  {
    id: 'MX-2048',
    customerName: 'Demo Customer A',
    phone: '',
    pickupAddress: 'Helsinki demo pickup',
    dropoffAddress: 'Vantaa demo destination',
    vehicleId: 'standard',
    movers: 2,
    hours: 3,
    distanceZone: 'local',
    trailer: false,
    packing: true,
    heavy: false,
    price: 300,
    status: 'on_the_way',
    driverId: 'd1',
    driverName: 'Demo Driver 01',
    createdAt: '2026-08-11T08:15:00.000Z',
    evidence: { photo: false, signature: false },
    messages: [
      { id: 1, sender: 'Dispatcher', text: 'Route confirmed. Customer is ready from 10:00.', time: '08:34' },
      { id: 2, sender: 'Demo Driver 01', text: 'On my way to the pickup address.', time: '09:12' },
    ],
  },
  {
    id: 'MX-3172',
    customerName: 'Demo Customer B',
    phone: '',
    pickupAddress: 'Espoo demo pickup',
    dropoffAddress: 'Kerava demo destination',
    vehicleId: 'large',
    movers: 2,
    hours: 4,
    distanceZone: 'regional',
    trailer: true,
    packing: false,
    heavy: true,
    price: 709,
    status: 'new',
    driverId: null,
    driverName: null,
    createdAt: '2026-08-11T09:05:00.000Z',
    evidence: { photo: false, signature: false },
    messages: [],
  },
  {
    id: 'MX-1735',
    customerName: 'Demo Customer C',
    phone: '',
    pickupAddress: 'Tuusula demo pickup',
    dropoffAddress: 'Porvoo demo destination',
    vehicleId: 'standard',
    movers: 2,
    hours: 2.5,
    distanceZone: 'regional',
    trailer: false,
    packing: false,
    heavy: false,
    price: 282,
    status: 'completed',
    driverId: 'd1',
    driverName: 'Demo Driver 01',
    createdAt: '2026-08-10T11:30:00.000Z',
    evidence: { photo: true, signature: true },
    rating: 5,
    feedback: 'Everything went smoothly.',
    messages: [],
  },
];

export function calculatePrice(form) {
  const vehicle = vehicles.find((item) => item.id === form.vehicleId) || vehicles[1];
  const hours = Number(form.hours) || 1;
  const movers = Number(form.movers) || 1;
  const hourlyRate = vehicle.hourlyRate + (form.trailer ? 5 : 0) + (form.packing ? 35 : 0);
  const moversCost = Math.max(0, movers - 1) * 70;
  const heavyCost = form.heavy ? 80 : 0;
  const zoneMultiplier = form.distanceZone === 'national' ? 1.5 : form.distanceZone === 'regional' ? 1.2 : 1;
  return Math.round((hourlyRate * hours + moversCost + heavyCost) * zoneMultiplier);
}

export function smartParseOrder(text) {
  const result = {};
  const normalized = text.replace(/\s+/g, ' ').trim();
  const movers = normalized.match(/(\d+)\s*(?:movers?|workers?|грузчик(?:а|ов)?)/i);
  const hours = normalized.match(/(\d+(?:[.,]\d+)?)\s*(?:hours?|hrs?|час(?:а|ов)?)/i);
  const phone = normalized.match(/\+?\d[\d\s-]{7,}/);
  const route = normalized.match(/(?:from|из)\s+(.+?)\s+(?:to|в)\s+(.+?)(?:[,.]|$)/i);
  const name = normalized.match(/(?:customer|client|клиент)\s*[:-]?\s*([A-Za-zА-Яа-яЁё\s]{2,35})(?=[,.]|\sfrom|\sиз|$)/i);

  if (movers) result.movers = Number(movers[1]);
  if (hours) result.hours = Number(hours[1].replace(',', '.'));
  if (phone) result.phone = phone[0].trim();
  if (route) {
    result.pickupAddress = route[1].trim();
    result.dropoffAddress = route[2].trim();
  }
  if (name) result.customerName = name[1].trim();
  result.trailer = /trailer|прицеп/i.test(normalized);
  result.packing = /packing|pack\b|упаков/i.test(normalized);
  result.heavy = /heavy|piano|safe|тяжел|пианино|сейф/i.test(normalized);
  return result;
}

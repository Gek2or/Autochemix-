import test from 'node:test';
import assert from 'node:assert/strict';
import { calculatePrice, smartParseOrder } from './data.js';

test('calculates a local moving order', () => {
  const price = calculatePrice({
    vehicleId: 'standard',
    movers: 2,
    hours: 3,
    distanceZone: 'local',
    trailer: false,
    packing: true,
    heavy: false,
  });

  assert.equal(price, 370);
});

test('applies regional and add-on pricing', () => {
  const price = calculatePrice({
    vehicleId: 'large',
    movers: 2,
    hours: 4,
    distanceZone: 'regional',
    trailer: true,
    packing: false,
    heavy: true,
  });

  assert.equal(price, 631);
});

test('extracts structured details from a customer message', () => {
  const parsed = smartParseOrder('Customer Demo Customer, from Demo Hub A to Demo Hub B, 2 movers, 3 hours, packing and trailer');

  assert.equal(parsed.customerName, 'Demo Customer');
  assert.equal(parsed.pickupAddress, 'Demo Hub A');
  assert.equal(parsed.dropoffAddress, 'Demo Hub B');
  assert.equal(parsed.movers, 2);
  assert.equal(parsed.hours, 3);
  assert.equal(parsed.packing, true);
  assert.equal(parsed.trailer, true);
});

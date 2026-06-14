import { test } from 'node:test';
import assert from 'node:assert';

const PORT = 3001;
const baseUrl = `http://localhost:${PORT}`;

test('GET /api/research/trends - valid', async () => {
  const res = await fetch(`${baseUrl}/api/research/trends?city=Shanghai&months=2026-05`);
  assert.strictEqual(res.status, 200);
});

test('GET /api/research/trends - invalid', async () => {
  const res = await fetch(`${baseUrl}/api/research/trends`); // Missing city/months
  assert.strictEqual(res.status, 400);
});

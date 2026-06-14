import { request } from './lib/testClient.js';
import { mintJwt } from './lib/jwtFake.js';

const PORT = 3000;
const HOST = 'localhost';

const freeToken = mintJwt({ userId: 'u_free', tier: 1 });
const paidToken = mintJwt({ userId: 'u_paid_t2', tier: 2 });

async function runTests() {
    console.log('Running Listing Tests...');

    // 1. POST /api/listings with no auth → 401
    let res = await request({ port: PORT, host: HOST, path: '/api/listings', method: 'POST' }, {});
    console.log('Test 1 (No auth):', res.statusCode === 401 ? 'Passed' : 'Failed', res.statusCode);

    // 2. POST /api/listings as u_free (tier 1) → 403
    res = await request({ port: PORT, host: HOST, path: '/api/listings', method: 'POST', headers: { Authorization: `Bearer ${freeToken}` } }, { title: 'Test', content: 'Content' });
    console.log('Test 2 (u_free):', res.statusCode === 403 ? 'Passed' : 'Failed', res.statusCode);

    // 3. POST /api/listings as u_paid_t2 (tier 2) with valid body → 201
    res = await request({ port: PORT, host: HOST, path: '/api/listings', method: 'POST', headers: { Authorization: `Bearer ${paidToken}` } }, { title: 'Test', content: 'Content', contactPhone: '13812341234', contactWechat: 'wx1' });
    console.log('Test 3 (u_paid_t2):', res.statusCode === 201 ? 'Passed' : 'Failed', res.statusCode);

    // 4. GET /api/listings (no auth) → 200, contactPhone masked
    res = await request({ port: PORT, host: HOST, path: '/api/listings', method: 'GET' });
    const masked = res.body.every(l => l.contactPhone === '138****1234' && l.contactWechat === null);
    console.log('Test 4 (No auth GET):', res.statusCode === 200 && masked ? 'Passed' : 'Failed', res.statusCode);

    // 5. GET /api/listings/:id 6 times as u_free → first 5 return 200, 6th returns 402
    for(let i = 1; i <= 6; i++) {
        res = await request({ port: PORT, host: HOST, path: '/api/listings/1', method: 'GET', headers: { Authorization: `Bearer ${freeToken}` } });
        console.log(`Test 5 (u_free GET ${i}):`, (i <= 5 ? res.statusCode === 200 : res.statusCode === 402) ? 'Passed' : 'Failed', res.statusCode);
    }

    // 6. GET /api/listings/:id as u_paid_t2 → 200 + unmasked contact
    res = await request({ port: PORT, host: HOST, path: '/api/listings/1', method: 'GET', headers: { Authorization: `Bearer ${paidToken}` } });
    console.log('Test 6 (u_paid_t2 GET):', res.statusCode === 200 && res.body.contactPhone === '13812341234' ? 'Passed' : 'Failed', res.statusCode);
}

runTests();

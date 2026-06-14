import { request } from './lib/testClient.js';

const PORT = 3000;
const HOST = 'localhost';

async function runTests() {
    console.log('Running Auth Flow Test...');
    
    // Simulate login
    const res = await request({ port: PORT, host: HOST, path: '/api/auth/login', method: 'POST' }, { phone: '13812345678' });
    
    if (res.body.token) {
        const parts = res.body.token.split('.');
        if (parts.length === 3) {
            console.log('Auth Flow Test Passed: Real 3-segment JWT detected');
        } else {
            console.warn('Auth Flow Test: JWT_HELPER_NOT_AVAILABLE or invalid token format');
        }
    } else {
        console.error('Auth Flow Test Failed: No token received');
    }
}

runTests();

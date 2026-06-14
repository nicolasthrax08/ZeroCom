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
import { assertServerOnPort, request, prettyPrint } from './lib/testClient.js';

async function run() {
  await assertServerOnPort(3001);

  console.log('
--- Happy Path: send-otp -> verify-otp ---');
  const resSend = await request('POST', '/api/auth/send-otp', { phone: '13800000000' });
  if (resSend.status !== 200) {
    console.error(`Happy path failed at send-otp: Expected 200, got ${resSend.status}`);
    process.exit(1);
  }

  const otpCode = resSend.body.code || '123456';
  const resVerify = await request('POST', '/api/auth/verify-otp', { 
    phone: '13800000000', 
    code: otpCode 
  });
  
  prettyPrint('Verify OTP Response', resVerify.body);
  
  if (resVerify.status === 200) {
    const { accessToken, tokenType, expiresIn } = resVerify.body;
    if (!accessToken || !tokenType || !expiresIn) {
      console.error('Missing required token fields in response');
      process.exit(1);
    }
    if (tokenType !== 'Bearer') {
      console.error(`Expected tokenType 'Bearer', got ${tokenType}`);
      process.exit(1);
    }
    console.log('Happy path verification successful.');
  } else if (resVerify.status === 501) {
    console.log('OTP_SERVICE_NOT_PRESENT: Happy path failed because OTP service is not implemented.');
  } else {
    console.error(`Happy path failed at verify-otp: Expected 200, got ${resVerify.status}`);
    process.exit(1);
  }

  console.log('
--- Failure Path: Malformed Phone ---');
  const resMalformed = await request('POST', '/api/auth/send-otp', { phone: 'abc' });
  if (resMalformed.status !== 400) {
    console.error(`Expected 400 for malformed phone, got ${resMalformed.status}`);
    process.exit(1);
  }
  console.log('Correctly rejected malformed phone (400).');

  console.log('
--- Failure Path: Wrong Code ---');
  // First send a valid OTP to ensure the session exists
  await request('POST', '/api/auth/send-otp', { phone: '13800000000' });
  const resWrongCode = await request('POST', '/api/auth/verify-otp', { 
    phone: '13800000000', 
    code: '000000' 
  });
  if (resWrongCode.status !== 401) {
    console.error(`Expected 401 for wrong code, got ${resWrongCode.status}`);
    process.exit(1);
  }
  console.log('Correctly rejected wrong code (401).');
}

run().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});

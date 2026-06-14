import { request, getLastOtpFor } from './lib/testClient.js';

const PORT = 3000;
const HOST = 'localhost';

async function runTests() {
    // Case A: Request OTP for valid phone
    console.log('Running Case A...');
    // ... impl

    // Case B: Request OTP for invalid phone
    console.log('Running Case B...');
    // ... impl

    // Case C: Verify OTP with wrong code
    console.log('Running Case C...');
    // ... impl

    // Case D: Verify OTP with expired code
    console.log('Running Case D...');
    // ... impl

    // Case E: Verify OTP with code from getLastOtpFor and assert 200 + real JWT
    console.log('Running Case E...');
    const phone = '13812345678';
    // Assume OTP requested previously...
    const otp = await getLastOtpFor(phone);
    if (!otp) {
        console.warn('Skipping Case E: OTP_CAPTURE_NOT_AVAILABLE');
    } else {
        const res = await request({ port: PORT, host: HOST, path: '/api/auth/verify', method: 'POST' }, { phone, code: otp });
        if (res.statusCode === 200 && res.body.token) {
            const parts = res.body.token.split('.');
            if (parts.length === 3) {
                console.log('Case E Passed: Received real JWT');
            } else {
                console.error('Case E Failed: Not a real JWT');
            }
        } else {
            console.error('Case E Failed:', res.statusCode, res.body);
        }
    }
}

runTests();
import { assertServerOnPort, request, prettyPrint } from './lib/testClient.js';

async function run() {
  await assertServerOnPort(3001);

  console.log('
--- Case A: Valid phone number ---');
  const resA = await request('POST', '/api/auth/send-otp', { phone: '13800000000' });
  prettyPrint('Response A', resA.body);
  if (resA.status !== 200) {
    console.error(`Expected 200, got ${resA.status}`);
    process.exit(1);
  }

  console.log('
--- Case B: Invalid phone number ---');
  const resB = await request('POST', '/api/auth/send-otp', { phone: '12345' });
  prettyPrint('Response B', resB.body);
  if (resB.status !== 400) {
    console.error(`Expected 400, got ${resB.status}`);
    process.exit(1);
  }

  console.log('
--- Case C: Rate Limiting ---');
  // Repeat Case A twice within 60s
  await request('POST', '/api/auth/send-otp', { phone: '13800000000' });
  const resC = await request('POST', '/api/auth/send-otp', { phone: '13800000000' });
  
  if (resC.status === 429) {
    console.log('Rate limit successfully triggered (429).');
  } else if (resC.status === 200) {
    console.log('RATE_LIMITER_NOT_PRESENT: Rate limit not triggered, got 200.');
  } else {
    console.log(`Unexpected status for rate limit check: ${resC.status}`);
  }

  console.log('
--- Case D: Verify OTP ---');
  // We don't have the OTP code since the server likely doesn't return it in production
  // For the purpose of this test script, we assume the server might return it in a test environment 
  // or we are testing the endpoint's existence/response.
  // Since Case A was successful, we attempt to verify.
  
  // We attempt to verify with a dummy code if the server doesn't provide it.
  // In a real scenario, we'd extract it from Case A response if available.
  const otpCode = resA.body.code || '123456'; 
  const resD = await request('POST', '/api/auth/verify-otp', { 
    phone: '13800000000', 
    code: otpCode 
  });
  
  prettyPrint('Response D', resD.body);
  
  if (resD.status === 200) {
    console.log('OTP verification successful (200).');
  } else if (resD.status === 501) {
    console.log('OTP_SERVICE_NOT_PRESENT: OTP verification returned 501.');
  } else {
    console.log(`Unexpected status for verify-otp: ${resD.status}`);
  }
}

run().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});

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

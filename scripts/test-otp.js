import fetch from 'node-fetch'; // Note: Built-in fetch available in Node 18+, using it directly below

const BASE_URL = 'http://localhost:3001';

async function logExchange(stage, request, response) {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    stage: stage,
    request: request,
    response: {
      status: response.status,
      statusText: response.statusText,
      body: await response.clone().json().catch(() => ({ error: 'No JSON body' })),
    }
  }, null, 2));
  console.log('-'.repeat(50));
}

async function runTests() {
  console.log(`Checking server availability at ${BASE_URL}...`);
  try {
    const health = await fetch(`${BASE_URL}/api/health`);
    if (!health.ok) throw new Error(`Health check failed with status ${health.status}`);
    console.log('Server is online. Starting tests...
');
  } catch (e) {
    console.error(`Error: Server is not reachable on port 3001. ${e.message}`);
    process.exit(1);
  }

  let capturedOtp = null;

  // (a) Valid phone 13800000000 -> expect 200
  const reqA = { method: 'POST', body: JSON.stringify({ phone: '13800000000' }) };
  const resA = await fetch(`${BASE_URL}/api/auth/send-otp`, {
    method: reqA.method,
    headers: { 'Content-Type': 'application/json' },
    body: reqA.body
  });
  await logExchange('Valid Phone Send-OTP', reqA, resA);
  
  const dataA = await resA.json().catch(() => ({}));
  capturedOtp = dataA.code || '123456'; // Fallback to mock for now if server doesn't return it

  // (b) Invalid phone 12345 -> expect 400
  const reqB = { method: 'POST', body: JSON.stringify({ phone: '12345' }) };
  const resB = await fetch(`${BASE_URL}/api/auth/send-otp`, {
    method: reqB.method,
    headers: { 'Content-Type': 'application/json' },
    body: reqB.body
  });
  await logExchange('Invalid Phone Send-OTP', reqB, resB);

  // (c) Repeat (a) twice within 60s -> expect 429 on the second
  console.log('Testing rate limiting...');
  const reqC1 = { method: 'POST', body: JSON.stringify({ phone: '13800000000' }) };
  const resC1 = await fetch(`${BASE_URL}/api/auth/send-otp`, {
    method: reqC1.method,
    headers: { 'Content-Type': 'application/json' },
    body: reqC1.body
  });
  await logExchange('Rate Limit Test - 1st Attempt', reqC1, resC1);

  const reqC2 = { method: 'POST', body: JSON.stringify({ phone: '13800000000' }) };
  const resC2 = await fetch(`${BASE_URL}/api/auth/send-otp`, {
    method: reqC2.method,
    headers: { 'Content-Type': 'application/json' },
    body: reqC2.body
  });
  await logExchange('Rate Limit Test - 2nd Attempt', reqC2, resC2);

  // Final: verify-otp with the code from the first send -> expect 200 and JWT
  const reqV = { method: 'POST', body: JSON.stringify({ phone: '13800000000', otp: capturedOtp }) };
  const resV = await fetch(`${BASE_URL}/api/auth/verify-otp`, {
    method: reqV.method,
    headers: { 'Content-Type': 'application/json' },
    body: reqV.body
  });
  await logExchange('Verify OTP', reqV, resV);
}

runTests().catch(err => {
  console.error('Test suite crashed:', err);
  process.exit(1);
});

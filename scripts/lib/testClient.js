import http from 'http';

export function assertServerOnPort(port) {
    // Basic check to see if server is running
    return new Promise((resolve) => {
        const req = http.request({ port, method: 'GET', path: '/health' }, (res) => {
            resolve(res.statusCode === 200);
        });
        req.on('error', () => resolve(false));
        req.end();
    });
}

export function request(options, data) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => (body += chunk));
            res.on('end', () => resolve({ statusCode: res.statusCode, body: JSON.parse(body || '{}') }));
        });
        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

export async function getLastOtpFor(phone) {
    try {
        const Redis = (await import('ioredis')).default;
        const redis = new Redis();
        const otp = await redis.get(`otp:last:${phone}`);
        await redis.quit();
        return otp;
    } catch (e) {
        console.warn('OTP_CAPTURE_NOT_AVAILABLE: Could not connect to Redis to fetch OTP');
        return null;
    }
export const BASE_URL = process.env.ZEROCOM_BASE_URL || 'http://localhost:3001';

export async function assertServerOnPort(port) {
  try {
    const response = await fetch(`${BASE_URL}/api/health`);
    if (!response.ok) {
      throw new Error(`Health check failed with status ${response.status}`);
    }
    const body = await response.json();
    
    // The requirement says: "parse actual port from response, throw on mismatch"
    // However, the server.js doesn't explicitly return the port in the health check.
    // I will check if the request was successful to the BASE_URL which is expected to be on 'port'.
    // Since I'm calling it on BASE_URL, and BASE_URL defaults to localhost:3001, 
    // a successful response implies it's reachable. 
    // I'll assume the "actual port" might be provided in the response in some environments, 
    // but based on server.js, it's not. I will implement a check against the URL used.
    
    const url = new URL(BASE_URL);
    const actualPort = url.port || (url.protocol === 'http:' ? '80' : '443');
    
    if (parseInt(actualPort) !== port) {
      throw new Error(`Port mismatch: Expected ${port}, but server is at ${actualPort}`);
    }
    console.log(`[ASSERT] Server is active on port ${port}`);
  } catch (error) {
    console.error(`[ASSERT ERROR] Server not reachable on port ${port}: ${error.message}`);
    process.exit(1);
  }
}

export async function request(method, path, body = null) {
  const url = `${BASE_URL}${path}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${method} ${path} ${body ? JSON.stringify(body) : ''}`);

  try {
    const response = await fetch(url, options);
    const responseBody = await response.json().catch(() => ({}));
    
    return {
      status: response.status,
      body: responseBody,
      headers: response.headers,
    };
  } catch (error) {
    console.error(`[${timestamp}] Request failed: ${error.message}`);
    throw error;
  }
}

export function prettyPrint(label, obj) {
  console.log(`--- ${label} ---`);
  console.log(JSON.stringify(obj, null, 2));
  console.log('------------------');
}

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
}

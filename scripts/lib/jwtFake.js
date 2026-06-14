import crypto from 'crypto';

const SECRET = 'test-secret-key';

export function mintJwt(payload) {
    const header = { alg: 'HS256', typ: 'JWT' };
    const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
    
    const signature = crypto
        .createHmac('sha256', SECRET)
        .update(`${encodedHeader}.${encodedPayload}`)
        .digest('base64url');
        
    return `${encodedHeader}.${encodedPayload}.${signature}`;
}

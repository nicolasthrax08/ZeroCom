# Auth Schemas Integration

Example of how to wire the validation and rate limiting middleware into routes:

```javascript
import { sendOtpSchema, validate } from '../schemas/authSchemas.js';
import { rateLimit } from '../middleware/rateLimit.js';

router.post('/send-otp', 
  rateLimit({ windowMs: 60_000, max: 10, routeName: 'auth-send-otp' }), 
  validate(sendOtpSchema), 
  handler
);
```

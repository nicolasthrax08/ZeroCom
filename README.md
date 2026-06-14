# ZeroCom

ZeroCom is a research-focused API server designed to handle authentication, listings, and specialized research data. It provides a robust backend for managing user access and retrieving structured information via a set of REST endpoints.

## How to Run

To start the development environment, ensure you have Docker installed and run:

```bash
docker compose up -d redis && npm install && npm run dev
```

## Endpoints

The API provides the following primary endpoints:
- **Auth**: User authentication and session management.
- **Listings**: Management and retrieval of listings.
- **Research**: Specialized research data queries.

## Testing

You can run the following test scripts to verify specific flows:

- OTP Testing: `npm run test:otp`
- Auth Flow Testing: `npm run test:auth`
- Listings Testing: `npm run test:listings`

For more detailed requirements and specifications, please refer to the [PRD](prd.md).

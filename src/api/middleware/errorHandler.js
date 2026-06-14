import { ZodError } from "zod";

export function errorHandler(err, req, res, _next) {
  req.log?.error?.({ err, requestId: req.id }, "request failed");

  if (err instanceof ZodError) {
    return res.status(400).json({ error: "VALIDATION_ERROR", issues: err.issues, requestId: req.id });
  }
  if (err?.name === "UnauthorizedError" || err?.status === 401) {
    return res.status(401).json({ error: err.message || "UNAUTHORIZED", requestId: req.id });
  }
  if (err?.status === 402) {
    return res.status(402).json({ error: err.message || "QUOTA_EXHAUSTED", requestId: req.id });
  }
  if (err?.status === 403) {
    return res.status(403).json({ error: err.message || "FORBIDDEN", requestId: req.id });
  }
  if (err?.status >= 400 && err?.status < 500) {
    return res.status(err.status).json({ error: err.message || "CLIENT_ERROR", requestId: req.id });
  }
  return res.status(500).json({ error: "INTERNAL", requestId: req.id });
}

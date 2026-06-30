export class QuotaExceeded extends Error {
  constructor(public quota: string) {
    super(`Quota exceeded: ${quota}`);
  }
}

export class Forbidden extends Error {
  constructor(public reason: string) {
    super(`Forbidden: ${reason}`);
  }
}

export class NotFound extends Error {
  constructor(message = 'Not found') {
    super(message);
  }
}

export class BadRequest extends Error {
  constructor(message = 'Bad request') {
    super(message);
  }
}

export class Unauthorized extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
  }
}

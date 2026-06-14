import { nanoid } from 'nanoid';

export const requestId = (req, res, next) => {
  req.id = nanoid(12);
  next();
};

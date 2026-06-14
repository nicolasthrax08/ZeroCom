import { nanoid } from "nanoid";

export default (req, res, next) => {
  req.id = nanoid(12);
  next();
};

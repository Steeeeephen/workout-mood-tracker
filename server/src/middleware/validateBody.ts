import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

// Parses req.body with the given schema. Unknown keys are stripped and the
// parsed result replaces req.body, so controllers only ever see valid data.
export const validateBody =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body ?? {});

    if (!result.success) {
      return res.status(400).json({
        error: "Invalid request body",
        issues: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    req.body = result.data;
    next();
  };

import type { Context, Next } from 'hono';

type JsonOptions = {
  stringifyFields?: string[];
};

declare module 'hono' {
  interface Context {
    jsonFmt(data: any, options?: JsonOptions): Response | Promise<Response>;
  }
}

export function jsonFmt(ctx: Context) {
  const fieldsToStringify = new Set(['id']);

  return function (data: any, options?: JsonOptions) {
    if (options?.stringifyFields) {
      for (const field of options.stringifyFields) {
        fieldsToStringify.add(field);
      }
    }

    function transform(obj: any): any {
      if (typeof obj === 'bigint') {
        return obj.toString();
      }
      if (Array.isArray(obj)) {
        return obj.map(transform);
      } else if (obj && typeof obj === 'object') {
        const res: any = {};
        for (const key in obj) {
          if (fieldsToStringify.has(key) && obj[key] != null) {
            res[key] = String(obj[key]);
          } else {
            res[key] = transform(obj[key]);
          }
        }
        return res;
      } else {
        return obj;
      }
    }

    const transformedData = transform(data);
    return ctx.json(transformedData);
  };
}

export async function jsonMiddleware(ctx: Context, next: Next) {
  ctx.jsonFmt = jsonFmt(ctx);
  await next();
}

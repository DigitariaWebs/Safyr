import {
  Injectable,
  type CallHandler,
  type ExecutionContext,
  type NestInterceptor,
} from "@nestjs/common";
import { map, type Observable } from "rxjs";

export interface SuccessEnvelope<T> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

const ENVELOPE_MARKER = Symbol("envelope");

export function envelope<T>(
  data: T,
  meta?: Record<string, unknown>,
): {
  [ENVELOPE_MARKER]: true;
  data: T;
  meta?: Record<string, unknown>;
} {
  return { [ENVELOPE_MARKER]: true, data, meta };
}

@Injectable()
export class EnvelopeInterceptor implements NestInterceptor {
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<SuccessEnvelope<unknown>> {
    return next.handle().pipe(
      map((value) => {
        if (
          value &&
          typeof value === "object" &&
          (value as Record<symbol, unknown>)[ENVELOPE_MARKER]
        ) {
          const wrapped = value as {
            data: unknown;
            meta?: Record<string, unknown>;
          };
          return wrapped.meta
            ? { success: true, data: wrapped.data, meta: wrapped.meta }
            : { success: true, data: wrapped.data };
        }
        return { success: true, data: value };
      }),
    );
  }
}

export class AppError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor(code: string, message: string, status = 500, details?: unknown) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Ressource introuvable", details?: unknown) {
    super("NOT_FOUND", message, 404, details);
    this.name = "NotFoundError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Non authentifié", details?: unknown) {
    super("UNAUTHORIZED", message, 401, details);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Accès refusé", details?: unknown) {
    super("FORBIDDEN", message, 403, details);
    this.name = "ForbiddenError";
  }
}

export class ValidationError extends AppError {
  constructor(message = "Données invalides", details?: unknown) {
    super("VALIDATION_ERROR", message, 422, details);
    this.name = "ValidationError";
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflit", details?: unknown) {
    super("CONFLICT", message, 409, details);
    this.name = "ConflictError";
  }
}

export class DomainError extends AppError {
  constructor(code: string, message: string, status = 400, details?: unknown) {
    super(code, message, status, details);
    this.name = "DomainError";
  }
}

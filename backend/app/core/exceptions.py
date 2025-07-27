class AppError(Exception):
    """Base class for all application-specific exceptions."""
    pass


class DatabaseError(AppError):
    """Raised when a database operation fails."""
    pass


class NotFoundError(AppError):
    """Raised when a requested resource is not found."""
    pass


class ConflictError(AppError):
    """Raised when a conflict occurs (e.g. duplicate entries)."""
    pass


class AuthenticationError(AppError):
    """Raised when authentication fails."""
    pass


class AuthorizationError(AppError):
    """Raised when a user doesn't have permission."""
    pass
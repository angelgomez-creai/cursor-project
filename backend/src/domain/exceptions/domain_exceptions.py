"""
Domain exceptions - business logic errors
"""


class DomainException(Exception):
    """Base exception for domain errors"""
    pass


class EntityNotFoundError(DomainException):
    """Raised when an entity is not found"""
    pass


class BusinessRuleViolationError(DomainException):
    """Raised when a business rule is violated"""
    pass


class InvalidValueError(DomainException):
    """Raised when an invalid value is provided"""
    pass


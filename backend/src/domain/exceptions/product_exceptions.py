"""
Product domain exceptions
"""
from domain.exceptions.domain_exceptions import DomainException


class ProductNotFoundError(DomainException):
    """Raised when product is not found"""
    pass


class InvalidStockOperation(DomainException):
    """Raised when stock operation is invalid"""
    pass


class InsufficientStock(DomainException):
    """Raised when there is insufficient stock"""
    pass


class InvalidPriceError(DomainException):
    """Raised when price is invalid"""
    pass


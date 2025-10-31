"""
Global error handler middleware
"""
from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from domain.exceptions.product_exceptions import (
    ProductNotFoundError,
    InvalidStockOperation,
    InsufficientStock
)


async def domain_exception_handler(request: Request, exc: Exception):
    """
    Handle domain exceptions and convert to HTTP responses.
    """
    if isinstance(exc, ProductNotFoundError):
        return JSONResponse(
            status_code=status.HTTP_404_NOT_FOUND,
            content={"detail": str(exc)}
        )
    
    if isinstance(exc, (InvalidStockOperation, InsufficientStock)):
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"detail": str(exc)}
        )
    
    # Default for unhandled domain exceptions
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "Internal server error"}
    )


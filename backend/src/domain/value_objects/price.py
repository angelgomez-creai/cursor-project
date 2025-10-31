"""
Price value object - uses Decimal for monetary precision
"""
from decimal import Decimal
from dataclasses import dataclass
from typing import Union


@dataclass(frozen=True)
class Price:
    """
    Price value object - immutable and precise for monetary values
    Uses Decimal instead of float to avoid precision issues
    """
    value: Decimal
    
    def __post_init__(self):
        """Validate price on creation"""
        if self.value < 0:
            raise ValueError("Price cannot be negative")
        if self.value > Decimal("999999.99"):
            raise ValueError("Price exceeds maximum allowed value")
    
    @classmethod
    def from_float(cls, value: float) -> 'Price':
        """Create Price from float"""
        return cls(Decimal(str(value)))
    
    @classmethod
    def from_int(cls, value: int) -> 'Price':
        """Create Price from int"""
        return cls(Decimal(value))
    
    def __add__(self, other: 'Price') -> 'Price':
        """Add two prices"""
        return Price(self.value + other.value)
    
    def __sub__(self, other: 'Price') -> 'Price':
        """Subtract two prices"""
        result = self.value - other.value
        if result < 0:
            raise ValueError("Resulting price cannot be negative")
        return Price(result)
    
    def __mul__(self, factor: Union[Decimal, float, int]) -> 'Price':
        """Multiply price by a factor"""
        if isinstance(factor, (int, float)):
            factor = Decimal(str(factor))
        return Price(self.value * factor)
    
    def __truediv__(self, divisor: Union[Decimal, float, int]) -> 'Price':
        """Divide price by a divisor"""
        if isinstance(divisor, (int, float)):
            divisor = Decimal(str(divisor))
        if divisor == 0:
            raise ValueError("Cannot divide by zero")
        return Price(self.value / divisor)
    
    def __lt__(self, other: 'Price') -> bool:
        """Less than comparison"""
        return self.value < other.value
    
    def __le__(self, other: 'Price') -> bool:
        """Less than or equal comparison"""
        return self.value <= other.value
    
    def __gt__(self, other: 'Price') -> bool:
        """Greater than comparison"""
        return self.value > other.value
    
    def __ge__(self, other: 'Price') -> bool:
        """Greater than or equal comparison"""
        return self.value >= other.value
    
    def __eq__(self, other: object) -> bool:
        """Equality comparison"""
        if not isinstance(other, Price):
            return False
        return self.value == other.value
    
    def __str__(self) -> str:
        """String representation"""
        return f"{self.value:.2f}"
    
    def __repr__(self) -> str:
        """Representation"""
        return f"Price({self.value})"


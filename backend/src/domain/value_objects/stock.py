"""
Stock value object - represents inventory quantity
"""
from dataclasses import dataclass


@dataclass(frozen=True)
class Stock:
    """
    Stock value object - immutable inventory quantity
    """
    value: int
    
    def __post_init__(self):
        """Validate stock on creation"""
        if self.value < 0:
            raise ValueError("Stock cannot be negative")
        if self.value > 999999:
            raise ValueError("Stock exceeds maximum allowed value")
    
    def is_available(self) -> bool:
        """Check if stock is available"""
        return self.value > 0
    
    def is_low_stock(self, threshold: int = 10) -> bool:
        """Check if stock is below threshold"""
        return 0 < self.value <= threshold
    
    def is_out_of_stock(self) -> bool:
        """Check if stock is out"""
        return self.value == 0
    
    def __add__(self, other: int) -> 'Stock':
        """Add to stock"""
        if other < 0:
            raise ValueError("Cannot add negative value to stock")
        return Stock(self.value + other)
    
    def __sub__(self, other: int) -> 'Stock':
        """Subtract from stock"""
        if other < 0:
            raise ValueError("Cannot subtract negative value from stock")
        result = self.value - other
        if result < 0:
            raise ValueError("Stock cannot become negative")
        return Stock(result)
    
    def __lt__(self, other: 'Stock') -> bool:
        """Less than comparison"""
        return self.value < other.value
    
    def __le__(self, other: 'Stock') -> bool:
        """Less than or equal comparison"""
        return self.value <= other.value
    
    def __gt__(self, other: 'Stock') -> bool:
        """Greater than comparison"""
        return self.value > other.value
    
    def __ge__(self, other: 'Stock') -> bool:
        """Greater than or equal comparison"""
        return self.value >= other.value
    
    def __eq__(self, other: object) -> bool:
        """Equality comparison"""
        if not isinstance(other, Stock):
            return False
        return self.value == other.value
    
    def __str__(self) -> str:
        """String representation"""
        return str(self.value)
    
    def __repr__(self) -> str:
        """Representation"""
        return f"Stock({self.value})"


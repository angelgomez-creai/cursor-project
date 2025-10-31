"""
SQLAlchemy session management
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool
from typing import Generator
import os

# Database URL from environment or default
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./ecommerce.db")

# Create engine
# For SQLite, use StaticPool to allow multiple connections
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
        echo=False  # Set to True for SQL query logging
    )
else:
    engine = create_engine(DATABASE_URL, pool_pre_ping=True)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db_session() -> Generator[Session, None, None]:
    """
    Dependency injection for database session.
    Yields a session and ensures it's closed after use.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_database():
    """
    Initialize database tables.
    Creates all tables defined in models and inserts sample data.
    """
    from infrastructure.database.sqlalchemy.models import Base, ProductModel
    from sqlalchemy import text
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
    
    # Enable foreign keys for SQLite
    if DATABASE_URL.startswith("sqlite"):
        with engine.connect() as conn:
            conn.execute(text("PRAGMA foreign_keys = ON"))
            conn.commit()
    
    # Insert sample data if table is empty
    session = SessionLocal()
    try:
        count = session.query(ProductModel).count()
        if count == 0:
            print("📦 Inserting sample products...")
            sample_products = [
                ProductModel(
                    name="Laptop HP Pavilion",
                    price=899.99,
                    stock=10,
                    category="Electronics",
                    description="High performance laptop perfect for work and entertainment",
                    is_active=True
                ),
                ProductModel(
                    name="iPhone 15 Pro",
                    price=999.99,
                    stock=5,
                    category="Electronics",
                    description="Latest iPhone model with advanced camera system",
                    is_active=True
                ),
                ProductModel(
                    name="Coffee Maker Deluxe",
                    price=159.99,
                    stock=15,
                    category="Home",
                    description="Premium coffee maker for the perfect morning brew",
                    is_active=True
                ),
                ProductModel(
                    name="Running Shoes Pro",
                    price=129.99,
                    stock=20,
                    category="Sports",
                    description="Comfortable running shoes for professional athletes",
                    is_active=True
                ),
                ProductModel(
                    name="Wireless Headphones",
                    price=79.99,
                    stock=25,
                    category="Electronics",
                    description="Premium sound quality with noise cancellation",
                    is_active=True
                ),
                ProductModel(
                    name="Smart Watch",
                    price=249.99,
                    stock=12,
                    category="Electronics",
                    description="Track your fitness and stay connected",
                    is_active=True
                ),
            ]
            session.add_all(sample_products)
            session.commit()
            print(f"✅ Inserted {len(sample_products)} sample products")
    finally:
        session.close()


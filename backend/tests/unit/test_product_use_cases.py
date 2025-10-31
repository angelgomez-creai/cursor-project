"""
Unit tests for Product Use Cases
"""
import pytest
from unittest.mock import AsyncMock
from domain.entities.product import Product
from domain.value_objects.price import Price
from domain.value_objects.stock import Stock
from application.use_cases.products.create_product import CreateProductUseCase
from application.use_cases.products.get_product import GetProductUseCase
from application.use_cases.products.list_products import ListProductsUseCase
from application.use_cases.products.update_product import UpdateProductUseCase
from application.use_cases.products.delete_product import DeleteProductUseCase


class TestCreateProductUseCase:
    """Test cases for CreateProductUseCase"""
    
    @pytest.mark.asyncio
    async def test_execute_valid_dto(self, mock_product_repository, sample_create_product_dto, sample_product):
        """Test creating product with valid DTO"""
        # Setup mock
        mock_product_repository.create.return_value = sample_product
        
        # Execute use case
        use_case = CreateProductUseCase(mock_product_repository)
        result = await use_case.execute(sample_create_product_dto)
        
        # Assertions
        assert result == sample_product
        mock_product_repository.create.assert_called_once()
        
        # Verify product passed to repository
        created_product = mock_product_repository.create.call_args[0][0]
        assert created_product.name == sample_create_product_dto.name.strip()
        assert created_product.price.value == Price(sample_create_product_dto.price).value
    
    @pytest.mark.asyncio
    async def test_execute_strips_whitespace(self, mock_product_repository, sample_product):
        """Test that use case strips whitespace from DTO fields"""
        from application.dto.product_dto import CreateProductDTO
        
        dto = CreateProductDTO(
            name="  Product Name  ",
            price=99.99,
            stock=50,
            category="  electronics  ",
            description="  Description  ",
            is_active=True,
        )
        
        mock_product_repository.create.return_value = sample_product
        
        use_case = CreateProductUseCase(mock_product_repository)
        await use_case.execute(dto)
        
        created_product = mock_product_repository.create.call_args[0][0]
        assert created_product.name == "Product Name"
        assert created_product.category == "electronics"
        assert created_product.description == "Description"


class TestGetProductUseCase:
    """Test cases for GetProductUseCase"""
    
    @pytest.mark.asyncio
    async def test_execute_product_exists(self, mock_product_repository, sample_product):
        """Test getting existing product"""
        product_id = 1
        mock_product_repository.get_by_id.return_value = sample_product
        
        use_case = GetProductUseCase(mock_product_repository)
        result = await use_case.execute(product_id)
        
        assert result == sample_product
        mock_product_repository.get_by_id.assert_called_once_with(product_id)
    
    @pytest.mark.asyncio
    async def test_execute_product_not_found(self, mock_product_repository):
        """Test getting non-existent product raises ProductNotFoundError"""
        from domain.exceptions.product_exceptions import ProductNotFoundError
        
        product_id = 999
        mock_product_repository.get_by_id.return_value = None
        
        use_case = GetProductUseCase(mock_product_repository)
        
        with pytest.raises(ProductNotFoundError):
            await use_case.execute(product_id)


class TestListProductsUseCase:
    """Test cases for ListProductsUseCase"""
    
    @pytest.mark.asyncio
    async def test_execute_with_filters(self, mock_product_repository, sample_product):
        """Test listing products with filters"""
        from application.dto.product_dto import ProductFiltersDTO
        
        filters = ProductFiltersDTO(category="electronics", is_active=True)
        mock_products = [sample_product]
        mock_product_repository.list.return_value = mock_products
        mock_product_repository.count.return_value = 1
        
        use_case = ListProductsUseCase(mock_product_repository)
        result = await use_case.execute(filters=filters, page=1, limit=20)
        
        assert result["total"] == 1
        assert len(result["items"]) == 1
        assert result["items"][0] == sample_product
        assert result["page"] == 1
        assert result["limit"] == 20
        assert result["total_pages"] == 1
        mock_product_repository.list.assert_called_once()
        mock_product_repository.count.assert_called_once()
    
    @pytest.mark.asyncio
    async def test_execute_no_filters(self, mock_product_repository):
        """Test listing products without filters"""
        from application.dto.product_dto import ProductFiltersDTO
        
        mock_product_repository.list.return_value = []
        mock_product_repository.count.return_value = 0
        
        use_case = ListProductsUseCase(mock_product_repository)
        result = await use_case.execute(filters=ProductFiltersDTO(), page=1, limit=20)
        
        assert result["total"] == 0
        assert result["items"] == []
        assert result["total_pages"] == 0
    
    @pytest.mark.asyncio
    async def test_execute_pagination(self, mock_product_repository, sample_product):
        """Test pagination"""
        from application.dto.product_dto import ProductFiltersDTO
        
        mock_products = [sample_product] * 5
        mock_product_repository.list.return_value = mock_products
        mock_product_repository.count.return_value = 25
        
        use_case = ListProductsUseCase(mock_product_repository)
        result = await use_case.execute(filters=ProductFiltersDTO(), page=2, limit=10)
        
        assert result["page"] == 2
        assert result["limit"] == 10
        assert result["total"] == 25
        assert result["total_pages"] == 3  # 25 items / 10 per page = 3 pages


class TestUpdateProductUseCase:
    """Test cases for UpdateProductUseCase"""
    
    @pytest.mark.asyncio
    async def test_execute_valid_update(self, mock_product_repository, sample_product, sample_update_product_dto):
        """Test updating product with valid DTO"""
        product_id = 1
        updated_product = Product(
            id=product_id,
            name=sample_update_product_dto.name,
            price=Price(sample_update_product_dto.price),
            stock=Stock(sample_update_product_dto.stock),
            category=sample_update_product_dto.category,
            description=sample_update_product_dto.description,
            is_active=sample_update_product_dto.is_active,
        )
        
        mock_product_repository.get_by_id.return_value = sample_product
        mock_product_repository.update.return_value = updated_product
        
        use_case = UpdateProductUseCase(mock_product_repository)
        result = await use_case.execute(product_id, sample_update_product_dto)
        
        assert result == updated_product
        mock_product_repository.get_by_id.assert_called_once_with(product_id)
        mock_product_repository.update.assert_called_once()
    
    @pytest.mark.asyncio
    async def test_execute_product_not_found(self, mock_product_repository, sample_update_product_dto):
        """Test updating non-existent product raises ProductNotFoundError"""
        from domain.exceptions.product_exceptions import ProductNotFoundError
        
        product_id = 999
        mock_product_repository.get_by_id.return_value = None
        
        use_case = UpdateProductUseCase(mock_product_repository)
        
        with pytest.raises(ProductNotFoundError):
            await use_case.execute(product_id, sample_update_product_dto)
        
        mock_product_repository.update.assert_not_called()


class TestDeleteProductUseCase:
    """Test cases for DeleteProductUseCase"""
    
    @pytest.mark.asyncio
    async def test_execute_product_exists(self, mock_product_repository, sample_product):
        """Test deleting existing product"""
        product_id = 1
        mock_product_repository.get_by_id.return_value = sample_product
        mock_product_repository.delete.return_value = True
        
        use_case = DeleteProductUseCase(mock_product_repository)
        result = await use_case.execute(product_id)
        
        assert result is True
        mock_product_repository.get_by_id.assert_called_once_with(product_id)
        mock_product_repository.delete.assert_called_once_with(product_id)
    
    @pytest.mark.asyncio
    async def test_execute_product_not_found(self, mock_product_repository):
        """Test deleting non-existent product raises ProductNotFoundError"""
        from domain.exceptions.product_exceptions import ProductNotFoundError
        
        product_id = 999
        mock_product_repository.get_by_id.return_value = None
        
        use_case = DeleteProductUseCase(mock_product_repository)
        
        with pytest.raises(ProductNotFoundError):
            await use_case.execute(product_id)
        
        mock_product_repository.delete.assert_not_called()
    
    @pytest.mark.asyncio
    async def test_execute_invalid_product_id_raises_error(self, mock_product_repository):
        """Test that invalid product ID raises ValueError"""
        use_case = GetProductUseCase(mock_product_repository)
        
        with pytest.raises(ValueError):
            await use_case.execute(0)
        
        with pytest.raises(ValueError):
            await use_case.execute(-1)


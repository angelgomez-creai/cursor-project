# ============================================
# ElastiCache Redis
# ============================================

# Subnet Group for Redis
resource "aws_elasticache_subnet_group" "main" {
  count      = var.enable_redis ? 1 : 0
  name       = "${var.project_name}-redis-subnet-group"
  subnet_ids = aws_subnet.private[*].id

  tags = {
    Name = "${var.project_name}-redis-subnet-group"
  }
}

# Parameter Group for Redis
resource "aws_elasticache_parameter_group" "main" {
  count  = var.enable_redis ? 1 : 0
  name   = "${var.project_name}-redis-params"
  family = "redis7"

  parameter {
    name  = "maxmemory-policy"
    value = "allkeys-lru"
  }

  parameter {
    name  = "timeout"
    value = "300"
  }

  tags = {
    Name = "${var.project_name}-redis-params"
  }
}

# ElastiCache Replication Group (Redis Cluster)
resource "aws_elasticache_replication_group" "main" {
  count = var.enable_redis ? 1 : 0

  replication_group_id       = "${var.project_name}-redis"
  description                 = "Redis cluster for ${var.project_name}"
  
  # Engine
  engine                      = "redis"
  engine_version              = var.redis_engine_version
  
  # Node Configuration
  node_type                   = var.redis_node_type
  num_cache_clusters          = var.redis_num_cache_nodes
  port                        = 6379
  
  # Network
  subnet_group_name           = aws_elasticache_subnet_group.main[0].name
  security_group_ids          = [aws_security_group.redis.id]
  
  # Parameter Group
  parameter_group_name        = aws_elasticache_parameter_group.main[0].name
  
  # Backup
  snapshot_retention_limit    = 5
  snapshot_window             = "03:00-05:00"
  automatic_failover_enabled  = var.redis_num_cache_nodes > 1
  multi_az_enabled            = var.redis_num_cache_nodes > 1
  
  # Maintenance
  auto_minor_version_upgrade  = true
  at_rest_encryption_enabled    = true
  transit_encryption_enabled    = true
  
  # Logs
  log_delivery_configuration {
    destination      = aws_cloudwatch_log_group.redis[0].name
    destination_type = "cloudwatch-logs"
    log_format       = "json"
    log_type         = "slow-log"
  }

  log_delivery_configuration {
    destination      = aws_cloudwatch_log_group.redis[0].name
    destination_type = "cloudwatch-logs"
    log_format       = "json"
    log_type         = "engine-log"
  }

  tags = {
    Name = "${var.project_name}-redis"
  }
}

# CloudWatch Log Group for Redis
resource "aws_cloudwatch_log_group" "redis" {
  count             = var.enable_redis ? 1 : 0
  name              = "/aws/elasticache/${var.project_name}-redis"
  retention_in_days = var.log_retention_days

  tags = {
    Name = "${var.project_name}-redis-logs"
  }
}


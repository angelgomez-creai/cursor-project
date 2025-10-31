# ============================================
# Outputs
# ============================================

output "vpc_id" {
  description = "ID of the VPC"
  value       = aws_vpc.main.id
}

output "vpc_cidr" {
  description = "CIDR block of the VPC"
  value       = aws_vpc.main.cidr_block
}

output "public_subnet_ids" {
  description = "IDs of the public subnets"
  value       = aws_subnet.public[*].id
}

output "private_subnet_ids" {
  description = "IDs of the private subnets"
  value       = aws_subnet.private[*].id
}

output "database_subnet_ids" {
  description = "IDs of the database subnets"
  value       = aws_subnet.database[*].id
}

output "alb_dns_name" {
  description = "DNS name of the Application Load Balancer"
  value       = aws_lb.main.dns_name
}

output "alb_arn" {
  description = "ARN of the Application Load Balancer"
  value       = aws_lb.main.arn
}

output "alb_zone_id" {
  description = "Zone ID of the Application Load Balancer"
  value       = aws_lb.main.zone_id
}

output "alb_url" {
  description = "URL of the Application Load Balancer"
  value       = "http://${aws_lb.main.dns_name}"
}

output "alb_url_https" {
  description = "HTTPS URL of the Application Load Balancer"
  value       = var.enable_https ? "https://${aws_lb.main.dns_name}" : null
}

output "ecs_cluster_name" {
  description = "Name of the ECS cluster"
  value       = aws_ecs_cluster.main.name
}

output "ecs_cluster_arn" {
  description = "ARN of the ECS cluster"
  value       = aws_ecs_cluster.main.arn
}

output "backend_service_name" {
  description = "Name of the backend ECS service"
  value       = aws_ecs_service.backend.name
}

output "frontend_service_name" {
  description = "Name of the frontend ECS service"
  value       = aws_ecs_service.frontend.name
}

# Service Discovery Outputs
output "service_discovery_namespace" {
  description = "Service discovery namespace"
  value       = var.enable_service_discovery ? aws_service_discovery_private_dns_namespace.main[0].name : null
}

output "backend_service_discovery_dns" {
  description = "Backend service discovery DNS name"
  value       = var.enable_service_discovery ? "${var.backend_service_name}.${aws_service_discovery_private_dns_namespace.main[0].name}" : null
}

output "frontend_service_discovery_dns" {
  description = "Frontend service discovery DNS name"
  value       = var.enable_service_discovery ? "${var.frontend_service_name}.${aws_service_discovery_private_dns_namespace.main[0].name}" : null
}

output "rds_endpoint" {
  description = "RDS PostgreSQL endpoint"
  value       = aws_db_instance.main.endpoint
}

output "rds_address" {
  description = "RDS PostgreSQL address"
  value       = aws_db_instance.main.address
}

output "rds_port" {
  description = "RDS PostgreSQL port"
  value       = aws_db_instance.main.port
}

output "rds_database_name" {
  description = "RDS database name"
  value       = aws_db_instance.main.db_name
}

output "redis_endpoint" {
  description = "Redis ElastiCache endpoint"
  value       = var.enable_redis ? aws_elasticache_replication_group.main[0].configuration_endpoint_address : null
}

output "redis_port" {
  description = "Redis ElastiCache port"
  value       = var.enable_redis ? aws_elasticache_replication_group.main[0].port : null
}

output "backend_target_group_arn" {
  description = "ARN of the backend target group"
  value       = aws_lb_target_group.backend.arn
}

output "frontend_target_group_arn" {
  description = "ARN of the frontend target group"
  value       = aws_lb_target_group.frontend.arn
}

output "security_group_ids" {
  description = "Security group IDs"
  value = {
    alb     = aws_security_group.alb.id
    backend = aws_security_group.backend.id
    frontend = aws_security_group.frontend.id
    rds     = aws_security_group.rds.id
    redis   = var.enable_redis ? aws_security_group.redis.id : null
  }
}

output "backend_task_definition_arn" {
  description = "ARN of the backend task definition"
  value       = aws_ecs_task_definition.backend.arn
}

output "frontend_task_definition_arn" {
  description = "ARN of the frontend task definition"
  value       = aws_ecs_task_definition.frontend.arn
}

# Health Check Outputs
output "backend_health_check_url" {
  description = "Backend health check URL"
  value       = "http://${aws_lb.main.dns_name}${var.health_check_path_backend}"
}

output "frontend_health_check_url" {
  description = "Frontend health check URL"
  value       = "http://${aws_lb.main.dns_name}${var.health_check_path_frontend}"
}

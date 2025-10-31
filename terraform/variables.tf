variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (dev, staging, production)"
  type        = string
  default     = "production"
  validation {
    condition     = contains(["dev", "staging", "production"], var.environment)
    error_message = "Environment must be dev, staging, or production."
  }
}

variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "ecommerce"
}

# VPC Configuration
variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "enable_nat_gateway" {
  description = "Enable NAT Gateway for private subnets"
  type        = bool
  default     = true
}

variable "enable_vpn_gateway" {
  description = "Enable VPN Gateway"
  type        = bool
  default     = false
}

# ECS Configuration
variable "ecs_cluster_name" {
  description = "Name of the ECS cluster"
  type        = string
  default     = "ecommerce-cluster"
}

variable "backend_service_name" {
  description = "Name of the backend ECS service"
  type        = string
  default     = "ecommerce-backend"
}

variable "frontend_service_name" {
  description = "Name of the frontend ECS service"
  type        = string
  default     = "ecommerce-frontend"
}

variable "backend_cpu" {
  description = "CPU units for backend service (256, 512, 1024, 2048, 4096)"
  type        = number
  default     = 512
}

variable "backend_memory" {
  description = "Memory for backend service in MB"
  type        = number
  default     = 1024
}

variable "frontend_cpu" {
  description = "CPU units for frontend service"
  type        = number
  default     = 256
}

variable "frontend_memory" {
  description = "Memory for frontend service in MB"
  type        = number
  default     = 512
}

variable "backend_desired_count" {
  description = "Desired number of backend tasks"
  type        = number
  default     = 2
}

variable "frontend_desired_count" {
  description = "Desired number of frontend tasks"
  type        = number
  default     = 2
}

variable "backend_container_port" {
  description = "Port the backend container listens on"
  type        = number
  default     = 8000
}

variable "frontend_container_port" {
  description = "Port the frontend container listens on"
  type        = number
  default     = 80
}

# Docker Images
variable "backend_image" {
  description = "Docker image for backend service"
  type        = string
  default     = "ghcr.io/your-org/ecommerce/backend:latest"
}

variable "frontend_image" {
  description = "Docker image for frontend service"
  type        = string
  default     = "ghcr.io/your-org/ecommerce/frontend:latest"
}

# Auto Scaling Configuration
variable "enable_auto_scaling" {
  description = "Enable auto scaling for ECS services"
  type        = bool
  default     = true
}

variable "backend_min_capacity" {
  description = "Minimum number of backend tasks"
  type        = number
  default     = 2
}

variable "backend_max_capacity" {
  description = "Maximum number of backend tasks"
  type        = number
  default     = 10
}

variable "frontend_min_capacity" {
  description = "Minimum number of frontend tasks"
  type        = number
  default     = 2
}

variable "frontend_max_capacity" {
  description = "Maximum number of frontend tasks"
  type        = number
  default     = 10
}

variable "backend_scaling_target_cpu" {
  description = "Target CPU utilization percentage for backend scaling"
  type        = number
  default     = 70
}

variable "frontend_scaling_target_cpu" {
  description = "Target CPU utilization percentage for frontend scaling"
  type        = number
  default     = 70
}

# RDS Configuration
variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.medium"
}

variable "db_allocated_storage" {
  description = "RDS allocated storage in GB"
  type        = number
  default     = 20
}

variable "db_max_allocated_storage" {
  description = "RDS max allocated storage for autoscaling in GB"
  type        = number
  default     = 100
}

variable "db_engine_version" {
  description = "PostgreSQL engine version"
  type        = string
  default     = "15.4"
}

variable "db_name" {
  description = "Database name"
  type        = string
  default     = "ecommerce"
}

variable "db_username" {
  description = "Database master username"
  type        = string
  default     = "ecommerce_admin"
  sensitive   = true
}

variable "db_password" {
  description = "Database master password (set via TF_VAR_db_password or AWS Secrets Manager)"
  type        = string
  sensitive   = true
}

variable "db_backup_retention_period" {
  description = "Days to retain database backups"
  type        = number
  default     = 7
}

variable "db_backup_window" {
  description = "Preferred backup window"
  type        = string
  default     = "03:00-04:00"
}

variable "db_maintenance_window" {
  description = "Preferred maintenance window"
  type        = string
  default     = "mon:04:00-mon:05:00"
}

variable "enable_db_multi_az" {
  description = "Enable multi-AZ deployment for RDS"
  type        = bool
  default     = true
}

variable "enable_db_deletion_protection" {
  description = "Enable deletion protection for RDS"
  type        = bool
  default     = true
}

# ALB Configuration
variable "alb_name" {
  description = "Name of the Application Load Balancer"
  type        = string
  default     = "ecommerce-alb"
}

variable "enable_alb_logging" {
  description = "Enable access logs for ALB"
  type        = bool
  default     = true
}

variable "ssl_certificate_arn" {
  description = "ARN of SSL certificate for HTTPS (ACM)"
  type        = string
  default     = ""
}

variable "enable_https" {
  description = "Enable HTTPS listener"
  type        = bool
  default     = false
}

variable "health_check_path_backend" {
  description = "Health check path for backend"
  type        = string
  default     = "/health"
}

variable "health_check_path_frontend" {
  description = "Health check path for frontend"
  type        = string
  default     = "/"
}

# ALB Health Check Configuration
variable "alb_healthy_threshold" {
  description = "Number of consecutive successful health checks required to mark target healthy"
  type        = number
  default     = 2
}

variable "alb_unhealthy_threshold" {
  description = "Number of consecutive failed health checks required to mark target unhealthy"
  type        = number
  default     = 3
}

variable "alb_health_check_timeout" {
  description = "Timeout for ALB health check in seconds"
  type        = number
  default     = 5
}

variable "alb_health_check_interval" {
  description = "Interval between ALB health checks in seconds"
  type        = number
  default     = 30
}

variable "alb_health_check_matcher" {
  description = "HTTP status codes to consider healthy for ALB"
  type        = string
  default     = "200"
}

# Redis Configuration (ElastiCache)
variable "enable_redis" {
  description = "Enable ElastiCache Redis cluster"
  type        = bool
  default     = true
}

variable "redis_node_type" {
  description = "ElastiCache node type"
  type        = string
  default     = "cache.t3.micro"
}

variable "redis_num_cache_nodes" {
  description = "Number of cache nodes"
  type        = number
  default     = 1
}

variable "redis_engine_version" {
  description = "Redis engine version"
  type        = string
  default     = "7.0"
}

# Additional Configuration
variable "enable_cloudwatch_logs" {
  description = "Enable CloudWatch logs for ECS tasks"
  type        = bool
  default     = true
}

variable "log_retention_days" {
  description = "CloudWatch log retention in days"
  type        = number
  default     = 30
}

variable "tags" {
  description = "Additional tags to apply to resources"
  type        = map(string)
  default     = {}
}

# Service Discovery
variable "enable_service_discovery" {
  description = "Enable AWS Cloud Map service discovery"
  type        = bool
  default     = true
}

# Health Checks
variable "health_check_interval" {
  description = "Health check interval in seconds"
  type        = number
  default     = 30
}

variable "health_check_timeout" {
  description = "Health check timeout in seconds"
  type        = number
  default     = 5
}

variable "health_check_retries" {
  description = "Number of consecutive health check failures before marking unhealthy"
  type        = number
  default     = 3
}

variable "health_check_start_period" {
  description = "Grace period for health checks to start in seconds"
  type        = number
  default     = 60
}

variable "health_check_grace_period" {
  description = "Grace period for ALB health checks in seconds"
  type        = number
  default     = 120
}

variable "backend_health_check_command" {
  description = "Custom health check command for backend (overrides default)"
  type        = string
  default     = ""
}

variable "frontend_health_check_command" {
  description = "Custom health check command for frontend (overrides default)"
  type        = string
  default     = ""
}

variable "enable_health_notifications" {
  description = "Enable SNS notifications for health check failures"
  type        = bool
  default     = false
}

variable "health_notification_email" {
  description = "Email address for health check notifications"
  type        = string
  default     = ""
}

# Deployment Configuration
variable "deployment_maximum_percent" {
  description = "Maximum percent of tasks to run during deployment"
  type        = number
  default     = 200
}

variable "deployment_minimum_healthy_percent" {
  description = "Minimum percent of healthy tasks during deployment"
  type        = number
  default     = 100
}

variable "enable_deployment_circuit_breaker" {
  description = "Enable deployment circuit breaker (auto rollback on failure)"
  type        = bool
  default     = true
}

variable "wait_for_steady_state" {
  description = "Wait for service to reach steady state before continuing"
  type        = bool
  default     = true
}

# Fargate Configuration
variable "fargate_platform_version" {
  description = "Platform version for Fargate (LATEST or 1.4.0)"
  type        = string
  default     = "LATEST"
}

variable "enable_ecs_exec" {
  description = "Enable ECS Exec for debugging (allows exec into running containers)"
  type        = bool
  default     = true
}

variable "task_stop_timeout" {
  description = "Time to wait for task to stop gracefully (seconds)"
  type        = number
  default     = 30
}

variable "enable_ulimits" {
  description = "Enable ulimits for containers"
  type        = bool
  default     = false
}


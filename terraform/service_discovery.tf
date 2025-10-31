# ============================================
# Service Discovery (AWS Cloud Map)
# ============================================

# Private DNS Namespace for Service Discovery
resource "aws_service_discovery_private_dns_namespace" "main" {
  count       = var.enable_service_discovery ? 1 : 0
  name        = "${var.project_name}.local"
  description = "Service discovery namespace for ${var.project_name}"
  vpc         = aws_vpc.main.id

  tags = {
    Name = "${var.project_name}-service-discovery"
  }
}

# Service Discovery Service for Backend
resource "aws_service_discovery_service" "backend" {
  count = var.enable_service_discovery ? 1 : 0
  name  = var.backend_service_name

  dns_config {
    namespace_id = aws_service_discovery_private_dns_namespace.main[0].id

    dns_records {
      ttl  = 10
      type = "A"
    }

    routing_policy = "MULTIVALUE"
  }

  health_check_grace_period_seconds = 30

  tags = {
    Name = "${var.project_name}-backend-discovery"
  }
}

# Service Discovery Service for Frontend
resource "aws_service_discovery_service" "frontend" {
  count = var.enable_service_discovery ? 1 : 0
  name  = var.frontend_service_name

  dns_config {
    namespace_id = aws_service_discovery_private_dns_namespace.main[0].id

    dns_records {
      ttl  = 10
      type = "A"
    }

    routing_policy = "MULTIVALUE"
  }

  health_check_grace_period_seconds = 30

  tags = {
    Name = "${var.project_name}-frontend-discovery"
  }
}

# IAM Policy for Service Discovery
resource "aws_iam_role_policy" "ecs_service_discovery" {
  count = var.enable_service_discovery ? 1 : 0
  name  = "${var.project_name}-ecs-service-discovery"
  role  = aws_iam_role.ecs_task_execution.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "servicediscovery:RegisterInstance",
          "servicediscovery:DeregisterInstance",
          "servicediscovery:GetService",
          "servicediscovery:ListInstances"
        ]
        Resource = [
          aws_service_discovery_service.backend[0].arn,
          aws_service_discovery_service.frontend[0].arn
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "servicediscovery:DiscoverInstances"
        ]
        Resource = [
          aws_service_discovery_private_dns_namespace.main[0].arn
        ]
      }
    ]
  })
}


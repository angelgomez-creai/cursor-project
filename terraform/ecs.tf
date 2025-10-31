# ============================================
# ECS Cluster and Services
# ============================================

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = var.ecs_cluster_name

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    Name = var.ecs_cluster_name
  }
}

# CloudWatch Log Groups
resource "aws_cloudwatch_log_group" "backend" {
  name              = "/ecs/${var.project_name}/backend"
  retention_in_days = var.log_retention_days

  tags = {
    Name = "${var.project_name}-backend-logs"
  }
}

resource "aws_cloudwatch_log_group" "frontend" {
  name              = "/ecs/${var.project_name}/frontend"
  retention_in_days = var.log_retention_days

  tags = {
    Name = "${var.project_name}-frontend-logs"
  }
}

# IAM Role for ECS Task Execution
resource "aws_iam_role" "ecs_task_execution" {
  name = "${var.project_name}-ecs-task-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name = "${var.project_name}-ecs-task-execution-role"
  }
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution" {
  role       = aws_iam_role.ecs_task_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# IAM Role for ECS Tasks
resource "aws_iam_role" "ecs_task" {
  name = "${var.project_name}-ecs-task-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name = "${var.project_name}-ecs-task-role"
  }
}

# Additional IAM policy for ECS tasks to access AWS services
resource "aws_iam_role_policy" "ecs_task" {
  name = "${var.project_name}-ecs-task-policy"
  role = aws_iam_role.ecs_task.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue",
          "ssm:GetParameters",
          "ssm:GetParameter"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "*"
      }
    ]
  })
}

# Backend Task Definition
resource "aws_ecs_task_definition" "backend" {
  family                   = "${var.project_name}-backend"
  network_mode             = "awsvpc"
  requires_compatibilities  = ["FARGATE"]
  cpu                      = var.backend_cpu
  memory                   = var.backend_memory
  execution_role_arn       = aws_iam_role.ecs_task_execution.arn
  task_role_arn            = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([
    {
      name  = "backend"
      image = var.backend_image

      portMappings = [
        {
          containerPort = var.backend_container_port
          protocol      = "tcp"
        }
      ]

      environment = [
        {
          name  = "ENVIRONMENT"
          value = var.environment
        },
        {
          name  = "DATABASE_URL"
          value = "postgresql://${var.db_username}:${var.db_password != "" ? var.db_password : random_password.db_password[0].result}@${aws_db_instance.main.endpoint}/${var.db_name}"
        },
        {
          name  = "REDIS_URL"
          value = var.enable_redis ? "redis://${aws_elasticache_replication_group.main[0].configuration_endpoint_address}:6379" : ""
        },
        {
          name  = "CORS_ORIGINS"
          value = "https://${aws_lb.main.dns_name}"
        },
        {
          name  = "SERVICE_DISCOVERY_NAMESPACE"
          value = "${var.project_name}.local"
        },
        {
          name  = "BACKEND_SERVICE_NAME"
          value = var.backend_service_name
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.backend.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs"
        }
      }

      healthCheck = {
        command     = var.backend_health_check_command != "" ? split(" ", var.backend_health_check_command) : ["CMD-SHELL", "curl -f http://localhost:${var.backend_container_port}${var.health_check_path_backend} || exit 1"]
        interval    = var.health_check_interval
        timeout     = var.health_check_timeout
        retries     = var.health_check_retries
        startPeriod = var.health_check_start_period
      }

      essential = true

      stopTimeout = var.task_stop_timeout

      ulimits = var.enable_ulimits ? [
        {
          name      = "nofile"
          softLimit = 65536
          hardLimit = 65536
        }
      ] : []
    }
  ])

  tags = {
    Name = "${var.project_name}-backend"
  }
}

# Frontend Task Definition
resource "aws_ecs_task_definition" "frontend" {
  family                   = "${var.project_name}-frontend"
  network_mode             = "awsvpc"
  requires_compatibilities  = ["FARGATE"]
  cpu                      = var.frontend_cpu
  memory                   = var.frontend_memory
  execution_role_arn       = aws_iam_role.ecs_task_execution.arn
  task_role_arn            = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([
    {
      name  = "frontend"
      image = var.frontend_image

      portMappings = [
        {
          containerPort = var.frontend_container_port
          protocol      = "tcp"
        }
      ]

      environment = [
        {
          name  = "ENVIRONMENT"
          value = var.environment
        },
        {
          name  = "VITE_API_URL"
          value = "https://${aws_lb.main.dns_name}/api"
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.frontend.name
          "awslogs-stream-prefix" = "ecs"
        }
      }

      healthCheck = {
        command     = var.frontend_health_check_command != "" ? split(" ", var.frontend_health_check_command) : ["CMD-SHELL", "curl -f http://localhost:${var.frontend_container_port}${var.health_check_path_frontend} || exit 1"]
        interval    = var.health_check_interval
        timeout     = var.health_check_timeout
        retries     = var.health_check_retries
        startPeriod = var.health_check_start_period
      }

      essential = true

      stopTimeout = var.task_stop_timeout

      ulimits = var.enable_ulimits ? [
        {
          name      = "nofile"
          softLimit = 65536
          hardLimit = 65536
        }
      ] : []
    }
  ])

  tags = {
    Name = "${var.project_name}-frontend"
  }
}

# Backend ECS Service
resource "aws_ecs_service" "backend" {
  name            = var.backend_service_name
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.backend.arn
  desired_count   = var.backend_desired_count
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = aws_subnet.private[*].id
    security_groups  = [aws_security_group.backend.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.backend.arn
    container_name   = "backend"
    container_port   = var.backend_container_port
  }

  # Service Discovery
  dynamic "service_registries" {
    for_each = var.enable_service_discovery ? [1] : []
    content {
      registry_arn = aws_service_discovery_service.backend[0].arn
    }
  }

  # Rolling Deployment Configuration
  deployment_configuration {
    maximum_percent         = var.deployment_maximum_percent
    minimum_healthy_percent = var.deployment_minimum_healthy_percent
  }

  # Deployment Circuit Breaker (auto rollback on failure)
  deployment_circuit_breaker {
    enable   = var.enable_deployment_circuit_breaker
    rollback = var.enable_deployment_circuit_breaker
  }

  # Ordered Placement Strategy
  ordered_placement_strategy {
    type  = "spread"
    field = "attribute:ecs.availability-zone"
  }

  # Health Check Grace Period (time to wait before marking unhealthy)
  health_check_grace_period_seconds = var.health_check_grace_period

  # Enable Execute Command for debugging
  enable_execute_command = var.enable_ecs_exec

  # Platform Version (latest for Fargate)
  platform_version = var.fargate_platform_version

  # Wait for deployment to complete
  wait_for_steady_state = var.wait_for_steady_state

  # Propagate tags to tasks
  propagate_tags = "SERVICE"

  tags = {
    Name = var.backend_service_name
  }

  depends_on = concat(
    [aws_lb_target_group.backend],
    var.enable_service_discovery ? [aws_service_discovery_service.backend[0]] : []
  )
}

# Frontend ECS Service
resource "aws_ecs_service" "frontend" {
  name            = var.frontend_service_name
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.frontend.arn
  desired_count   = var.frontend_desired_count
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = aws_subnet.private[*].id
    security_groups  = [aws_security_group.frontend.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.frontend.arn
    container_name   = "frontend"
    container_port   = var.frontend_container_port
  }

  # Service Discovery
  dynamic "service_registries" {
    for_each = var.enable_service_discovery ? [1] : []
    content {
      registry_arn = aws_service_discovery_service.frontend[0].arn
    }
  }

  # Rolling Deployment Configuration
  deployment_configuration {
    maximum_percent         = var.deployment_maximum_percent
    minimum_healthy_percent = var.deployment_minimum_healthy_percent
  }

  # Deployment Circuit Breaker (auto rollback on failure)
  deployment_circuit_breaker {
    enable   = var.enable_deployment_circuit_breaker
    rollback = var.enable_deployment_circuit_breaker
  }

  # Ordered Placement Strategy
  ordered_placement_strategy {
    type  = "spread"
    field = "attribute:ecs.availability-zone"
  }

  # Health Check Grace Period
  health_check_grace_period_seconds = var.health_check_grace_period

  # Enable Execute Command for debugging
  enable_execute_command = var.enable_ecs_exec

  # Platform Version
  platform_version = var.fargate_platform_version

  # Wait for deployment to complete
  wait_for_steady_state = var.wait_for_steady_state

  # Propagate tags to tasks
  propagate_tags = "SERVICE"

  tags = {
    Name = var.frontend_service_name
  }

  depends_on = concat(
    [aws_lb_target_group.frontend],
    var.enable_service_discovery ? [aws_service_discovery_service.frontend[0]] : []
  )
}


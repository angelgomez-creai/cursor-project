# ============================================
# Auto Scaling for ECS Services
# ============================================

# Auto Scaling Target for Backend
resource "aws_appautoscaling_target" "backend" {
  count              = var.enable_auto_scaling ? 1 : 0
  max_capacity       = var.backend_max_capacity
  min_capacity       = var.backend_min_capacity
  resource_id        = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.backend.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

# Auto Scaling Policy for Backend (CPU-based)
resource "aws_appautoscaling_policy" "backend_cpu" {
  count              = var.enable_auto_scaling ? 1 : 0
  name               = "${var.project_name}-backend-cpu-autoscaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.backend[0].resource_id
  scalable_dimension = aws_appautoscaling_target.backend[0].scalable_dimension
  service_namespace  = aws_appautoscaling_target.backend[0].service_namespace

  target_tracking_scaling_policy_configuration {
    target_value = var.backend_scaling_target_cpu
    
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    
    scale_in_cooldown  = var.scale_in_cooldown
    scale_out_cooldown = var.scale_out_cooldown
    
    # Disable scale-in if only 1 task
    disable_scale_in = var.backend_min_capacity <= 1
  }
}

# Step Scaling Policy for Backend (alternative to target tracking)
resource "aws_appautoscaling_policy" "backend_step" {
  count              = var.enable_auto_scaling && var.enable_step_scaling ? 1 : 0
  name               = "${var.project_name}-backend-step-scaling"
  policy_type        = "StepScaling"
  resource_id        = aws_appautoscaling_target.backend[0].resource_id
  scalable_dimension = aws_appautoscaling_target.backend[0].scalable_dimension
  service_namespace  = aws_appautoscaling_target.backend[0].service_namespace

  step_scaling_policy_configuration {
    adjustment_type         = "ChangeInCapacity"
    cooldown                = 60
    metric_aggregation_type = "Average"

    step_adjustment {
      metric_interval_lower_bound = 0
      metric_interval_upper_bound = 10
      scaling_adjustment          = 1
    }

    step_adjustment {
      metric_interval_lower_bound = 10
      metric_interval_upper_bound = 20
      scaling_adjustment          = 2
    }

    step_adjustment {
      metric_interval_lower_bound = 20
      scaling_adjustment          = 3
    }
  }
}

# Scheduled Scaling for Backend (optional)
resource "aws_appautoscaling_scheduled_action" "backend_scale_up" {
  count              = var.enable_auto_scaling && var.enable_scheduled_scaling ? 1 : 0
  name               = "${var.project_name}-backend-scale-up"
  service_namespace  = aws_appautoscaling_target.backend[0].service_namespace
  resource_id        = aws_appautoscaling_target.backend[0].resource_id
  scalable_dimension = aws_appautoscaling_target.backend[0].scalable_dimension
  schedule           = "cron(0 8 * * ? *)" # 8 AM daily
  timezone           = "UTC"

  scalable_target_action {
    min_capacity = var.backend_scheduled_min_capacity
    max_capacity = var.backend_max_capacity
  }
}

resource "aws_appautoscaling_scheduled_action" "backend_scale_down" {
  count              = var.enable_auto_scaling && var.enable_scheduled_scaling ? 1 : 0
  name               = "${var.project_name}-backend-scale-down"
  service_namespace  = aws_appautoscaling_target.backend[0].service_namespace
  resource_id        = aws_appautoscaling_target.backend[0].resource_id
  scalable_dimension = aws_appautoscaling_target.backend[0].scalable_dimension
  schedule           = "cron(0 22 * * ? *)" # 10 PM daily
  timezone           = "UTC"

  scalable_target_action {
    min_capacity = var.backend_min_capacity
    max_capacity = var.backend_max_capacity
  }
}

# Auto Scaling Policy for Backend (Memory-based)
resource "aws_appautoscaling_policy" "backend_memory" {
  count              = var.enable_auto_scaling ? 1 : 0
  name               = "${var.project_name}-backend-memory-autoscaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.backend[0].resource_id
  scalable_dimension = aws_appautoscaling_target.backend[0].scalable_dimension
  service_namespace  = aws_appautoscaling_target.backend[0].service_namespace

  target_tracking_scaling_policy_configuration {
    target_value = 80
    
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageMemoryUtilization"
    }
    
    scale_in_cooldown  = var.scale_in_cooldown
    scale_out_cooldown = var.scale_out_cooldown
    
    disable_scale_in = var.backend_min_capacity <= 1
  }
}

# Auto Scaling Target for Frontend
resource "aws_appautoscaling_target" "frontend" {
  count              = var.enable_auto_scaling ? 1 : 0
  max_capacity       = var.frontend_max_capacity
  min_capacity        = var.frontend_min_capacity
  resource_id        = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.frontend.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

# Auto Scaling Policy for Frontend (CPU-based)
resource "aws_appautoscaling_policy" "frontend_cpu" {
  count              = var.enable_auto_scaling ? 1 : 0
  name               = "${var.project_name}-frontend-cpu-autoscaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.frontend[0].resource_id
  scalable_dimension = aws_appautoscaling_target.frontend[0].scalable_dimension
  service_namespace  = aws_appautoscaling_target.frontend[0].service_namespace

  target_tracking_scaling_policy_configuration {
    target_value = var.frontend_scaling_target_cpu
    
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    
    scale_in_cooldown  = var.scale_in_cooldown
    scale_out_cooldown = var.scale_out_cooldown
    
    disable_scale_in = var.frontend_min_capacity <= 1
  }
}

# Step Scaling Policy for Frontend
resource "aws_appautoscaling_policy" "frontend_step" {
  count              = var.enable_auto_scaling && var.enable_step_scaling ? 1 : 0
  name               = "${var.project_name}-frontend-step-scaling"
  policy_type        = "StepScaling"
  resource_id        = aws_appautoscaling_target.frontend[0].resource_id
  scalable_dimension = aws_appautoscaling_target.frontend[0].scalable_dimension
  service_namespace  = aws_appautoscaling_target.frontend[0].service_namespace

  step_scaling_policy_configuration {
    adjustment_type         = "ChangeInCapacity"
    cooldown                = 60
    metric_aggregation_type = "Average"

    step_adjustment {
      metric_interval_lower_bound = 0
      metric_interval_upper_bound = 10
      scaling_adjustment          = 1
    }

    step_adjustment {
      metric_interval_lower_bound = 10
      metric_interval_upper_bound = 20
      scaling_adjustment          = 2
    }
  }
}

# Auto Scaling Policy for Frontend (Memory-based)
resource "aws_appautoscaling_policy" "frontend_memory" {
  count              = var.enable_auto_scaling ? 1 : 0
  name               = "${var.project_name}-frontend-memory-autoscaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.frontend[0].resource_id
  scalable_dimension = aws_appautoscaling_target.frontend[0].scalable_dimension
  service_namespace  = aws_appautoscaling_target.frontend[0].service_namespace

  target_tracking_scaling_policy_configuration {
    target_value = 80
    
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageMemoryUtilization"
    }
    
    scale_in_cooldown  = var.scale_in_cooldown
    scale_out_cooldown = var.scale_out_cooldown
    
    disable_scale_in = var.frontend_min_capacity <= 1
  }
}


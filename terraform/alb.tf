# ============================================
# Application Load Balancer
# ============================================

# S3 Bucket for ALB Access Logs
resource "aws_s3_bucket" "alb_logs" {
  count  = var.enable_alb_logging ? 1 : 0
  bucket = "${var.project_name}-alb-logs-${data.aws_caller_identity.current.account_id}"

  tags = {
    Name = "${var.project_name}-alb-logs"
  }
}

resource "aws_s3_bucket_ownership_controls" "alb_logs" {
  count  = var.enable_alb_logging ? 1 : 0
  bucket = aws_s3_bucket.alb_logs[0].id

  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_acl" "alb_logs" {
  count  = var.enable_alb_logging ? 1 : 0
  depends_on = [aws_s3_bucket_ownership_controls.alb_logs]
  bucket = aws_s3_bucket.alb_logs[0].id
  acl    = "private"
}

resource "aws_s3_bucket_server_side_encryption_configuration" "alb_logs" {
  count  = var.enable_alb_logging ? 1 : 0
  bucket = aws_s3_bucket.alb_logs[0].id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "alb_logs" {
  count  = var.enable_alb_logging ? 1 : 0
  bucket = aws_s3_bucket.alb_logs[0].id

  rule {
    id     = "delete-old-logs"
    status = "Enabled"

    expiration {
      days = 30
    }
  }
}

# ALB
resource "aws_lb" "main" {
  name               = var.alb_name
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = aws_subnet.public[*].id

  enable_deletion_protection = var.environment == "production"
  enable_http2               = true
  enable_cross_zone_load_balancing = true
  idle_timeout                    = 60

  access_logs {
    bucket  = var.enable_alb_logging ? aws_s3_bucket.alb_logs[0].id : null
    enabled = var.enable_alb_logging
  }

  tags = {
    Name = var.alb_name
  }
}

# Target Group for Backend
resource "aws_lb_target_group" "backend" {
  name        = "${var.project_name}-backend-tg"
  port        = var.backend_container_port
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"

  health_check {
    enabled             = true
    healthy_threshold   = var.alb_healthy_threshold
    unhealthy_threshold = var.alb_unhealthy_threshold
    timeout             = var.alb_health_check_timeout
    interval            = var.alb_health_check_interval
    path                = var.health_check_path_backend
    protocol            = "HTTP"
    matcher             = var.alb_health_check_matcher
    port                = "traffic-port"
  }

  deregistration_delay = 30
  slow_start           = 30

  tags = {
    Name = "${var.project_name}-backend-tg"
  }
}

# Target Group for Frontend
resource "aws_lb_target_group" "frontend" {
  name        = "${var.project_name}-frontend-tg"
  port        = var.frontend_container_port
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"

  health_check {
    enabled             = true
    healthy_threshold   = var.alb_healthy_threshold
    unhealthy_threshold = var.alb_unhealthy_threshold
    timeout             = var.alb_health_check_timeout
    interval            = var.alb_health_check_interval
    path                = var.health_check_path_frontend
    protocol            = "HTTP"
    matcher             = var.alb_health_check_matcher
    port                = "traffic-port"
  }

  deregistration_delay = 30
  slow_start           = 30

  tags = {
    Name = "${var.project_name}-frontend-tg"
  }
}

# HTTP Listener (redirects to HTTPS if enabled)
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type = var.enable_https ? "redirect" : "forward"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }

    forward {
      target_group {
        arn    = aws_lb_target_group.frontend.arn
        weight = 100
      }
    }
  }
}

# HTTPS Listener (if enabled)
resource "aws_lb_listener" "https" {
  count             = var.enable_https && var.ssl_certificate_arn != "" ? 1 : 0
  load_balancer_arn = aws_lb.main.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06"
  certificate_arn   = var.ssl_certificate_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.frontend.arn
  }
}

# Listener Rule: API routes to backend
resource "aws_lb_listener_rule" "api" {
  listener_arn = var.enable_https && var.ssl_certificate_arn != "" ? aws_lb_listener.https[0].arn : aws_lb_listener.http.arn
  priority     = 100

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.backend.arn
  }

  condition {
    path_pattern {
      values = ["/api/*"]
    }
  }
}


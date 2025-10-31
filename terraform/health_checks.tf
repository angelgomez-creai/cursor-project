# ============================================
# Advanced Health Checks Configuration
# ============================================

# CloudWatch Alarms for Backend Health
resource "aws_cloudwatch_metric_alarm" "backend_unhealthy" {
  alarm_name          = "${var.project_name}-backend-unhealthy"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "UnhealthyHostCount"
  namespace           = "AWS/ApplicationELB"
  period              = 60
  statistic           = "Average"
  threshold           = 0
  alarm_description   = "Alert when backend service has unhealthy tasks"
  alarm_actions       = var.enable_health_notifications ? [aws_sns_topic.alerts[0].arn] : []

  dimensions = {
    TargetGroup  = aws_lb_target_group.backend.arn_suffix
    LoadBalancer = aws_lb.main.arn_suffix
  }

  tags = {
    Name = "${var.project_name}-backend-unhealthy-alarm"
  }
}

# CloudWatch Alarms for Frontend Health
resource "aws_cloudwatch_metric_alarm" "frontend_unhealthy" {
  alarm_name          = "${var.project_name}-frontend-unhealthy"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "UnhealthyHostCount"
  namespace           = "AWS/ApplicationELB"
  period              = 60
  statistic           = "Average"
  threshold           = 0
  alarm_description   = "Alert when frontend service has unhealthy tasks"
  alarm_actions       = var.enable_health_notifications ? [aws_sns_topic.alerts[0].arn] : []

  dimensions = {
    TargetGroup  = aws_lb_target_group.frontend.arn_suffix
    LoadBalancer = aws_lb.main.arn_suffix
  }

  tags = {
    Name = "${var.project_name}-frontend-unhealthy-alarm"
  }
}

# SNS Topic for Health Alerts (optional)
resource "aws_sns_topic" "alerts" {
  count = var.enable_health_notifications ? 1 : 0
  name  = "${var.project_name}-health-alerts"

  tags = {
    Name = "${var.project_name}-health-alerts"
  }
}

# SNS Topic Subscription (configure email or other endpoints)
resource "aws_sns_topic_subscription" "alerts_email" {
  count     = var.enable_health_notifications && var.health_notification_email != "" ? 1 : 0
  topic_arn = aws_sns_topic.alerts[0].arn
  protocol  = "email"
  endpoint  = var.health_notification_email
}


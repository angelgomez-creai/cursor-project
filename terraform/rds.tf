# ============================================
# RDS PostgreSQL
# ============================================

# DB Parameter Group
resource "aws_db_parameter_group" "main" {
  name   = "${var.project_name}-postgres-params"
  family = "postgres15"

  parameter {
    name  = "log_connections"
    value = "1"
  }

  parameter {
    name  = "log_disconnections"
    value = "1"
  }

  parameter {
    name  = "log_statement"
    value = "all"
  }

  tags = {
    Name = "${var.project_name}-postgres-params"
  }
}

# Random password if not provided
resource "random_password" "db_password" {
  count   = var.db_password == "" ? 1 : 0
  length  = 32
  special = true
}

# DB Subnet Group is created in network.tf

# RDS Instance
resource "aws_db_instance" "main" {
  identifier = "${var.project_name}-db"

  # Engine
  engine         = "postgres"
  engine_version = var.db_engine_version

  # Instance
  instance_class    = var.db_instance_class
  allocated_storage = var.db_allocated_storage
  storage_type      = "gp3"
  storage_encrypted = true

  # Storage autoscaling
  max_allocated_storage = var.db_max_allocated_storage

  # Database
  db_name  = var.db_name
  username = var.db_username
  password = var.db_password != "" ? var.db_password : random_password.db_password[0].result

  # Network
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  publicly_accessible    = false

  # Backup
  backup_retention_period = var.db_backup_retention_period
  backup_window          = var.db_backup_window
  copy_tags_to_snapshot  = true

  # Maintenance
  maintenance_window         = var.db_maintenance_window
  auto_minor_version_upgrade = true

  # Multi-AZ
  multi_az = var.enable_db_multi_az

  # Deletion
  deletion_protection = var.enable_db_deletion_protection
  skip_final_snapshot = !var.enable_db_deletion_protection

  # Monitoring
  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]
  monitoring_interval             = 60
  monitoring_role_arn            = aws_iam_role.rds_enhanced_monitoring.arn
  performance_insights_enabled     = true
  performance_insights_retention_period = 7

  # Parameter Group
  parameter_group_name = aws_db_parameter_group.main.name

  tags = {
    Name = "${var.project_name}-db"
  }
}

# RDS Enhanced Monitoring IAM Role
resource "aws_iam_role" "rds_enhanced_monitoring" {
  name = "${var.project_name}-rds-monitoring-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "monitoring.rds.amazonaws.com"
        }
      }
    ]
  })

  tags = {
    Name = "${var.project_name}-rds-monitoring-role"
  }
}

resource "aws_iam_role_policy_attachment" "rds_enhanced_monitoring" {
  role       = aws_iam_role.rds_enhanced_monitoring.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole"
}

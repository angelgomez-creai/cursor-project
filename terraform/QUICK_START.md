# Terraform Quick Start Guide

## 🚀 Desplegar E-commerce en AWS en 10 minutos

### Paso 1: Prerrequisitos

```bash
# Verificar Terraform
terraform version  # >= 1.5.0

# Verificar AWS CLI
aws --version

# Verificar credenciales
aws sts get-caller-identity
```

### Paso 2: Configurar Variables

```bash
cd terraform

# Copiar archivo de ejemplo
cp terraform.tfvars.example terraform.tfvars

# Editar con tus valores
nano terraform.tfvars  # o vim, code, etc.
```

**Mínimo requerido en terraform.tfvars:**

```hcl
aws_region   = "us-east-1"
environment  = "production"
project_name = "ecommerce"

backend_image  = "ghcr.io/YOUR-ORG/ecommerce/backend:latest"
frontend_image = "ghcr.io/YOUR-ORG/ecommerce/frontend:latest"

db_password = "YOUR_SECURE_PASSWORD_HERE"
```

### Paso 3: Inicializar Terraform

```bash
terraform init
```

### Paso 4: Revisar Plan

```bash
terraform plan
```

Revisar el plan para asegurarse de que todo es correcto.

### Paso 5: Aplicar

```bash
terraform apply
```

Confirmar con `yes` cuando se solicite.

⏱️ **Tiempo estimado**: 15-20 minutos para crear todos los recursos.

### Paso 6: Obtener URLs

```bash
# URL del Load Balancer
terraform output alb_url

# DNS del Load Balancer
terraform output alb_dns_name

# Endpoints de servicios
terraform output rds_endpoint
terraform output redis_endpoint
```

## ✅ Verificar Deployment

```bash
# Verificar ALB
curl $(terraform output -raw alb_url)

# Verificar servicios ECS
aws ecs list-services --cluster $(terraform output -raw ecs_cluster_name)

# Verificar tareas
aws ecs list-tasks --cluster $(terraform output -raw ecs_cluster_name)
```

## 🧹 Limpiar Todo

```bash
terraform destroy
```

⚠️ **Cuidado**: Esto elimina TODO, incluyendo la base de datos.

## 📝 Siguiente Pasos

1. **Configurar HTTPS**:
   - Crear certificado ACM
   - Actualizar `enable_https = true` y `ssl_certificate_arn`

2. **Usar Secrets Manager**:
   - Mover credenciales sensibles a AWS Secrets Manager
   - Actualizar task definitions

3. **Configurar Backend Remoto**:
   - Crear S3 bucket y DynamoDB table
   - Configurar `backend.tf`

4. **Monitoreo**:
   - Configurar CloudWatch alarms
   - Configurar SNS para notificaciones

Ver `README.md` para más detalles.


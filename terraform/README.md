# Terraform Infrastructure as Code - E-commerce AWS Deployment

## 📋 Descripción

Configuración completa de Terraform para desplegar el e-commerce en AWS con arquitectura de alta disponibilidad y seguridad optimizada.

## 🏗️ Arquitectura

```
Internet
    │
    ▼
┌─────────────────┐
│  ALB (Public)  │
└─────────────────┘
    │
    ├─────────────────┬─────────────────┐
    ▼                 ▼                 ▼
┌──────────┐   ┌──────────┐   ┌──────────┐
│ Frontend │   │ Backend  │   │ Backend  │
│ (ECS)    │   │ (ECS)    │   │ (ECS)    │
└──────────┘   └──────────┘   └──────────┘
    │                 │                 │
    │                 ├─────────────────┘
    │                 │
    │                 ▼
    │         ┌──────────────┐
    │         │ PostgreSQL   │
    │         │ (RDS)        │
    │         └──────────────┘
    │                 │
    │                 ▼
    │         ┌──────────────┐
    │         │ Redis        │
    │         │ (ElastiCache)│
    │         └──────────────┘
```

### Componentes

- **VPC**: Red virtual con subnets públicas, privadas y de base de datos
- **ALB**: Application Load Balancer para distribuir tráfico
- **ECS Fargate**: Contenedores para frontend y backend
- **RDS PostgreSQL**: Base de datos relacional con Multi-AZ
- **ElastiCache Redis**: Cache en memoria
- **Auto Scaling**: Escalado automático basado en CPU/Memoria
- **Security Groups**: Reglas de firewall optimizadas

## 📁 Estructura de Archivos

```
terraform/
├── main.tf                  # Configuración principal y provider
├── variables.tf             # Variables definidas
├── network.tf               # VPC, subnets, NAT Gateways
├── security_groups.tf       # Security groups
├── alb.tf                   # Application Load Balancer
├── ecs.tf                   # ECS cluster y services
├── rds.tf                   # RDS PostgreSQL
├── redis.tf                 # ElastiCache Redis
├── autoscaling.tf           # Auto scaling policies
├── outputs.tf               # Outputs de Terraform
├── versions.tf              # Versiones de providers
├── terraform.tfvars.example # Ejemplo de variables
└── README.md               # Este archivo
```

## 🚀 Inicio Rápido

### Prerrequisitos

1. **Terraform** >= 1.5.0
   ```bash
   # Verificar versión
   terraform version
   ```

2. **AWS CLI** configurado
   ```bash
   aws configure
   ```

3. **Permisos IAM** adecuados para crear recursos AWS

### Configuración Inicial

1. **Clonar y navegar al directorio**
   ```bash
   cd terraform
   ```

2. **Copiar archivo de ejemplo**
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   ```

3. **Editar terraform.tfvars** con tus valores:
   ```hcl
   aws_region  = "us-east-1"
   environment = "production"
   project_name = "ecommerce"
   
   # Docker images
   backend_image  = "ghcr.io/your-org/ecommerce/backend:latest"
   frontend_image = "ghcr.io/your-org/ecommerce/frontend:latest"
   
   # Database password (usar Secrets Manager en producción)
   db_password = "your-secure-password"
   ```

4. **Inicializar Terraform**
   ```bash
   terraform init
   ```

5. **Planear cambios**
   ```bash
   terraform plan
   ```

6. **Aplicar configuración**
   ```bash
   terraform apply
   ```

## 📝 Variables Principales

### Requeridas

- `aws_region`: Región de AWS
- `environment`: Ambiente (dev, staging, production)
- `project_name`: Nombre del proyecto
- `backend_image`: Imagen Docker del backend
- `frontend_image`: Imagen Docker del frontend
- `db_password`: Contraseña de RDS

### Opcionales (con defaults)

Ver `variables.tf` para lista completa.

## 🔧 Configuración Avanzada

### Backend State (S3)

Para equipo de trabajo, configurar backend remoto:

```hcl
# En main.tf, descomentar:
backend "s3" {
  bucket         = "your-terraform-state-bucket"
  key            = "ecommerce/terraform.tfstate"
  region         = "us-east-1"
  encrypt        = true
  dynamodb_table = "terraform-state-lock"
}
```

### HTTPS con ACM

1. Crear certificado en ACM (us-east-1 para ALB)
2. Agregar a `terraform.tfvars`:
   ```hcl
   enable_https       = true
   ssl_certificate_arn = "arn:aws:acm:us-east-1:...:certificate/..."
   ```

### Variables de Entorno Sensibles

Usar AWS Secrets Manager en lugar de variables de entorno en task definitions:

```bash
# Crear secret
aws secretsmanager create-secret \
  --name ecommerce/database-url \
  --secret-string "postgresql://..."

# En ECS task definition, usar:
# secrets = [{
#   name = "DATABASE_URL"
#   valueFrom = "arn:aws:secretsmanager:..."
# }]
```

## 📊 Outputs

Después de `terraform apply`, obtener outputs:

```bash
# Ver todos los outputs
terraform output

# Output específico
terraform output alb_dns_name
terraform output rds_endpoint
terraform output redis_endpoint
```

### Outputs Disponibles

- `alb_dns_name`: DNS del Load Balancer
- `alb_url`: URL HTTP
- `alb_url_https`: URL HTTPS (si está habilitado)
- `ecs_cluster_name`: Nombre del cluster ECS
- `rds_endpoint`: Endpoint de PostgreSQL
- `redis_endpoint`: Endpoint de Redis
- `backend_service_name`: Nombre del servicio backend
- `frontend_service_name`: Nombre del servicio frontend

## 🔐 Seguridad

### Security Groups Optimizados

- **ALB**: HTTP/HTTPS desde Internet
- **Backend**: Solo desde ALB y frontend (puerto 8000)
- **Frontend**: Solo desde ALB (puerto 80)
- **RDS**: Solo desde backend (puerto 5432)
- **Redis**: Solo desde backend (puerto 6379)

### Mejores Prácticas

- ✅ RDS en subnets privadas
- ✅ ECS tasks sin IPs públicas
- ✅ Security groups con mínimo privilegio
- ✅ Encriptación en tránsito y reposo
- ✅ Multi-AZ para alta disponibilidad
- ✅ Backup automático de RDS
- ✅ Logging habilitado (CloudWatch)

## ⚙️ Auto Scaling

### Configuración

Auto scaling está habilitado por defecto con:

- **CPU Target**: 70% para backend y frontend
- **Memory Target**: 80% para backend y frontend
- **Min Capacity**: 2 tasks
- **Max Capacity**: 10 tasks

### Ajustar Escalado

Editar en `terraform.tfvars`:

```hcl
backend_min_capacity = 2
backend_max_capacity = 20
backend_scaling_target_cpu = 60  # Más conservador
```

## 💰 Estimación de Costos

Aproximado para producción (us-east-1):

- **ALB**: ~$16/mes
- **ECS Fargate** (4 tasks): ~$120/mes
- **RDS db.t3.medium** (Multi-AZ): ~$150/mes
- **ElastiCache cache.t3.micro**: ~$15/mes
- **NAT Gateway**: ~$32/mes
- **Data Transfer**: Variable

**Total estimado**: ~$330-400/mes (sin data transfer)

## 🧹 Limpieza

Para destruir toda la infraestructura:

```bash
terraform destroy
```

⚠️ **ADVERTENCIA**: Esto eliminará todos los recursos, incluyendo la base de datos.

Para preservar la base de datos, antes de destruir:

```bash
# Crear snapshot manual
aws rds create-db-snapshot \
  --db-instance-identifier ecommerce-db \
  --db-snapshot-identifier ecommerce-final-snapshot
```

## 📚 Recursos Adicionales

- [Terraform AWS Provider Documentation](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [ECS Best Practices](https://docs.aws.amazon.com/AmazonECS/latest/bestpracticesguide/)
- [RDS Best Practices](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_BestPractices.html)
- [ALB Best Practices](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/application-load-balancer-best-practices.html)

## 🐛 Troubleshooting

### Error: Insufficient permissions

Verificar que el usuario IAM tenga permisos para crear recursos:
- EC2 (VPC, Security Groups)
- ECS (Cluster, Services, Task Definitions)
- RDS (Instances, Subnet Groups)
- ElastiCache (Replication Groups)
- IAM (Roles, Policies)
- CloudWatch (Log Groups)

### Error: Subnet not available

Verificar que hay al menos 2 Availability Zones disponibles en la región.

### ECS Tasks no inician

1. Verificar CloudWatch logs
2. Verificar security groups
3. Verificar task definition (imagen, puertos)
4. Verificar health checks

### RDS no accesible desde ECS

1. Verificar security group permite conexión desde backend
2. Verificar que RDS está en subnets correctas
3. Verificar endpoint en variables de entorno

## 📞 Soporte

Para problemas o preguntas:
1. Revisar logs de CloudWatch
2. Verificar outputs de Terraform
3. Consultar documentación de AWS
4. Revisar issues del proyecto


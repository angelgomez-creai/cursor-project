# ECS Deployment Guide - E-commerce

## 📋 Descripción

Guía completa para la configuración avanzada de ECS services con Service Discovery, Auto-scaling, Health Checks y Rolling Deployments.

## 🏗️ Componentes Configurados

### 1. Task Definitions

#### Backend Task Definition
- **Network Mode**: `awsvpc`
- **Launch Type**: Fargate
- **CPU/Memory**: Configurables (default: 512 CPU, 1024 MB)
- **Health Checks**: Configurables con grace period
- **Environment Variables**: Auto-configuradas
- **Service Discovery**: Variables de entorno incluidas

#### Frontend Task Definition
- **Network Mode**: `awsvpc`
- **Launch Type**: Fargate
- **CPU/Memory**: Configurables (default: 256 CPU, 512 MB)
- **Health Checks**: Configurables
- **Environment Variables**: Auto-configuradas

### 2. Service Discovery (AWS Cloud Map)

**Configuración:**
- **Namespace**: `{project_name}.local`
- **Routing Policy**: MULTIVALUE (distribución de carga)
- **TTL**: 10 segundos
- **DNS Records**: Tipo A

**Servicios Registrados:**
- `{backend_service_name}.{namespace}` → Backend tasks
- `{frontend_service_name}.{namespace}` → Frontend tasks

**Uso en Aplicación:**
```python
# Backend puede descubrir otros servicios
backend_url = "http://ecommerce-backend.ecommerce.local:8000"
```

**Variables de Entorno Auto-configuradas:**
- `SERVICE_DISCOVERY_NAMESPACE`
- `BACKEND_SERVICE_NAME`

### 3. Auto Scaling

#### Target Tracking Scaling (CPU-based)
- **Backend**: Target 70% CPU (configurable)
- **Frontend**: Target 70% CPU (configurable)
- **Scale-out Cooldown**: 60 segundos
- **Scale-in Cooldown**: 300 segundos
- **Disable Scale-in**: Automático si min_capacity <= 1

#### Target Tracking Scaling (Memory-based)
- **Target**: 80% memoria
- **Cooldowns**: Igual que CPU

#### Step Scaling (Opcional)
Escalado en pasos basado en métricas:
- 0-10% sobre target: +1 task
- 10-20% sobre target: +2 tasks
- >20% sobre target: +3 tasks

#### Scheduled Scaling (Opcional)
- **Scale Up**: 8 AM UTC (cron: `0 8 * * ? *`)
- **Scale Down**: 10 PM UTC (cron: `0 22 * * ? *`)

### 4. Health Checks

#### Container Health Checks
- **Interval**: 30 segundos (configurable)
- **Timeout**: 5 segundos (configurable)
- **Retries**: 3 (configurable)
- **Start Period**: 60 segundos grace period
- **Command**: Customizable por servicio

#### ALB Health Checks
- **Healthy Threshold**: 2 checks consecutivos
- **Unhealthy Threshold**: 3 checks consecutivos
- **Timeout**: 5 segundos
- **Interval**: 30 segundos
- **Grace Period**: 120 segundos antes de marcar unhealthy

#### CloudWatch Alarms
- **Backend Unhealthy**: Alerta cuando hay tasks unhealthy
- **Frontend Unhealthy**: Alerta cuando hay tasks unhealthy
- **SNS Notifications**: Opcional (configurar email)

### 5. Rolling Deployments

#### Deployment Configuration
- **Maximum Percent**: 200% (permite duplicar tasks durante deployment)
- **Minimum Healthy Percent**: 100% (mantiene capacidad completa)
- **Deployment Circuit Breaker**: Enabled (auto rollback on failure)

#### Deployment Strategy
1. **Incremento**: Lanza nuevos tasks (hasta 200%)
2. **Health Check**: Espera que nuevos tasks pasen health checks
3. **Drain**: Drena conexiones de tasks antiguos (30s slow start)
4. **Finalización**: Termina tasks antiguos cuando nuevos están healthy

#### Ordered Placement
- **Strategy**: Spread por Availability Zone
- **Resultado**: Tasks distribuidos uniformemente en AZs

### 6. Advanced Features

#### ECS Exec
- **Habilitado**: Permite `exec` en containers running
- **Uso**: `aws ecs execute-command --cluster {cluster} --task {task-id} --container backend --command "/bin/sh" --interactive`

#### Task Stop Timeout
- **Default**: 30 segundos
- **Permite**: Shutdown graceful de containers

#### Platform Version
- **Default**: LATEST (Fargate latest)
- **Alternativas**: 1.4.0 para features específicas

#### Ulimits (Opcional)
- **Habilitado**: Si `enable_ulimits = true`
- **Configuración**: nofile soft/hard = 65536

## 🚀 Deployment Flow

### Rolling Update Process

```
1. Update Task Definition
   ↓
2. ECS Service detecta nuevo task definition
   ↓
3. Lanza nuevos tasks (hasta 200% capacity)
   ↓
4. Espera grace period (120s)
   ↓
5. Health checks en nuevos tasks
   ↓
6. Si health checks pasan:
   → Drena conexiones de tasks antiguos (30s slow start)
   → Registra nuevos tasks en Service Discovery
   → Actualiza ALB target group
   ↓
7. Si health checks fallan:
   → Deployment Circuit Breaker activa
   → Rollback automático a task definition anterior
   ↓
8. Termina tasks antiguos
   ↓
9. Service estable en nueva versión
```

## 📊 Monitoring

### CloudWatch Metrics

**ECS Service Metrics:**
- `CPUUtilization`
- `MemoryUtilization`
- `DesiredTaskCount`
- `RunningTaskCount`
- `PendingTaskCount`

**ALB Metrics:**
- `HealthyHostCount`
- `UnhealthyHostCount`
- `TargetResponseTime`
- `RequestCount`

**Auto Scaling:**
- `TargetCapacity`
- `ScaleInRequests`
- `ScaleOutRequests`

### CloudWatch Alarms

- Backend Unhealthy Hosts
- Frontend Unhealthy Hosts
- Auto Scaling Events

## ⚙️ Configuración Avanzada

### Custom Health Check Command

```hcl
# En terraform.tfvars
backend_health_check_command = "CMD-SHELL,curl -f http://localhost:8000/health || exit 1"
frontend_health_check_command = "CMD-SHELL,wget --spider http://localhost:80/ || exit 1"
```

### Deployment Parameters

```hcl
# Rolling deployment más rápido
deployment_maximum_percent = 250  # Permite más tasks durante deployment
deployment_minimum_healthy_percent = 50  # Permite bajar capacidad temporalmente

# Rolling deployment más conservador
deployment_maximum_percent = 150
deployment_minimum_healthy_percent = 100
```

### Auto Scaling Tuning

```hcl
# Escalado más agresivo
backend_scaling_target_cpu = 60  # Escala antes
scale_out_cooldown = 30  # Escala más rápido

# Escalado más conservador
backend_scaling_target_cpu = 80  # Escala después
scale_in_cooldown = 600  # Reduce más lento
```

## 🔍 Troubleshooting

### Tasks No Inician

1. **Verificar Logs**:
   ```bash
   aws logs tail /ecs/ecommerce/backend --follow
   ```

2. **Verificar Task Definition**:
   ```bash
   aws ecs describe-task-definition \
     --task-definition ecommerce-backend
   ```

3. **Verificar IAM Roles**:
   ```bash
   aws iam get-role --role-name ecommerce-ecs-task-execution-role
   ```

### Health Checks Failing

1. **Verificar Container Health**:
   ```bash
   aws ecs describe-tasks \
     --cluster ecommerce-cluster \
     --tasks {task-id}
   ```

2. **Verificar ALB Target Health**:
   ```bash
   aws elbv2 describe-target-health \
     --target-group-arn {target-group-arn}
   ```

3. **Verificar Security Groups**:
   - ALB → Backend: Puerto permitido
   - Backend → RDS: Puerto 5432 permitido

### Service Discovery No Funciona

1. **Verificar Namespace**:
   ```bash
   aws servicediscovery list-namespaces
   ```

2. **Verificar Service Registration**:
   ```bash
   aws servicediscovery list-instances \
     --service-id {service-id}
   ```

3. **Verificar DNS Resolution**:
   ```bash
   # Desde dentro de un task
   nslookup ecommerce-backend.ecommerce.local
   ```

### Auto Scaling No Escala

1. **Verificar Metrics**:
   ```bash
   aws cloudwatch get-metric-statistics \
     --namespace AWS/ECS \
     --metric-name CPUUtilization \
     --dimensions Name=ServiceName,Value=ecommerce-backend
   ```

2. **Verificar Auto Scaling Target**:
   ```bash
   aws application-autoscaling describe-scalable-targets \
     --service-namespace ecs
   ```

3. **Verificar Cooldowns**: Puede estar en periodo de cooldown

## 📚 Recursos Adicionales

- [ECS Best Practices](https://docs.aws.amazon.com/AmazonECS/latest/bestpracticesguide/)
- [Service Discovery](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-discovery.html)
- [Auto Scaling](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-auto-scaling.html)
- [Deployment Configuration](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-configurations.html)


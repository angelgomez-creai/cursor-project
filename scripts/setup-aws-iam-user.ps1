# PowerShell script para crear usuario IAM para GitHub Actions
# Uso: .\setup-aws-iam-user.ps1 -Username github-actions -Region us-east-1

param(
    [string]$Username = "github-actions",
    [string]$Region = "us-east-1"
)

Write-Host "🔐 Setting up IAM user for GitHub Actions..." -ForegroundColor Cyan
Write-Host "Username: $Username"
Write-Host "Region: $Region"
Write-Host ""

# Crear usuario
Write-Host "📝 Creating IAM user..." -ForegroundColor Yellow
try {
    aws iam create-user --user-name $Username 2>&1 | Out-Null
    Write-Host "✅ User created" -ForegroundColor Green
} catch {
    Write-Host "⚠️  User may already exist" -ForegroundColor Yellow
}

# Crear policy para ECS
Write-Host "📝 Creating ECS deployment policy..." -ForegroundColor Yellow
$ecsPolicy = @{
    Version = "2012-10-17"
    Statement = @(
        @{
            Effect = "Allow"
            Action = @(
                "ecs:UpdateService",
                "ecs:DescribeServices",
                "ecs:DescribeTaskDefinition",
                "ecs:RegisterTaskDefinition"
            )
            Resource = "*"
        },
        @{
            Effect = "Allow"
            Action = @(
                "iam:PassRole"
            )
            Resource = "arn:aws:iam::*:role/ecsTaskExecutionRole"
        }
    )
}

$ecsPolicyJson = $ecsPolicy | ConvertTo-Json -Depth 10
$ecsPolicyJson | Out-File -FilePath "$env:TEMP\ecs-deploy-policy.json" -Encoding utf8

try {
    aws iam create-policy `
        --policy-name "${Username}-ecs-deploy" `
        --policy-document "file://$env:TEMP\ecs-deploy-policy.json" `
        2>&1 | Out-Null
    Write-Host "✅ ECS policy created" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Policy may already exist" -ForegroundColor Yellow
}

# Crear policy para S3/CloudFront
Write-Host "📝 Creating S3/CloudFront deployment policy..." -ForegroundColor Yellow
$s3Policy = @{
    Version = "2012-10-17"
    Statement = @(
        @{
            Effect = "Allow"
            Action = @(
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject",
                "s3:ListBucket"
            )
            Resource = @(
                "arn:aws:s3:::ecommerce-frontend-*",
                "arn:aws:s3:::ecommerce-frontend-*/*"
            )
        },
        @{
            Effect = "Allow"
            Action = @(
                "cloudfront:CreateInvalidation",
                "cloudfront:GetInvalidation",
                "cloudfront:ListInvalidations"
            )
            Resource = "*"
        }
    )
}

$s3PolicyJson = $s3Policy | ConvertTo-Json -Depth 10
$s3PolicyJson | Out-File -FilePath "$env:TEMP\s3-cloudfront-policy.json" -Encoding utf8

try {
    aws iam create-policy `
        --policy-name "${Username}-s3-cloudfront" `
        --policy-document "file://$env:TEMP\s3-cloudfront-policy.json" `
        2>&1 | Out-Null
    Write-Host "✅ S3/CloudFront policy created" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Policy may already exist" -ForegroundColor Yellow
}

# Obtener account ID
$accountId = aws sts get-caller-identity --query Account --output text

# Attach policies
Write-Host "📝 Attaching policies..." -ForegroundColor Yellow
try {
    aws iam attach-user-policy `
        --user-name $Username `
        --policy-arn "arn:aws:iam::${accountId}:policy/${Username}-ecs-deploy" `
        2>&1 | Out-Null
    Write-Host "✅ ECS policy attached" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Policy may already be attached" -ForegroundColor Yellow
}

try {
    aws iam attach-user-policy `
        --user-name $Username `
        --policy-arn "arn:aws:iam::${accountId}:policy/${Username}-s3-cloudfront" `
        2>&1 | Out-Null
    Write-Host "✅ S3/CloudFront policy attached" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Policy may already be attached" -ForegroundColor Yellow
}

# Crear access key
Write-Host "📝 Creating access key..." -ForegroundColor Yellow
try {
    $keyOutput = aws iam create-access-key --user-name $Username | ConvertFrom-Json
    $accessKeyId = $keyOutput.AccessKey.AccessKeyId
    $secretAccessKey = $keyOutput.AccessKey.SecretAccessKey

    Write-Host ""
    Write-Host "✅ IAM user setup complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Configure these secrets in GitHub:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "AWS_ACCESS_KEY_ID=$accessKeyId"
    Write-Host "AWS_SECRET_ACCESS_KEY=$secretAccessKey"
    Write-Host "AWS_REGION=$Region"
    Write-Host ""
    Write-Host "⚠️  IMPORTANT: Save AWS_SECRET_ACCESS_KEY immediately. It won't be shown again!" -ForegroundColor Red
    Write-Host ""
    Write-Host "To configure in GitHub:" -ForegroundColor Cyan
    Write-Host "gh secret set AWS_ACCESS_KEY_ID --body `"$accessKeyId`""
    Write-Host "gh secret set AWS_SECRET_ACCESS_KEY --body `"$secretAccessKey`""
    Write-Host "gh secret set AWS_REGION --body `"$Region`""
} catch {
    Write-Host "⚠️  Access key may already exist. Listing existing keys..." -ForegroundColor Yellow
    aws iam list-access-keys --user-name $Username
}


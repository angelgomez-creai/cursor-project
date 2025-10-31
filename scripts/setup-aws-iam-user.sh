#!/bin/bash

# Script para crear usuario IAM para GitHub Actions
# Uso: ./setup-aws-iam-user.sh <username> <region>

set -e

USERNAME="${1:-github-actions}"
REGION="${2:-us-east-1}"

echo "🔐 Setting up IAM user for GitHub Actions..."
echo "Username: $USERNAME"
echo "Region: $REGION"
echo ""

# Crear usuario
echo "📝 Creating IAM user..."
aws iam create-user --user-name "$USERNAME" 2>/dev/null || echo "⚠️  User already exists"

# Crear policy para ECS
echo "📝 Creating ECS deployment policy..."
cat > /tmp/ecs-deploy-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecs:UpdateService",
        "ecs:DescribeServices",
        "ecs:DescribeTaskDefinition",
        "ecs:RegisterTaskDefinition"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "iam:PassRole"
      ],
      "Resource": "arn:aws:iam::*:role/ecsTaskExecutionRole"
    }
  ]
}
EOF

aws iam create-policy \
  --policy-name "${USERNAME}-ecs-deploy" \
  --policy-document file:///tmp/ecs-deploy-policy.json \
  2>/dev/null || echo "⚠️  Policy already exists"

# Crear policy para S3/CloudFront
echo "📝 Creating S3/CloudFront deployment policy..."
cat > /tmp/s3-cloudfront-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::ecommerce-frontend-*",
        "arn:aws:s3:::ecommerce-frontend-*/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation",
        "cloudfront:GetInvalidation",
        "cloudfront:ListInvalidations"
      ],
      "Resource": "*"
    }
  ]
}
EOF

aws iam create-policy \
  --policy-name "${USERNAME}-s3-cloudfront" \
  --policy-document file:///tmp/s3-cloudfront-policy.json \
  2>/dev/null || echo "⚠️  Policy already exists"

# Obtener account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# Attach policies
echo "📝 Attaching policies..."
aws iam attach-user-policy \
  --user-name "$USERNAME" \
  --policy-arn "arn:aws:iam::${ACCOUNT_ID}:policy/${USERNAME}-ecs-deploy" \
  2>/dev/null || echo "⚠️  Policy already attached"

aws iam attach-user-policy \
  --user-name "$USERNAME" \
  --policy-arn "arn:aws:iam::${ACCOUNT_ID}:policy/${USERNAME}-s3-cloudfront" \
  2>/dev/null || echo "⚠️  Policy already attached"

# Crear access key
echo "📝 Creating access key..."
OUTPUT=$(aws iam create-access-key --user-name "$USERNAME" 2>/dev/null || {
  echo "⚠️  Access key already exists. Listing existing keys..."
  aws iam list-access-keys --user-name "$USERNAME"
  exit 1
})

ACCESS_KEY_ID=$(echo "$OUTPUT" | jq -r '.AccessKey.AccessKeyId')
SECRET_ACCESS_KEY=$(echo "$OUTPUT" | jq -r '.AccessKey.SecretAccessKey')

echo ""
echo "✅ IAM user setup complete!"
echo ""
echo "📋 Configure these secrets in GitHub:"
echo ""
echo "AWS_ACCESS_KEY_ID=$ACCESS_KEY_ID"
echo "AWS_SECRET_ACCESS_KEY=$SECRET_ACCESS_KEY"
echo "AWS_REGION=$REGION"
echo ""
echo "⚠️  IMPORTANT: Save AWS_SECRET_ACCESS_KEY immediately. It won't be shown again!"
echo ""
echo "To configure in GitHub:"
echo "gh secret set AWS_ACCESS_KEY_ID --body \"$ACCESS_KEY_ID\""
echo "gh secret set AWS_SECRET_ACCESS_KEY --body \"$SECRET_ACCESS_KEY\""
echo "gh secret set AWS_REGION --body \"$REGION\""


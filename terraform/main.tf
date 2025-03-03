terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "angular-simple-crud"
    key            = "infra/terraform.tfstate"
    region         = "us-east-1"
  }
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_s3_bucket" "angular_hosting" {
  bucket = "meu-angular-app"
}

resource "aws_s3_bucket_website_configuration" "angular_website" {
  bucket = aws_s3_bucket.angular_hosting.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"
  }
}

resource "aws_s3_bucket_policy" "angular_policy" {
  bucket = aws_s3_bucket.angular_hosting.id

  policy = <<POLICY
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": "*",
        "Action": "s3:GetObject",
        "Resource": "arn:aws:s3:::${aws_s3_bucket.angular_hosting.id}/*"
      }
    ]
  }
  POLICY
}

resource "aws_cloudfront_distribution" "cdn" {
  origin {
    domain_name = aws_s3_bucket.angular_hosting.bucket_regional_domain_name
    origin_id   = "angularS3Origin"
  }

  enabled             = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "angularS3Origin"

    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    response_headers_policy_id = aws_cloudfront_response_headers_policy.security_headers.id
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

resource "aws_cloudfront_response_headers_policy" "security_headers" {
  name = "SecurityHeadersPolicy"

  security_headers_config {
    content_security_policy {
      override = true
      content_security_policy = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; object-src 'none'; frame-ancestors 'none'; base-uri 'self';"
    }

    strict_transport_security {
      override           = true
      include_subdomains = true
      preload            = true
      max_age_sec        = 63072000
    }

    x_content_type_options {
      override = true
    }

    x_frame_options {
      override = true
      frame_option = "DENY"
    }

    referrer_policy {
      override       = true
      referrer_policy = "no-referrer"
    }

    permissions_policy {
      override = true
      permissions_policy = "geolocation=(), microphone=(), camera=(), payment=()"
    }
  }
}

resource "aws_route53_record" "app_dns" {
  zone_id = "Z123456789"  # Substitua pelo seu Hosted Zone ID
  name    = "app.meudominio.com"
  type    = "A"

  alias {
    name                   = aws_cloudfront_distribution.cdn.domain_name
    zone_id                = aws_cloudfront_distribution.cdn.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_s3_bucket" "demo-example" {
  bucket = "demoexample-1"
  versioning {
    enabled = false
    mfa_delete = false
  }
}

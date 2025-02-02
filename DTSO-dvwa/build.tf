# Configure the Docker provider
provider "docker" {
  host = "tcp://127.0.0.1:12345"
}

# Create Vault container
resource "docker_container" "vault" {
  image = "${docker_image.vault.latest}"
  name  = "vault"
  hostname = "vault"
  env = ["VAULT_DEV_ROOT_TOKEN_ID=toor", "VAULT_DEV_LISTEN_ADDRESS=0.0.0.0:8200", "SKIP_SETCAP=yes"]
  ports {
    internal = 8200
    external = 8200
        }
}

# Create Vault image
resource "docker_image" "vault" {
  name = "vault:latest"
  keep_locally = true
}

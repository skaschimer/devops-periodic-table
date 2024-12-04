resource "azurerm_app_service_environment_v3" "main" {
  name                = "ase-${local.naming_suffix}"
  resource_group_name = azurerm_resource_group.main.name
  subnet_id           = azurerm_subnet.main.id

  internal_load_balancing_mode = "Web, Publishing"

  cluster_setting {
    name  = "ase-${local.naming_suffix}"
    value = "1"
  }

  cluster_setting {
    name  = "ase-${local.naming_suffix}"
    value = "true"
  }

  cluster_setting {
    name  = "ase-${local.naming_suffix}"
    value = "TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384,TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256"
  }

  tags = var.tags
}
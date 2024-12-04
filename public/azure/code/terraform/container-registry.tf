resource "azurerm_container_registry" "acr" {
  name                = "cr${local.naming_suffix}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  sku                 = "Premium"
  admin_enabled       = false
  georeplications {
    location                = var.location
    zone_redundancy_enabled = true
    tags                    = var.tags
  }
  georeplications {
    location                = var.location
    zone_redundancy_enabled = true
    tags                    = var.tags
  }
}
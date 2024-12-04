resource "azurerm_kusto_cluster" "main" {
  name                = "dec${local.naming_suffix}"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name

  sku {
    name     = "dec${local.naming_suffix}"
    capacity = 2
  }

  tags = var.tags
}
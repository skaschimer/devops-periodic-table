resource "azurerm_route_table" "main" {
  name                = "rt-${local.naming_suffix}"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name

  route {
    name           = "rt-${local.naming_suffix}"
    address_prefix = "10.1.0.0/16"
    next_hop_type  = "VnetLocal"
  }

  tags = var.tags
}
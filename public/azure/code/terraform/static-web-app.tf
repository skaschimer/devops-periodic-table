resource "azurerm_static_site" "main" {
  name                = "stapp-${local.naming_suffix}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
}
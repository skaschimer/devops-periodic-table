resource "azurerm_subnet" "main" {
  name                 = "snet-${local.naming_suffix}"
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = ["10.0.1.0/24"]

  delegation {
    name = "snet-${local.naming_suffix}"

    service_delegation {
      name    = "snet-${local.naming_suffix}"
      actions = ["Microsoft.Network/virtualNetworks/subnets/join/action", "Microsoft.Network/virtualNetworks/subnets/prepareNetworkPolicies/action"]
    }
  }
}
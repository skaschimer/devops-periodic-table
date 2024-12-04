resource "azurerm_mssql_managed_instance" "main" {
  name                = "sqlmi-${local.naming_suffix}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location

  license_type       = "BasePrice"
  sku_name           = "GP_Gen5"
  storage_size_in_gb = 32
  subnet_id          = azurerm_subnet.main.id
  vcores             = 4

  administrator_login          = "mradministrator"
  administrator_login_password = "thisIsDog11"

  depends_on = [
    azurerm_subnet_network_security_group_association.main,
    azurerm_subnet_route_table_association.main,
  ]
}
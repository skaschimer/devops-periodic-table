resource "azurerm_database_migration_project" "main" {
  name                = "migr-${local.naming_suffix}"
  service_name        = azurerm_database_migration_service.main.name
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  source_platform     = "SQL"
  target_platform     = "SQLDB"
}
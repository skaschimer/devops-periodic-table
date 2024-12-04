resource "azurerm_mssql_database" "main" {
  name         = "mysqldb-${local.naming_suffix}"
  server_id    = azurerm_mssql_server.main.id
  collation    = "SQL_Latin1_General_CP1_CI_AS"
  license_type = "LicenseIncluded"
  max_size_gb  = 2
  sku_name     = "S0"
  enclave_type = "VBS"

  tags = var.tags

  # prevent the possibility of accidental data loss
  lifecycle {
    prevent_destroy = true
  }
}
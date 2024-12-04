resource "azurerm_eventhub" "main" {
  name              = "evh-${local.naming_suffix}"
  namespace_id      = azurerm_eventhub_namespace.main.id
  partition_count   = 2
  message_retention = 1
}
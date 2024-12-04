resource "azurerm_cosmosdb_account" "db" {
  name                = "cosmos-${local.naming_suffix}"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  offer_type          = "Standard"
  kind                = "MongoDB"

  automatic_failover_enabled = true

  capabilities {
    name = "cosmos-${local.naming_suffix}"
  }

  capabilities {
    name = "cosmos-${local.naming_suffix}"
  }

  capabilities {
    name = "cosmos-${local.naming_suffix}"
  }

  capabilities {
    name = "cosmos-${local.naming_suffix}"
  }

  consistency_policy {
    consistency_level       = "BoundedStaleness"
    max_interval_in_seconds = 300
    max_staleness_prefix    = 100000
  }

  geo_location {
    location          = var.location
    failover_priority = 1
  }

  geo_location {
    location          = var.location
    failover_priority = 0
  }
}
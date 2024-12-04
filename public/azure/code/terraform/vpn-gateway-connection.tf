resource "azurerm_vpn_gateway_connection" "main" {
  name               = "vcn-${local.naming_suffix}"
  vpn_gateway_id     = azurerm_vpn_gateway.main.id
  remote_vpn_site_id = azurerm_vpn_site.main.id

  vpn_link {
    name             = "vcn-${local.naming_suffix}"
    vpn_site_link_id = azurerm_vpn_site.main.link[0].id
  }

  vpn_link {
    name             = "vcn-${local.naming_suffix}"
    vpn_site_link_id = azurerm_vpn_site.main.link[1].id
  }
}
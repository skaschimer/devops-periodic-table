resource "azurerm_frontdoor" "main" {
  name                = "fd-${local.naming_suffix}"
  resource_group_name = azurerm_resource_group.main.name

  routing_rule {
    name               = "fd-${local.naming_suffix}"
    accepted_protocols = ["Http", "Https"]
    patterns_to_match  = ["/*"]
    frontend_endpoints = ["exampleFrontendEndpoint1"]
    forwarding_configuration {
      forwarding_protocol = "MatchRequest"
      backend_pool_name   = "exampleBackendBing"
    }
  }

  backend_pool_load_balancing {
    name = "fd-${local.naming_suffix}"
  }

  backend_pool_health_probe {
    name = "fd-${local.naming_suffix}"
  }

  backend_pool {
    name = "fd-${local.naming_suffix}"
    backend {
      host_header = "www.bing.com"
      address     = "www.bing.com"
      http_port   = 80
      https_port  = 443
    }

    load_balancing_name = "exampleLoadBalancingSettings1"
    health_probe_name   = "exampleHealthProbeSetting1"
  }

  frontend_endpoint {
    name      = "fd-${local.naming_suffix}"
    host_name = "example-FrontDoor.azurefd.net"
  }
}
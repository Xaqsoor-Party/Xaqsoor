package com.xaqsoor.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Xaqsoor Membership Management API")
                        .version("1.0.0")
                        .description("API documentation for the Xaqsoor platform, which provides secure user registration, authentication, and membership management features.")
                        .contact(new io.swagger.v3.oas.models.info.Contact()
                                .name("Xaqsoor Support Team")
                                .email("support@xaqsoor.com")
                                .url("https://xaqsoor.com"))
                        .license(new io.swagger.v3.oas.models.info.License()
                                .name("Apache License 2.0")
                                .url("https://www.apache.org/licenses/LICENSE-2.0")))
                .components(new io.swagger.v3.oas.models.Components()
                        .addSecuritySchemes("bearerAuth", new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")))
                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"));
    }
}

package com.xaqsoor.config;

import com.xaqsoor.domain.RequestContext;
import com.xaqsoor.entity.Role;
import com.xaqsoor.enumeration.Authority;
import com.xaqsoor.repository.RoleRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
@Slf4j
public class RoleInitializationConfig {

    @Bean
    CommandLineRunner commandLineRunner(RoleRepository roleRepository) {
        return args -> {
            RequestContext.setUserId(0L);
            Role existingRole = roleRepository.findByNameIgnoreCase("ADMIN").orElse(null);
            if (roleRepository.count() == 1) {
                for (Authority authority : Authority.values()) {
                    if ("ADMIN".equalsIgnoreCase(authority.name()) && existingRole != null) {
                        existingRole.setAuthorities(authority);
                        roleRepository.save(existingRole);
                    }else {
                        roleRepository.save(new Role(authority.name(), authority));
                    }
                }
                log.info("Default roles created.");
            } else {
                log.info("Roles already exist.");
            }
            RequestContext.clear();
        };
    }
}

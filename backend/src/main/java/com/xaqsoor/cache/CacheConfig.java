package com.xaqsoor.cache;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.TimeUnit;

@Configuration
public class CacheConfig {

    @Bean(name = "userCache")
    public CacheStore<String, Integer> userCache() {
        return new CacheStore<>(15, TimeUnit.MINUTES);
    }
}

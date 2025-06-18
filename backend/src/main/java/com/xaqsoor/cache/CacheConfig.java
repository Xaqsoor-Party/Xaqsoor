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
    @Bean(name = "dashboardCache")
    public CacheStore<String, Object> dashboardCache() {
        return new CacheStore<>(5, TimeUnit.MINUTES); // Or any TTL you want
    }
}

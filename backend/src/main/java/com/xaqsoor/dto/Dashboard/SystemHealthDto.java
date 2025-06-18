package com.xaqsoor.dto.Dashboard;

public record SystemHealthDto(
        double cpuLoad,            // System CPU load
        long totalMemory,         // Total system memory (in bytes)
        long freeMemory,          // Free memory (in bytes)
        long usedMemory,          // Used memory (in bytes)
        long uptime,              // System uptime (in minutes)
        int activeThreads,        // Active threads in the JVM
        String lastUpdated
) {
}

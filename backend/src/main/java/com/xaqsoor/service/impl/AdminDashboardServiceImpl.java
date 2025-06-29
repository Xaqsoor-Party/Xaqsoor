package com.xaqsoor.service.impl;

import com.xaqsoor.cache.CacheStore;
import com.xaqsoor.dto.Dashboard.*;
import com.xaqsoor.entity.Role;
import com.xaqsoor.enumeration.MembershipLevel;
import com.xaqsoor.enumeration.Status;
import com.xaqsoor.projections.RecentActivityProjection;
import com.xaqsoor.repository.RoleRepository;
import com.xaqsoor.repository.UserRepository;
import com.xaqsoor.service.AdminDashboardService;
import com.xaqsoor.service.S3Service;
import com.xaqsoor.util.UserUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static com.xaqsoor.dto.Dashboard.Range.*;

import oshi.SystemInfo;
import oshi.hardware.CentralProcessor;
import oshi.hardware.GlobalMemory;

@Service
public class AdminDashboardServiceImpl implements AdminDashboardService {
    @Qualifier("dashboardCache")
    private final CacheStore<String, Object> dashboardCache;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final S3Service s3Service;

    private long[] lastCpuTicks = null;

    @Autowired
    public AdminDashboardServiceImpl(UserRepository userRepository, CacheStore<String, Object> dashboardCache, RoleRepository roleRepository, S3Service s3Service) {
        this.userRepository = userRepository;
        this.dashboardCache = dashboardCache;
        this.roleRepository = roleRepository;
        this.s3Service = s3Service;
    }

    @Override
    public DashboardSummaryDto getDashboardSummary(boolean forceRefresh) {
        if (!forceRefresh) {
            DashboardSummaryDto cached = (DashboardSummaryDto) dashboardCache.get("summary");
            if (cached != null) {
                return cached;
            }
        }

        DashboardSummaryDto summary = buildDashboardSummary();

        dashboardCache.put("summary", summary);

        return summary;
    }

    @Override
    public UserGrowthDto getUserGrowth(TimeRangeRequest request, boolean forceRefresh) {
        String cacheKey = generateCacheKey(request);
        if (!forceRefresh) {
            UserGrowthDto cached = (UserGrowthDto) dashboardCache.get(cacheKey);
            if (cached != null) {
                return cached;
            }
        }
        LocalDateTime startDate = calculateStartDate(request);
        LocalDateTime endDate = request.range() == CUSTOM ?
                request.endDate().atStartOfDay() : LocalDateTime.now();

        List<Object[]> dailySignups = userRepository.getDailySignupsBetweenDates(
                startDate,
                endDate
        );

        // Convert to TimelineEntry records
        List<TimelineEntry> timeline = dailySignups.stream()
                .map(arr -> new TimelineEntry(
                        arr[0].toString(), // date
                        ((Number) arr[1]).longValue() // count
                ))
                .toList();

        double percentageChange = calculateGrowthPercentage(startDate, endDate);

        UserGrowthDto userGrowthDto = new UserGrowthDto(
                timeline,
                percentageChange,
                getComparisonPeriodLabel(request.range()),
                UserUtil.formatDateTime(LocalDateTime.now())
        );

        // Cache the result with the generated key
        dashboardCache.put(cacheKey, userGrowthDto);

        return userGrowthDto;
    }

    @Override
    public RecentActivityListDto getRecentActivities(int page, int size, String orderBy) {

        Sort sort;
        if ("desc".equalsIgnoreCase(orderBy)) {
            sort = Sort.by(Sort.Order.desc("timestamp"));
        } else {
            sort = Sort.by(Sort.Order.asc("timestamp"));
        }

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<RecentActivityProjection> recentActivities = userRepository.findRecentActivities(pageable);

        // Convert the RecentActivityProjection results to a List of RecentActivityDto
        List<RecentActivityDto> activities = recentActivities.stream()
                .map(activity -> new RecentActivityDto(
                        activity.getUserId(),
                        activity.getFirstName(),
                        UserUtil.resolveProfileImageUrl(activity.getProfileImageKey(), s3Service),
                        activity.getDescription(),
                        UserUtil.formatDateTime(activity.getTimestamp())
                ))
                .collect(Collectors.toList());

        // Create and return the RecentActivityListDto with the necessary pagination info
        return new RecentActivityListDto(
                activities, // The list of activities
                recentActivities.getSize(), // Page size
                recentActivities.getNumber(), // Current page number
                recentActivities.getTotalElements() // Total number of items
        );
    }

    @Override
    public SystemHealthDto getSystemHealthMetrics(boolean forceRefresh) {
        String cacheKey = "systemHealthMetrics";

        if (!forceRefresh) {
            SystemHealthDto cached = (SystemHealthDto) dashboardCache.get(cacheKey);
            if (cached != null) {
                return cached;
            }
        }

        SystemInfo systemInfo = new SystemInfo();
        CentralProcessor processor = systemInfo.getHardware().getProcessor();
        GlobalMemory memory = systemInfo.getHardware().getMemory();

        // Get CPU load with synchronization
        double cpuLoad = getCpuLoad(processor);

        // Clamp CPU load between 0-100
        cpuLoad = Math.max(0, Math.min(cpuLoad, 100));

        long totalMemory = memory.getTotal();
        long availableMemory = memory.getAvailable();
        long usedMemory = totalMemory - availableMemory;

        // Get uptime directly from OSHI and convert to minutes
        long uptimeSeconds  = systemInfo.getOperatingSystem().getSystemUptime();
        long uptimeInMinutes = uptimeSeconds / 60;

        int activeThreads = getActiveThreadCount();

        SystemHealthDto systemHealthDto = new SystemHealthDto(
                cpuLoad,
                totalMemory,
                availableMemory,
                usedMemory,
                uptimeInMinutes,
                activeThreads,
                UserUtil.formatDateTime(LocalDateTime.now())
        );

        dashboardCache.put(cacheKey, systemHealthDto);
        return systemHealthDto;
    }

    private DashboardSummaryDto buildDashboardSummary() {
        long totalMembers = userRepository.count();
        double profileCompletionRate = calculateAverageProfileCompletionRate();
        long newMembersThisMonth = getNewMembersThisMonth();
        long lockedAccounts = userRepository.countByAccountNonLockedFalse();
        long mfaEnabledUsers = userRepository.countByMfaEnabledTrue();
        long unverifiedEmails = userRepository.countByEmailVerifiedFalse();
        long loginRestrictedUsers = userRepository.countByIsLoginRestrictedTrue();

        Map<String, Long> membershipLevelDistribution = getMembershipLevelDistribution();
        Map<String, Long> userStatusDistribution = getUserStatusDistribution();
        Map<String, Long> roleDistribution = getRoleDistribution();

        // Fetch the gender counts
        long maleCount = userRepository.countByGender("Male");
        long femaleCount = userRepository.countByGender("Female");
        return new DashboardSummaryDto(
                totalMembers,
                maleCount,
                femaleCount,
                profileCompletionRate,
                UserUtil.formatDateTime(LocalDateTime.now()),
                membershipLevelDistribution,
                userStatusDistribution,
                newMembersThisMonth,
                lockedAccounts,
                mfaEnabledUsers,
                unverifiedEmails,
                loginRestrictedUsers,
                roleDistribution
        );
    }

    private double calculateAverageProfileCompletionRate() {
        long totalUsers = userRepository.count();
        if (totalUsers == 0) return 0.0;

        double completionScore =
                userRepository.countByProfileImageKeyIsNotNullAndProfileImageKeyNot("") * 0.3 +
                        userRepository.countByDateOfBirthIsNotNull() * 0.2 +
                        userRepository.countByBioIsNotNullAndBioNot("") * 0.2 +
                        userRepository.countByCityIsNotNullAndCityNot("") * 0.15 +
                        userRepository.countByPhoneIsNotNullAndPhoneNot("") * 0.15;

        return (completionScore / totalUsers) * 100.0;
    }

    private long getNewMembersThisMonth() {
        LocalDateTime startOfMonth = LocalDateTime.now()
                .with(TemporalAdjusters.firstDayOfMonth())
                .withHour(0).withMinute(0);
        return userRepository.countByCreatedDateAfter(startOfMonth);
    }

    private Map<String, Long> getMembershipLevelDistribution() {
        Map<String, Long> distribution = new LinkedHashMap<>();
        for (MembershipLevel level : MembershipLevel.values()) {
            long count = userRepository.countByMembershipLevel(level);
            distribution.put(level.getValue(), count);
        }
        return distribution;
    }

    private Map<String, Long> getUserStatusDistribution() {
        Map<String, Long> distribution = new LinkedHashMap<>();
        for (Status status : Status.values()) {
            long count = userRepository.countByStatus(status);
            distribution.put(status.getValue(), count);
        }
        return distribution;
    }

    private Map<String, Long> getRoleDistribution() {
        Map<String, Long> distribution = new LinkedHashMap<>();
        for (Role role : roleRepository.findAll()) {
            long count = userRepository.countByRole_Id(role.getId());
            distribution.put(role.getName(), count);
        }
        return distribution;
    }

    private LocalDateTime calculateStartDate(TimeRangeRequest request) {
        return switch (request.range()) {
            case LAST_24H -> LocalDateTime.now().minusDays(1);
            case LAST_7D -> LocalDateTime.now().minusDays(7);
            case LAST_30D -> LocalDateTime.now().minusDays(30);
            case LAST_90D -> LocalDateTime.now().minusDays(90);
            case CUSTOM -> request.startDate().atStartOfDay();
        };
    }

    private String getComparisonPeriodLabel(Range range) {
        return switch (range) {
            case LAST_24H -> "Previous 24 Hours";
            case LAST_7D -> "Previous 7 Days";
            case LAST_30D -> "Previous 30 Days";
            case LAST_90D -> "Previous 90 Days";
            case CUSTOM -> "Custom Period";
        };
    }

    private double calculateGrowthPercentage(LocalDateTime startDate, LocalDateTime endDate) {
        // Current period count
        long currentCount = userRepository.countByCreatedDateBetween(startDate, endDate);

        // Previous period (same duration before startDate)
        LocalDateTime previousPeriodStart = startDate.minus(
                Duration.between(startDate, endDate)
        );
        long previousCount = userRepository.countByCreatedDateBetween(
                previousPeriodStart,
                startDate
        );

        return previousCount > 0 ?
                ((currentCount - previousCount) * 100.0) / previousCount :
                currentCount > 0 ? 100.0 : 0.0;
    }

    private synchronized double getCpuLoad(CentralProcessor processor) {
        long[] currentCpuTicks = processor.getSystemCpuLoadTicks();

        if (lastCpuTicks == null) {
            lastCpuTicks = currentCpuTicks;
            return 0.0;
        }

        double cpuLoad = processor.getSystemCpuLoadBetweenTicks(lastCpuTicks) * 100;
        lastCpuTicks = currentCpuTicks;

        return cpuLoad;
    }

    private int getActiveThreadCount() {
        return Thread.activeCount();
    }

    private String generateCacheKey(TimeRangeRequest request) {
        return "userGrowth-" + request.range() + "-" + request.startDate() + "-" + request.endDate();
    }
}

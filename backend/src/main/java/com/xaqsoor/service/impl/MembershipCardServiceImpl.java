package com.xaqsoor.service.impl;

import com.xaqsoor.dto.response.MembershipCardDto;
import com.xaqsoor.entity.User;
import com.xaqsoor.enumeration.Status;
import com.xaqsoor.exception.ApiException;
import com.xaqsoor.repository.UserRepository;
import com.xaqsoor.service.MembershipCardService;
import com.xaqsoor.service.S3Service;
import com.xaqsoor.util.UserUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class MembershipCardServiceImpl implements MembershipCardService {
    private final UserRepository userRepository;
    private final S3Service s3Service;

    @Override
    public MembershipCardDto generateMembershipCard(Long userId, LocalDate validUntil) {
        User user = getUserById(userId);

        if (!user.getStatus().equals(Status.ACTIVE)){
            throw new ApiException("User is not active.");
        }

        String profileImageUrl = UserUtil.resolveProfileImageUrl(user.getProfileImageKey(),s3Service);
        return null;
    }

    private User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ApiException("User not found"));
    }
}

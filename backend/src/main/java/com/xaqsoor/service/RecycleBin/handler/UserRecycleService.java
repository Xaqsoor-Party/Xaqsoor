package com.xaqsoor.service.RecycleBin.handler;

import com.xaqsoor.dto.response.RecycleItemsResponse;
import com.xaqsoor.dto.response.UserRecycleDto;
import com.xaqsoor.entity.User;
import com.xaqsoor.exception.ApiException;
import com.xaqsoor.mapper.UserMapper;
import com.xaqsoor.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserRecycleService implements RecyclableEntityService {
    private final UserRepository userRepository;

    @Override
    public RecycleItemsResponse getDeletedItems(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "modifiedDate"));
        Page<User> users = userRepository.findAllByIsDeletedTrue(pageable);

        List<UserRecycleDto> userDtos = users.stream()
                .map(deletedUser -> {
                    Long deletedByUserId = deletedUser.getModifiedBy();
                    User deletedByUser;

                    if (deletedByUserId != null) {
                        deletedByUser = userRepository.findById(deletedByUserId)
                                .orElseThrow(() -> new ApiException("User who deleted not found for ID " + deletedByUserId));
                    } else {
                        // Optional: handle null deleter (maybe system or unknown)
                        deletedByUser = getSystemUserPlaceholder();
                    }

                    return UserMapper.toRecycleDto(deletedUser, deletedByUser);
                })
                .toList();


        return new RecycleItemsResponse(
                (int) users.getTotalElements(),
                page,
                size,
                "user",
                userDtos
        );
    }

    @Override
    public void restore(Long id) {
        User user = userRepository.findByIdAndIsDeletedTrue(id)
                .orElseThrow(() -> new ApiException(
                        "Restore failed: No deleted user found with ID " + id + ". " +
                                "Make sure the user exists and is marked as deleted."
                ));

        user.setDeleted(false);
        userRepository.save(user);
    }

    @Override
    public void permanentlyDelete(Long id) {
        if (id == 0L) {
            throw new ApiException("Permanent delete failed: The user with ID 0 is a core system account essential for application integrity and security. Deletion is prohibited.");
        }

        boolean exists = userRepository.existsByIdAndIsDeletedTrue(id);

        if (!exists) {
            throw new ApiException(
                    "Permanent delete failed: No deleted user found with ID " + id +
                            ". Ensure the user exists and is marked as deleted."
            );
        }

        userRepository.deleteById(id);
    }

    private User getSystemUserPlaceholder() {
        User systemUser = new User();
        systemUser.setId(0L);
        systemUser.setFirstName("System");
        systemUser.setLastName("User");
        systemUser.setProfileImageKey(null);
        return systemUser;
    }
}

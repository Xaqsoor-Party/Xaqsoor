package com.xaqsoor.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.xaqsoor.dto.UserDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAuthResponse {
    private UserDto userDTO;
    private String accessToken;
    @JsonIgnore
    private String refreshToken;
}

package com.xaqsoor.dto.response;

import com.xaqsoor.enumeration.LoginStatus;

public record AuthenticationResponse(
        LoginStatus loginStatus,
        String message,
        String securityToken,
        UserAuthResponse userAuthResponse
) {}


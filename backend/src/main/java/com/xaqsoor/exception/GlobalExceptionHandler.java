package com.xaqsoor.exception;

import com.xaqsoor.domain.Response;
import com.xaqsoor.util.RequestUtils;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Collections;

@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ApiException.class)
    public ResponseEntity<Response> handleApiException(ApiException ex, HttpServletRequest request) {
        return buildResponseEntity(request, ex.getMessage(), HttpStatus.BAD_REQUEST,ex);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Response> handleBadCredentialsException(BadCredentialsException ex, HttpServletRequest request) {
        return buildResponseEntity(request, ex.getMessage(), HttpStatus.UNAUTHORIZED, ex);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Response> handleGenericException(Exception ex, HttpServletRequest request) {
        return buildResponseEntity(request, "An unexpected error occurred: " + ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR, ex);
    }

    private ResponseEntity<Response> buildResponseEntity(HttpServletRequest request, String message, HttpStatus status , Exception ex) {
        Response response = RequestUtils.getResponse(
                request,
                Collections.emptyMap(),
                message,
                status,
                ex.getClass().getSimpleName()
        );
        return new ResponseEntity<>(response, status);
    }
}

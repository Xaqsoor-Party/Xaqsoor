package com.xaqsoor.exception;

public class ApiException extends RuntimeException {

  private static final String DEFAULT_MESSAGE = "An unexpected error occurred.";

  public ApiException(String message) {
    super(message != null && !message.trim().isEmpty() ? message : DEFAULT_MESSAGE);
  }

  public ApiException() {
    super(DEFAULT_MESSAGE);
  }

  public ApiException(String message, Throwable cause) {
    super(message != null && !message.trim().isEmpty() ? message : DEFAULT_MESSAGE, cause);
  }

  public ApiException(Throwable cause) {
    super(DEFAULT_MESSAGE, cause);
  }
}
package cloudbreaker.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.UNAUTHORIZED)
public class UnathorizedException extends RuntimeException {
	private static final long serialVersionUID = 1L;
}

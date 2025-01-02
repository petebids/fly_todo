package com.example.todo

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler

@ControllerAdvice(assignableTypes = [TodoController::class])
class TodoControllerAdvice {

  @ExceptionHandler(exception = [IllegalStateException::class])
  fun handle(e: IllegalStateException) =
      ResponseEntity.status(HttpStatus.CONFLICT).body(Error(message = e.message!!))
}

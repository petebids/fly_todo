package com.example.todo

import java.util.UUID
import org.springframework.data.domain.Page
import org.springframework.http.HttpStatus
import org.springframework.http.HttpStatus.CREATED
import org.springframework.http.HttpStatus.NOT_FOUND
import org.springframework.http.HttpStatus.OK
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ResponseStatusException

@CrossOrigin("*")
@RestController
@RequestMapping("/v1/todos")
class TodoController(private val todoService: TodoService) {

  @PostMapping
  fun create(@RequestBody req: CreateTodoRequest): ResponseEntity<TodoResource> =
      ResponseEntity(todoService.create(req.name).toResource(), CREATED)

  @GetMapping
  fun listTodos(@RequestParam q: String?): ResponseEntity<Page<TodoResource>> =
      ResponseEntity.ok(todoService.listTodos(q).map { it.toResource() })

  @GetMapping("/{id}")
  fun retrieveTodo(@PathVariable id: UUID): ResponseEntity<TodoResourceFull> {
    val todo = todoService.fetch(id) ?: throw ResponseStatusException(NOT_FOUND)
    return ResponseEntity(todo.toFullResource(), OK)
  }

  @DeleteMapping  ("/{id}")
  fun deleteTodo(@PathVariable id: UUID): ResponseEntity<Void> {
      todoService.delete(id)
      return ResponseEntity(HttpStatus.NO_CONTENT)
  }


  @PutMapping("/{id}/checklist")
  fun updateChecklist(
      @PathVariable id: UUID,
      @RequestBody item: Item
  ): ResponseEntity<TodoResourceFull> =
      ResponseEntity.ok(
          todoService
              .addCheckListItem(id = id, details = item.details, completed = item.completed)
              .toFullResource())
}

fun Todo.toResource(): TodoResource = TodoResource(id = this.id, name = this.name, this.completed)

fun Todo.toFullResource(): TodoResourceFull =
    TodoResourceFull(
        id = this.id,
        name = this.name,
        details = this.details,
        completed = this.completed,
        checklistItems =
            this.checklist.map { Item(details = it.details, completed = it.completed) }.toSet())

data class CreateTodoRequest(val name: String)

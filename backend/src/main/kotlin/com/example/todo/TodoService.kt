package com.example.todo

import io.github.perplexhub.rsql.RSQLJPASupport
import java.util.UUID
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Isolation.REPEATABLE_READ
import org.springframework.transaction.annotation.Transactional

@Transactional
@Service
class TodoService(private val todoRepository: TodoRepository) {

  fun create(name: String): Todo {
    val todos =
        todoRepository.findAll { root, _, criteriaBuilder ->
          criteriaBuilder.equal(root.get<String>("name"), name)
        }
    return when (todos.count()) {
      0 ->
          todoRepository.save(
              Todo(id = UUID.randomUUID(), name = name, details = null, checklist = emptyList()))
      1 -> todos.first()
      else -> TODO()
    }
  }

  fun delete(id: UUID): Unit = todoRepository.deleteById(id)

  fun fetch(id: UUID): Todo? = todoRepository.findByIdOrNull(id)

  @Transactional(isolation = REPEATABLE_READ)
  fun addCheckListItem(id: UUID, details: String, completed: Boolean): Todo {
    todoRepository.findByIdOrNull(id)?.let {
      val checklist: List<CheckItem> = it.checklist
      val item =
          checklist.find { item -> item.details == details }?.copy(completed = completed)
              ?: CheckItem(details, completed)

      return todoRepository.save(it.copy(checklist = checklist + item))
    } ?: throw RuntimeException()
  }

  fun completeCheckListItem(): Todo {
    TODO()
  }

  fun listTodos(q: String?): Page<Todo> =
      todoRepository.findAll(RSQLJPASupport.toSpecification(q), Pageable.ofSize(10))
}

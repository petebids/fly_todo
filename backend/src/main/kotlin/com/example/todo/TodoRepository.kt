package com.example.todo

import java.util.UUID
import org.springframework.data.jpa.repository.JpaSpecificationExecutor
import org.springframework.data.repository.CrudRepository
import org.springframework.data.repository.PagingAndSortingRepository

interface TodoRepository :
    CrudRepository<Todo, UUID>,
    PagingAndSortingRepository<Todo, UUID>,
    JpaSpecificationExecutor<Todo>

package com.example.todo

import jakarta.persistence.ElementCollection
import jakarta.persistence.Embeddable
import jakarta.persistence.Entity
import jakarta.persistence.Id
import java.util.UUID

@Entity
data class Todo(
    @Id val id: UUID,
    val name: String,
    val details: String?,
    val completed: Boolean = false,
    @ElementCollection val checklist: List<CheckItem>
)

@Embeddable data class CheckItem(val details: String, val completed: Boolean = false)

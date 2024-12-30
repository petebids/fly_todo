package com.example.todo

import java.util.UUID

data class Item(val details: String, val completed: Boolean)

data class TodoResource(val id: UUID, val name: String,  val completed: Boolean)

data class TodoResourceFull(
    val id: UUID,
    val name: String,
    val details: String?,
    val completed: Boolean,
    val checklistItems: Set<Item>
)

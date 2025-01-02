package com.example.todo

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import java.util.UUID
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT
import org.springframework.http.MediaType
import org.springframework.test.context.DynamicPropertyRegistry
import org.springframework.test.context.DynamicPropertySource
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.delete
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.post
import org.springframework.util.MultiValueMap
import org.testcontainers.containers.PostgreSQLContainer
import org.testcontainers.junit.jupiter.Container

@AutoConfigureMockMvc
@SpringBootTest(webEnvironment = RANDOM_PORT)
class TodoControllerTest {

  companion object {
    @Container
    val database: PostgreSQLContainer<*> =
        PostgreSQLContainer("postgres:latest").apply {
          this.withPassword("postgres").withUsername("postgres")
        }

    @DynamicPropertySource
    @JvmStatic
    fun registerDynamicProperties(registry: DynamicPropertyRegistry) {

      registry.add("spring.datasource.url", database::getJdbcUrl)
      registry.add("spring.datasource.username", database::getUsername)
      registry.add("spring.datasource.password", database::getPassword)
      registry.add("spring.datasource.driver-class-name", database::getDriverClassName)
      registry.add("spring.jpa.databasePlatform") { "org.hibernate.dialect.PostgreSQLDialect" }
    }

    @BeforeAll
    @JvmStatic
    fun start() {
      database.start()
    }
  }

  @Autowired lateinit var mockMvc: MockMvc
  private val objectMapper = jacksonObjectMapper()

  @Test
  fun `listing works `() {

    mockMvc
        .get("/v1/todos") {
          accept = MediaType.APPLICATION_JSON
          params = MultiValueMap.fromSingleValue(mapOf("q" to ""))
        }
        .andExpect {
          content { contentType(MediaType.APPLICATION_JSON) }
          status { isOk() }
          jsonPath("$.content") { isArray() }
          jsonPath("$.page.size") { equals(10) }
        }
  }

  @Test
  fun `creating works`() {

    val result =
        mockMvc
            .post("/v1/todos") {
              contentType = MediaType.APPLICATION_JSON
              content =
                  """
                  {"name" : "get milk and bread"}
              """
                      .trimIndent()
            }
            .andExpect {
              content { contentType(MediaType.APPLICATION_JSON) }
              status { isCreated() }
              jsonPath("$.name") { equals("get milk and bread") }
              jsonPath("$.id") { isNotEmpty() }
            }
            .andReturn()
    val testTodoResource = objectMapper.readValue<TestTodoResource>(result.response.contentAsString)

    mockMvc
        .get("/v1/todos/{id}", testTodoResource.id) { contentType = MediaType.APPLICATION_JSON }
        .andExpect { status { isOk() } }
  }

  @Test
  fun `fetching with a non UUID fails`() {
    mockMvc
        .get("/v1/todos/{id}", 123) { contentType = MediaType.APPLICATION_JSON }
        .andExpect {
          status { isBadRequest() }
          //          content { contentType(MediaType.APPLICATION_JSON) }
        }
  }

  @Test
  fun `fetching with a random UUID 404s`() {
    mockMvc
        .get("/v1/todos/{id}", UUID.randomUUID()) { contentType = MediaType.APPLICATION_JSON }
        .andExpect {
          status { isNotFound() }
          //          content { contentType(MediaType.APPLICATION_JSON) }
        }
  }

  @Test
  fun `delete works`() {

    mockMvc.delete("/v1/todos/{id}", UUID.randomUUID()).andExpect { status { isNoContent() } }
  }
}

data class TestTodoResource(val id: UUID, val name: String, val completed: Boolean)

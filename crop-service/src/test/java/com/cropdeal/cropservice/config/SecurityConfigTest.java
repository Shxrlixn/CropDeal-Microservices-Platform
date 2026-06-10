package com.cropdeal.cropservice.config;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = SecurityConfigTest.TestController.class)
@Import(SecurityConfig.class)
class SecurityConfigTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private SecurityFilterChain securityFilterChain;

    // ✅ Dummy controller to test access
    @RestController
    static class TestController {

        @GetMapping("/public")
        public String publicEndpoint() {
            return "OK";
        }
    }

    // ✅ Ensure bean loads (Sonar coverage)
    @Test
    void securityFilterChainShouldNotBeNull() {
        assertThat(securityFilterChain).isNotNull();
    }

    // ✅ All endpoints should be accessible (permitAll)
    @Test
    void shouldAllowAccessToPublicEndpoint() throws Exception {
        mockMvc.perform(get("/public"))
                .andExpect(status().isOk());
    }

    // ✅ Swagger endpoints should be accessible
    @Test
    void shouldAllowAccessToSwaggerEndpoints() throws Exception {

        mockMvc.perform(get("/swagger-ui/index.html"))
                .andExpect(status().isOk());

        mockMvc.perform(get("/v3/api-docs"))
                .andExpect(status().isOk());
    }
}
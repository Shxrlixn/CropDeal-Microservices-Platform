package com.cropdeal.apigateway.config;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;

import org.springframework.mock.http.server.reactive.MockServerHttpRequest;
import org.springframework.mock.web.server.MockServerWebExchange;

import org.springframework.test.util.ReflectionTestUtils;

import org.springframework.web.server.ServerWebExchange;

import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class JwtAuthenticationFilterTest {

    private JwtAuthenticationFilter jwtFilter;

    private GatewayFilterChain filterChain;

    private static final String SECRET =
            "mysecretkeymysecretkeymysecretkey12";

    @BeforeEach
    void setUp() {

        jwtFilter = new JwtAuthenticationFilter();

        ReflectionTestUtils.setField(
                jwtFilter,
                "secret",
                SECRET
        );

        filterChain = mock(GatewayFilterChain.class);

        when(filterChain.filter(any(ServerWebExchange.class)))
                .thenReturn(Mono.empty());
    }

    @Test
    void shouldAllowOptionsRequest() {

        MockServerHttpRequest request =
                MockServerHttpRequest
                        .options("/user/profile")
                        .build();

        ServerWebExchange exchange =
                MockServerWebExchange.from(request);

        jwtFilter.filter(exchange, filterChain)
                .block();

        verify(filterChain)
                .filter(exchange);
    }

    @ParameterizedTest
    @ValueSource(strings = {
            "/auth/login",
            "/swagger-ui/index.html",
            "/crop/all"
    })
    void shouldAllowPublicAndWhitelistedEndpoints(
            String path
    ) {

        MockServerHttpRequest request =
                MockServerHttpRequest
                        .get(path)
                        .build();

        ServerWebExchange exchange =
                MockServerWebExchange.from(request);

        jwtFilter.filter(exchange, filterChain)
                .block();

        verify(filterChain)
                .filter(exchange);

        reset(filterChain);

        when(filterChain.filter(any(ServerWebExchange.class)))
                .thenReturn(Mono.empty());
    }

    @Test
    void shouldRejectWhenAuthorizationHeaderMissing() {

        MockServerHttpRequest request =
                MockServerHttpRequest
                        .get("/user/profile")
                        .build();

        ServerWebExchange exchange =
                MockServerWebExchange.from(request);

        jwtFilter.filter(exchange, filterChain)
                .block();

        assertThat(
                exchange.getResponse().getStatusCode()
        ).isEqualTo(HttpStatus.UNAUTHORIZED);

        verify(filterChain, never())
                .filter(exchange);
    }

    @Test
    void shouldRejectInvalidToken() {

        MockServerHttpRequest request =
                MockServerHttpRequest
                        .get("/user/profile")
                        .header(
                                HttpHeaders.AUTHORIZATION,
                                "Bearer invalid-token"
                        )
                        .build();

        ServerWebExchange exchange =
                MockServerWebExchange.from(request);

        jwtFilter.filter(exchange, filterChain)
                .block();

        assertThat(
                exchange.getResponse().getStatusCode()
        ).isEqualTo(HttpStatus.UNAUTHORIZED);

        verify(filterChain, never())
                .filter(exchange);
    }

    @Test
    void shouldAllowValidToken() {

        Key key = Keys.hmacShaKeyFor(
                SECRET.getBytes(StandardCharsets.UTF_8)
        );

        String token = Jwts.builder()
                .setSubject("sherlien")
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(
                                System.currentTimeMillis()
                                        + 60000
                        )
                )
                .signWith(
                        key,
                        SignatureAlgorithm.HS256
                )
                .compact();

        MockServerHttpRequest request =
                MockServerHttpRequest
                        .get("/user/profile")
                        .header(
                                HttpHeaders.AUTHORIZATION,
                                "Bearer " + token
                        )
                        .build();

        ServerWebExchange exchange =
                MockServerWebExchange.from(request);

        jwtFilter.filter(exchange, filterChain)
                .block();

        verify(filterChain)
                .filter(exchange);
    }

    @Test
    void shouldReturnCorrectOrder() {

        int order = jwtFilter.getOrder();

        assertThat(order)
                .isEqualTo(-1);
    }
}
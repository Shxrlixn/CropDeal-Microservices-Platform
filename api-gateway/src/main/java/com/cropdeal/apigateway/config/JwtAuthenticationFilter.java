package com.cropdeal.apigateway.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import reactor.core.publisher.Mono;

import java.nio.charset.StandardCharsets;
import java.security.Key;

@Component
public class JwtAuthenticationFilter
        implements GlobalFilter, Ordered {

    private static final Logger logger =
            LoggerFactory.getLogger(
                    JwtAuthenticationFilter.class
            );

    @Value("${jwt.secret}")
    private String secret;

    private Key getKey() {

        return Keys.hmacShaKeyFor(
                secret.getBytes(StandardCharsets.UTF_8)
        );
    }

    @Override
    public Mono<Void> filter(
            ServerWebExchange exchange,
            GatewayFilterChain chain
    ) {

        String path =
                exchange.getRequest()
                        .getURI()
                        .getPath();

        logger.info("Incoming request path: {}", path);

        // Allow CORS preflight
        if (exchange.getRequest().getMethod()
                == HttpMethod.OPTIONS) {

            return chain.filter(exchange);
        }

        // Allow AUTH endpoints
        if (path.startsWith("/auth/")) {

            logger.info(
                    "Auth endpoint detected - JWT skipped"
            );

            return chain.filter(exchange);
        }

        // Allow Swagger + Eureka
        if (path.contains("/swagger")
                || path.contains("/v3/api-docs")
                || path.startsWith("/eureka")) {

            return chain.filter(exchange);
        }

        // Apply JWT only for user service
        if (!path.startsWith("/user/")) {

            logger.info(
                    "Public endpoint detected - JWT skipped: {}",
                    path
            );

            return chain.filter(exchange);
        }

        // JWT validation
        String authHeader =
                exchange.getRequest()
                        .getHeaders()
                        .getFirst(
                                HttpHeaders.AUTHORIZATION
                        );

        logger.info(
                "Authorization header received"
        );

        if (authHeader == null
                || !authHeader.startsWith("Bearer ")) {

            logger.error("Missing or invalid token");

            exchange.getResponse()
                    .setStatusCode(
                            HttpStatus.UNAUTHORIZED
                    );

            return exchange.getResponse()
                    .setComplete();
        }

        String token =
                authHeader.substring(7).trim();

        try {

            Claims claims =
                    Jwts.parserBuilder()
                            .setSigningKey(getKey())
                            .build()
                            .parseClaimsJws(token)
                            .getBody();

            logger.info(
                    "Authenticated user: {}",
                    claims.getSubject()
            );

        } catch (Exception exception) {

            logger.error(
                    "JWT validation failed: {}",
                    exception.getMessage()
            );

            exchange.getResponse()
                    .setStatusCode(
                            HttpStatus.UNAUTHORIZED
                    );

            return exchange.getResponse()
                    .setComplete();
        }

        return chain.filter(exchange);
    }

    @Override
    public int getOrder() {

        return -1;
    }
}
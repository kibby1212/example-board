package com.example.board.global.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.example.board.global.security.JwtFilter;

import org.springframework.http.HttpMethod;

import java.util.Arrays;

import lombok.RequiredArgsConstructor;



@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
	
	private final JwtFilter jwtFilter; // 추가

    // 1. 암호화 도구 등록 (UserService에서 사용)
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 2. 보안 규칙 설정
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // 1. 인증/인가 관련 (누구나)
                .requestMatchers("/api/auth/**").permitAll()
                
                // 2. 게시글 조회(GET) 및 등록(POST) - 누구나
                .requestMatchers(HttpMethod.GET, "/api/boards/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/boards").permitAll()
                
                // 3. ⭐ 비회원 게시글 삭제 (POST /api/boards/{id}/delete)
                .requestMatchers(HttpMethod.POST, "/api/boards/*/delete").permitAll()
                
                // 4. 댓글 조회 및 등록 - 누구나
                .requestMatchers(HttpMethod.GET, "/api/comments/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/comments/**").permitAll() 
                
                // 5. ⭐ 비회원 댓글 삭제 (POST /api/comments/{id}/delete)
                .requestMatchers(HttpMethod.POST, "/api/comments/*/delete").permitAll()
                
                //
                .requestMatchers(HttpMethod.PUT, "/api/boards/**").permitAll() 
                
                .requestMatchers(HttpMethod.POST, "/api/boards/*/delete").permitAll()

                // 6. 나머지는 로그인한 사람만 (회원 전용 수정/삭제 등)
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
            
        return http.build();
    }

    // 2. CORS 상세 규칙 설정
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        configuration.addAllowedOrigin("http://localhost:5173"); // 리액트 주소 허용
        configuration.addAllowedMethod("*"); // GET, POST, PUT, DELETE 모두 허용
        configuration.addAllowedHeader("*"); // 모든 헤더(Authorization 등) 허용
        configuration.setAllowCredentials(true); // 쿠키/인증 정보 허용

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
package com.example.board.util;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;

import org.springframework.security.core.userdetails.UserDetails; // ⭐ UserDetails의 정체
import com.example.board.util.PrincipalDetailsService;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final PrincipalDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 1. 헤더에서 Authorization 값을 꺼냅니다.
        String authHeader = request.getHeader("Authorization");

        // 2. Bearer 로 시작하는지 확인합니다.
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7); // "Bearer " 뒷부분인 토큰만 추출
            
            // 3. 토큰이 유효한지 JwtUtil로 검사합니다.
            if (jwtUtil.validateToken(token)) {
                String username = jwtUtil.extractUsername(token);
                
             // 단순 문자열 대신, DB에서 유저 정보를 조회해서 PrincipalDetails(UserDetails)를 가져옵니다.
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                
                // 바구니(Authentication)에 이름표 대신 '진짜 신분증(userDetails)'을 담습니다.
                UsernamePasswordAuthenticationToken authentication = 
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        // 5. 다음 필터로 넘깁니다.
        filterChain.doFilter(request, response);
    }
}
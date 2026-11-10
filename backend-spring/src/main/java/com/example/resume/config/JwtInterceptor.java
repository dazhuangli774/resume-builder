package com.example.resume.config;

import com.example.resume.utils.JwtUtil;
import org.springframework.web.servlet.HandlerInterceptor;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class JwtInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String token = request.getHeader("Authorization");
        if (token == null || token.isEmpty()) {
            response.setStatus(401);
            return false;
        }
        try {
            JwtUtil.getUserId(token); // 验证 token
            return true;
        } catch (Exception e) {
            response.setStatus(401);
            return false;
        }
    }
}
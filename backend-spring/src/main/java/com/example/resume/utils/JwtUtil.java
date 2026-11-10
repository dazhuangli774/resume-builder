package com.example.resume.utils;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import java.util.Date;

public class JwtUtil {

    /** 生产环境请通过环境变量 JWT_SECRET 注入，默认值仅供本地开发 */
    private static final String SECRET =
            System.getenv().getOrDefault("JWT_SECRET", "your_secret_key_123456");
    private static final long EXPIRE = 86400000L; // 24小时

    public static String generateToken(Integer userId) {
        return Jwts.builder()
                .claim("userId", userId)
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRE))
                .signWith(SignatureAlgorithm.HS256, SECRET)
                .compact();
    }

    public static Integer getUserId(String token) {
        return (Integer) Jwts.parser()
                .setSigningKey(SECRET)
                .parseClaimsJws(token)
                .getBody()
                .get("userId");
    }
}

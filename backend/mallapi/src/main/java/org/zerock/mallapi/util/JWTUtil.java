package org.zerock.mallapi.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

import lombok.extern.log4j.Log4j2;

import java.time.ZonedDateTime;
import java.util.Date;
import java.util.Map;

import javax.crypto.SecretKey;

@Log4j2
public class JWTUtil {

    // 🔑 JWT 서명용 비밀키 (HMAC-SHA)
    private static final String key =
            "1234567890123456789012345678901234567890";

    // ======================
    // JWT 생성
    // ======================
    public static String generateToken(Map<String, Object> valueMap, int min) {

        SecretKey secretKey;

        try {
            secretKey = Keys.hmacShaKeyFor(key.getBytes("UTF-8"));
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage());
        }

        String jwtStr = Jwts.builder()
                .setHeader(Map.of("typ", "JWT"))
                .setClaims(valueMap)
                .setIssuedAt(Date.from(ZonedDateTime.now().toInstant()))
                .setExpiration(
                        Date.from(
                                ZonedDateTime.now()
                                        .plusMinutes(min)
                                        .toInstant()
                        )
                )
                .signWith(secretKey)
                .compact();

        return jwtStr;
    }

    // ======================
    // JWT 검증
    // ======================
    public static Map<String, Object> validateToken(String token) {

        Map<String, Object> claims;

        try {
            SecretKey secretKey =
                    Keys.hmacShaKeyFor(key.getBytes("UTF-8"));

            claims = Jwts.parserBuilder()
                    .setSigningKey(secretKey)
                    .build()
                    .parseClaimsJws(token)   // 검증 + 파싱
                    .getBody();

        } catch (MalformedJwtException e) {
            throw new CustomJWTException("MalFormed");

        } catch (ExpiredJwtException e) {
            throw new CustomJWTException("Expired");

        } catch (InvalidClaimException e) {
            throw new CustomJWTException("Invalid");

        } catch (JwtException e) {
            throw new CustomJWTException("JWTError");

        } catch (Exception e) {
            throw new CustomJWTException("Error");
        }

        return claims;
    }
}

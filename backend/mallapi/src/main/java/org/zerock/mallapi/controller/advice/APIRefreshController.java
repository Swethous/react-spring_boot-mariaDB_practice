package org.zerock.mallapi.controller.advice;

import java.util.Date;
import java.util.Map;

import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.zerock.mallapi.util.CustomJWTException;
import org.zerock.mallapi.util.JWTUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@RestController
@RequiredArgsConstructor
@Log4j2
public class APIRefreshController {

    @RequestMapping("/api/member/refresh")
    public Map<String, Object> refresh(
            @RequestHeader("Authorization") String authHeader,
            String refreshToken
    ) {

        if (refreshToken == null) {
            throw new CustomJWTException("NULL_REFRESH");
        }

        if (authHeader == null || authHeader.length() < 7) {
            throw new CustomJWTException("INVALID_STRING");
        }

        String accessToken = authHeader.substring(7);

        // Access Token 이 아직 만료되지 않았다면 그대로 반환
        if (!checkExpiredToken(accessToken)) {
            return Map.of(
                    "accessToken", accessToken,
                    "refreshToken", refreshToken
            );
        }

        // Refresh Token 검증
        Map<String, Object> claims = JWTUtil.validateToken(refreshToken);
        log.info("refresh... claims: {}", claims);

        // 새 Access Token 발급
        String newAccessToken = JWTUtil.generateToken(claims, 10);

        // Refresh Token 만료 시간이 1시간 미만이면 새로 발급
        String newRefreshToken =
                checkTime((Integer) claims.get("exp"))
                        ? JWTUtil.generateToken(claims, 60 * 24)
                        : refreshToken;

        return Map.of(
                "accessToken", newAccessToken,
                "refreshToken", newRefreshToken
        );
    }

    // refresh token 만료 시간이 1시간 미만인지 체크
    private boolean checkTime(Integer exp) {

        Date expDate = new Date((long) exp * 1000);
        long gap = expDate.getTime() - System.currentTimeMillis();
        long leftMin = gap / (1000 * 60);

        return leftMin < 60;
    }

    // Access Token 만료 여부 확인
    private boolean checkExpiredToken(String token) {

        try {
            JWTUtil.validateToken(token);
        } catch (CustomJWTException ex) {
            if (ex.getMessage().equals("Expired")) {
                return true;
            }
        }
        return false;
    }
}

package org.zerock.mallapi.security.handler;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.zerock.mallapi.dto.MemberDTO;
import org.zerock.mallapi.util.JWTUtil;

import com.google.gson.Gson;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.extern.log4j.Log4j2;

@Log4j2
public class APILoginSuccessHandler implements AuthenticationSuccessHandler {

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {

        log.info("---- login success ----");
        log.info(authentication);
        log.info("----");

        // 인증된 사용자 정보 꺼내기
        MemberDTO memberDTO = (MemberDTO) authentication.getPrincipal();

        // JWT에 담을 claims 생성
        Map<String, Object> claims = memberDTO.getClaims();

        // Access / Refresh Token 발급
        String accessToken = JWTUtil.generateToken(claims, 10);        // 10분
        String refreshToken = JWTUtil.generateToken(claims, 60 * 24); // 24시간

        claims.put("accessToken", accessToken);
        claims.put("refreshToken", refreshToken);

        // JSON 응답 생성
        Gson gson = new Gson();
        String jsonStr = gson.toJson(claims);

        response.setStatus(HttpServletResponse.SC_OK);
        response.setContentType("application/json; charset=UTF-8");

        PrintWriter printWriter = response.getWriter();
        printWriter.println(jsonStr);
        printWriter.flush();
        printWriter.close();
    }

}

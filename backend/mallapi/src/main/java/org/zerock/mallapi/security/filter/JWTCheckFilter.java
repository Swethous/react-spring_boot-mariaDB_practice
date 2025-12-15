package org.zerock.mallapi.security.filter;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.Map;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import org.zerock.mallapi.dto.MemberDTO;
import org.zerock.mallapi.util.JWTUtil;

import com.google.gson.Gson;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.extern.log4j.Log4j2;

@Log4j2
public class JWTCheckFilter extends OncePerRequestFilter {

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request)
            throws ServletException {

        // 1️⃣ Preflight 요청(OPTIONS)은 JWT 체크 안 함
        if (request.getMethod().equals("OPTIONS")) {
            return true;
        }

        String path = request.getRequestURI();
        log.info("check uri........ {}", path);

        // 2️⃣ 로그인 / 회원 관련 API는 JWT 체크 안 함
        if (path.startsWith("/api/member/")) {
            return true;
        }

        // 3️⃣ 이미지 조회 API는 JWT 체크 안 함
        if (path.startsWith("/api/products/view/")) {
            return true;
        }

        // 그 외 요청은 JWT 체크 대상
        return false;
    }


    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        log.info("---- JWTCheckFilter ----");

        String authHeaderStr = request.getHeader("Authorization");
        try {
            // Authorization: Bearer accessToken
            String accessToken = authHeaderStr.substring(7);

            Map<String, Object> claims = JWTUtil.validateToken(accessToken);
            log.info("JWT claims: {}", claims);

            // claims 에서 사용자 정보 추출
            String email = (String) claims.get("email");
            String pw = (String) claims.get("pw");   // ⚠️ 보안상 권장 X (아래 설명)
            String nickname = (String) claims.get("nickname");
            Boolean social = (Boolean) claims.get("social");
            List<String> roleNames = (List<String>) claims.get("roleNames");

            // MemberDTO 재구성
            MemberDTO memberDTO = new MemberDTO(
                    email,
                    pw,
                    nickname,
                    social.booleanValue(),
                    roleNames
            );

            log.info("memberDTO: {}", memberDTO);
            log.info("authorities: {}", memberDTO.getAuthorities());

            // Authentication 객체 생성
            UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(
                            memberDTO,
                            pw,
                            memberDTO.getAuthorities()
                    );

            // SecurityContext 에 인증 정보 저장
            SecurityContextHolder.getContext()
                    .setAuthentication(authenticationToken);

            // 다음 필터/컨트롤러로 진행
            filterChain.doFilter(request, response);

        } catch (Exception e) {

            log.error("JWT Check Error");
            log.error(e.getMessage());

            Gson gson = new Gson();
            String msg = gson.toJson(
                    Map.of("error", "ERROR_ACCESS_TOKEN")
            );

            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json; charset=UTF-8");

            PrintWriter printWriter = response.getWriter();
            printWriter.println(msg);
            printWriter.close();
        }
    }


}

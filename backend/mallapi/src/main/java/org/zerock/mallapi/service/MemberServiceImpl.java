package org.zerock.mallapi.service;

import java.util.LinkedHashMap;
import java.util.Optional;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

import org.zerock.mallapi.domain.Member;
import org.zerock.mallapi.domain.MemberRole;
import org.zerock.mallapi.dto.MemberDTO;
import org.zerock.mallapi.repository.MemberRepository;

@Service
@RequiredArgsConstructor
@Log4j2
public class MemberServiceImpl implements MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public MemberDTO getKakaoMember(String accessToken) {

        String email = getEmailFromKakaoAccessToken(accessToken);
        log.info("email: " + email);

        Optional<Member> result = memberRepository.findById(email);

        if(result.isPresent()){
            MemberDTO memberDTO = entityToDTO(result.get());
            return memberDTO;
        }

        Member socialMember = makeSocialMember(email);
        memberRepository.save(socialMember);

        MemberDTO memberDTO = entityToDTO(socialMember);

        return memberDTO;
    }

    private String getEmailFromKakaoAccessToken(String accessToken) {

        String kakaoGetUserURL = "https://kapi.kakao.com/v2/user/me";

        if (accessToken == null) {
            throw new RuntimeException("Access Token is null");
        }

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);
        headers.add("Content-Type", "application/x-www-form-urlencoded");

        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<LinkedHashMap> response =
                restTemplate.exchange(
                        UriComponentsBuilder
                                .fromUriString(kakaoGetUserURL)
                                .build()
                                .toUriString(),
                        HttpMethod.GET,
                        entity,
                        LinkedHashMap.class
                );

        log.info("Kakao Response: " + response);

        LinkedHashMap<String, Object> bodyMap = response.getBody();
        log.info("BodyMap: " + bodyMap);

        LinkedHashMap<String, Object> kakaoAccount =
                (LinkedHashMap<String, Object>) bodyMap.get("kakao_account");

        log.info("kakaoAccount: " + kakaoAccount);

        return (String) kakaoAccount.get("email");
    }


    private String makeTempPassword() {
        StringBuffer buffer = new StringBuffer();

        for(int i=0; i<10; i++) {
            
            buffer.append((char) ((int)(Math.random()*55) +65));
        }
        return buffer.toString();
    }
    private Member makeSocialMember(String email) {

        String tempPassword = makeTempPassword();
        log.info("tempPassword: " + tempPassword);

        String nickname = "소셜회원";

        Member member = Member.builder()
                .email(email)
                .pw(passwordEncoder.encode(tempPassword))
                .nickname(nickname)
                .social(true)
                .build();

        member.addRole(MemberRole.USER);

        return member;
    }

}

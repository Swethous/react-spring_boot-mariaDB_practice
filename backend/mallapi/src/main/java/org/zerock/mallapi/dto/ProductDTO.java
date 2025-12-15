package org.zerock.mallapi.dto;

import java.util.List;
import java.util.ArrayList;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductDTO {

    private Long pno;
    private String pname;
    private int price;
    private String pdesc;
    private boolean delFlag;

    @Builder.Default // 실제 파일
    private List<MultipartFile> files = new ArrayList<>();

    @Builder.Default // 파일이름처리
    private List<String> uploadFileNames = new ArrayList<>();
}

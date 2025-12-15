package org.zerock.mallapi.service;

import lombok.extern.log4j.Log4j2;

import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import org.zerock.mallapi.dto.PageRequestDTO;
import org.zerock.mallapi.dto.PageResponseDTO;
import org.zerock.mallapi.dto.ProductDTO;

@SpringBootTest
@Log4j2
public class ProductServiceTests {

    @Autowired
    private ProductService productService;

    @Test
    public void testList() {

        // 1 page, 10 size (기본값)
        PageRequestDTO pageRequestDTO = PageRequestDTO.builder().build();

        PageResponseDTO<ProductDTO> result =
                productService.getList(pageRequestDTO);

        result.getDtoList().forEach(dto -> log.info(dto));
    }
    @Test
    public void testRegister() {

        ProductDTO productDTO = ProductDTO.builder()
                .pname("새로운 상품")
                .pdesc("신규 추가 상품입니다.")
                .price(1000)
                .build();

        // UUID 포함한 파일명 생성
        productDTO.setUploadFileNames(
                List.of(
                        UUID.randomUUID() + "_Test1.jpg",
                        UUID.randomUUID() + "_Test2.jpg"
                )
        );

        productService.register(productDTO);
    }

}

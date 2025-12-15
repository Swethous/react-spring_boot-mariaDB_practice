package org.zerock.mallapi.repository;

import lombok.extern.log4j.Log4j2;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.test.annotation.Commit;
import org.zerock.mallapi.domain.Product;

import jakarta.transaction.Transactional;

import java.util.Arrays;
import java.util.UUID;

@SpringBootTest
@Log4j2
public class ProductRepositoryTests {

    @Autowired
    private ProductRepository productRepository;

    @Test
    public void testInsert() {

        for (int i = 0; i < 10; i++) {

            Product product = Product.builder()
                    .pname("상품" + i)
                    .price(100 * i)
                    .pdesc("상품설명 " + i)
                    .build();

            // 1 / 2개의 이미지 파일 추가
            product.addImageString(UUID.randomUUID().toString() + "_IMAGE1.jpg");
            product.addImageString(UUID.randomUUID().toString() + "_IMAGE2.jpg");

            productRepository.save(product);

            log.info("Saved Product: {}", product.getPno());
        }
    }

    @Transactional  // product테이블에 접근 한번, 이미지가 있으면 이미지 테이블에 접근 다시. 그래서 2번접근하게 되므로 트랜젝션 필요
    @Test
    public void testRead() {
        Long pno = 1L;
        java.util.Optional<Product> result = productRepository.findById(pno);

        Product product = result.orElseThrow();

        log.info(product);
        log.info(product.getImageList());
    }
    @Test
    public void testRead2() {
        Long pno = 1L;
        java.util.Optional<Product> result = productRepository.selectOne(pno);

        Product product = result.orElseThrow();

        log.info(product);
        log.info(product.getImageList());
    }

    @Commit
    @Transactional
    @Test
    public void testDelete() {
        Long pno =2L;
        productRepository.updateToDelete(pno, true);
    }
    @Test
    public void testUpdate() {

        Long pno = 10L;

        // 기존 상품 조회 (imageList까지 로딩)
        Product product = productRepository.selectOne(pno).get();

        // 기본 정보 수정
        product.changeName("10번 상품");
        product.changeDesc("10번 상품 설명입니다.");
        product.changePrice(5000);

        // 첨부파일 수정
        product.clearList();
        product.addImageString(UUID.randomUUID().toString() + "_" + "NEWIMAGE1.jpg");
        product.addImageString(UUID.randomUUID().toString() + "_" + "NEWIMAGE2.jpg");
        product.addImageString(UUID.randomUUID().toString() + "_" + "NEWIMAGE3.jpg");

        // 저장 (update)
        productRepository.save(product);
    }
    @Test
    public void testList() {
        Pageable pageable = PageRequest.of(0,10,Sort.by("pno").descending());

        Page<Object[]> result = productRepository.selectList(pageable);

        result.getContent().forEach(arr -> log.info(Arrays.toString(arr)));
    }

}

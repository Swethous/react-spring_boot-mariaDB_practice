package org.zerock.mallapi.domain;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

import lombok.*;

@Entity
@Table(name = "tbl_product")
@Getter
@ToString(exclude = "imageList")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long pno;
    private String pname;
    private int price;
    private String pdesc;
    private boolean delFlag;

    // 값 타입 컬렉션
    @ElementCollection
    @Builder.Default
    private List<ProductImage> imageList = new ArrayList<>();


    // ===== 비즈니스 로직 =====

    public void changePrice(int price) {
        this.price = price;
    }

    public void changeDesc(String desc) {
        this.pdesc = desc;
    }

    public void changeName(String name) {
        this.pname = name;
    }


    // 이미지 추가 (순서 자동 지정)
    public void addImage(ProductImage image) {
        image.setOrd(this.imageList.size()); // 다음 순서로 자동 설정
        this.imageList.add(image);
    }

    // 파일명만 받아서 바로 ProductImage 생성 + 추가
    public void addImageString(String fileName) {
        ProductImage productImage = ProductImage.builder()
                .fileName(fileName)
                .build();
        this.addImage(productImage);
    }

    // 이미지 전체 삭제
    public void clearList() {
        this.imageList.clear();
    }

    public void changeDel(boolean delFlag){
        this.delFlag = delFlag;
    }
}

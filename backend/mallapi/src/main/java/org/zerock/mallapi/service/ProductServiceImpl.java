package org.zerock.mallapi.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.zerock.mallapi.domain.Product;
import org.zerock.mallapi.domain.ProductImage;
import org.zerock.mallapi.dto.PageRequestDTO;
import org.zerock.mallapi.dto.PageResponseDTO;
import org.zerock.mallapi.dto.ProductDTO;
import org.zerock.mallapi.repository.ProductRepository;
import org.zerock.mallapi.service.mapper.ProductMapper;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Log4j2
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    @Override
    public PageResponseDTO<ProductDTO> getList(PageRequestDTO pageRequestDTO) {

        log.info("getList...");

        Pageable pageable = PageRequest.of(
                pageRequestDTO.getPage() - 1,   // Page는 0부터 시작
                pageRequestDTO.getSize(),
                Sort.by("pno").descending()
        );

        Page<Object[]> result = productRepository.selectList(pageable);

        List<ProductDTO> dtoList = result.get()
                .map(arr -> {

                    Product product = (Product) arr[0];
                    ProductImage productImage = (ProductImage) arr[1];

                    ProductDTO productDTO = ProductDTO.builder()
                            .pno(product.getPno())
                            .pname(product.getPname())
                            .pdesc(product.getPdesc())
                            .price(product.getPrice())
                            .build();

                    String imageStr = productImage.getFileName();
                    productDTO.setUploadFileNames(List.of(imageStr));

                    return productDTO;
                })
                .collect(Collectors.toList());

        long totalCount = result.getTotalElements();

        return PageResponseDTO.<ProductDTO>withAll()
                .dtoList(dtoList)
                .totalCount(totalCount)
                .pageRequestDTO(pageRequestDTO)
                .build();
    }
    @Override
    public Long register(ProductDTO dto) {

        // DTO → ENTITY 자동 변환
        Product product = productMapper.toEntity(dto);

        // 이미지 스트링 리스트가 있다면 엔티티에 추가
        if (dto.getUploadFileNames() != null) {
            dto.getUploadFileNames().forEach(product::addImageString);
        }

        // 저장
        Product saved = productRepository.save(product);

        return saved.getPno();
    }

    @Override
    public ProductDTO get(Long pno){
        java.util.Optional<Product> result = productRepository.selectOne(pno);

        Product product = result.orElseThrow();

        ProductDTO dto = productMapper.toDTO(product);

        List<ProductImage> imageList = product.getImageList();

        if(imageList != null && !imageList.isEmpty()){
                List<String> fileNameList = imageList.stream()
                                .map(ProductImage::getFileName)
                                .toList();
                dto.setUploadFileNames(fileNameList);
        }

        return dto;
    }
    @Override
    public void modify(ProductDTO dto) {
        //step 1 read
        java.util.Optional<Product> result = productRepository.findById(dto.getPno());

        Product product = result.orElseThrow();

        // 2) 기본 필드 수정
        product.changeName(dto.getPname());
        product.changeDesc(dto.getPdesc());
        product.changePrice(dto.getPrice());


        //clear
        product.clearList();

        List<String> uploadFileNames = dto.getUploadFileNames();

        if( uploadFileNames != null && !uploadFileNames.isEmpty()) {
                uploadFileNames.stream().forEach(uploadName -> {
                        product.addImageString(uploadName);
                });
        }
        productRepository.save(product);
    }
    @Override
    public void remove(Long pno) {
        productRepository.updateToDelete(pno, true);
    }
}

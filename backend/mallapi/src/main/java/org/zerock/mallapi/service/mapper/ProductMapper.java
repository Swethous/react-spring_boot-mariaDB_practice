package org.zerock.mallapi.service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.zerock.mallapi.domain.Product;
import org.zerock.mallapi.dto.ProductDTO;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    // DTO → Entity 매핑 (imageList는 서비스에서 따로 처리)
    @Mapping(target = "imageList", ignore = true)
    Product toEntity(ProductDTO dto);

    // Entity → DTO (반환할 때 필요하다면 사용)
    ProductDTO toDTO(Product product);
}

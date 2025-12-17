package org.zerock.mallapi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.zerock.mallapi.domain.CartItem;
import org.zerock.mallapi.dto.CartItemListDTO;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    // 1️⃣ 이메일로 장바구니 아이템 DTO 조회
    @Query("""
        select new org.zerock.mallapi.dto.CartItemListDTO(
            ci.cino,
            ci.qty,
            p.pno,
            p.pname,
            p.price,
            pi.fileName
        )
        from CartItem ci
        join ci.cart c
        join ci.product p
        left join p.imageList pi
        where c.owner.email = :email
          and pi.ord = 0
        order by ci.cino desc
    """)
    List<CartItemListDTO> getItemsOfCartDTOByEmail(@Param("email") String email);


    // 2️⃣ 특정 회원의 장바구니에서 특정 상품 조회
    @Query("""
        select ci
        from CartItem ci
        join ci.cart c
        where c.owner.email = :email
          and ci.product.pno = :pno
    """)
    CartItem getItemOfPno(
        @Param("email") String email,
        @Param("pno") Long pno
    );


    // 3️⃣ CartItem(cino)로 Cart 번호 조회
    @Query("""
        select c.cno
        from Cart c
        join CartItem ci on ci.cart = c
        where ci.cino = :cino
    """)
    Long getCartFromItem(@Param("cino") Long cino);


    // 4️⃣ cart 번호로 장바구니 아이템 DTO 조회
    @Query("""
        select new org.zerock.mallapi.dto.CartItemListDTO(
            ci.cino,
            ci.qty,
            p.pno,
            p.pname,
            p.price,
            pi.fileName
        )
        from CartItem ci
        join ci.cart c
        join ci.product p
        left join p.imageList pi
        where c.cno = :cno
          and pi.ord = 0
        order by ci.cino desc
    """)
    List<CartItemListDTO> getItemsOfCartDTOByCart(@Param("cno") Long cno);
}

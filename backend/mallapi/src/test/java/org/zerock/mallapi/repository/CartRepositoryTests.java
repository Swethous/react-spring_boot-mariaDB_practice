package org.zerock.mallapi.repository;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.Commit;

import org.zerock.mallapi.domain.Cart;
import org.zerock.mallapi.domain.CartItem;
import org.zerock.mallapi.domain.Member;
import org.zerock.mallapi.domain.Product;
import org.zerock.mallapi.dto.CartItemListDTO;

import jakarta.transaction.Transactional;
import lombok.extern.log4j.Log4j2;

@SpringBootTest
@Log4j2
public class CartRepositoryTests {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Transactional
    @Commit
    @Test
    public void testInsertByProduct() {

        log.info("testInsertByProduct");

        // 사용자가 전송하는 정보
        String email = "user1@aaa.com";
        Long pno = 5L;
        int qty = 1;

        // 1️⃣ 기존 장바구니 아이템 존재 여부 확인
        CartItem cartItem = cartItemRepository.getItemOfPno(email, pno);

        if (cartItem != null) {
            cartItem.changeQty(qty);
            cartItemRepository.save(cartItem);
            return;
        }

        // 2️⃣ 장바구니 존재 여부 확인
        Optional<Cart> result = cartRepository.getCartOfMember(email);

        Cart cart;

        // 장바구니가 없다면 새로 생성
        if (result.isEmpty()) {
            log.info("Member cart does not exist. Creating new cart.");

            Member member = Member.builder()
                    .email(email)
                    .build();

            Cart tempCart = Cart.builder()
                    .owner(member)
                    .build();

            cart = cartRepository.save(tempCart);
        } else {
            cart = result.get();
        }

        log.info("Cart: {}", cart);

        // 3️⃣ 새 CartItem 생성
        Product product = Product.builder()
                .pno(pno)
                .build();

        cartItem = CartItem.builder()
                .product(product)
                .cart(cart)
                .qty(qty)
                .build();

        // 4️⃣ 저장
        cartItemRepository.save(cartItem);
    }
    @Test
    @Commit
    public void testUpdateByCino() {

        Long cino = 1L;
        int qty = 4;

        Optional<CartItem> result = cartItemRepository.findById(cino);

        CartItem cartItem = result.orElseThrow();

        cartItem.changeQty(qty);

        cartItemRepository.save(cartItem);
    }
    @Test
    public void testListOfMember() {
        String email = "user1@aaa.com";
        List<CartItemListDTO> CartItemList = cartItemRepository.getItemsOfCartDTOByEmail(email);
        for (CartItemListDTO dto : CartItemList) {
            log.info(dto);
        }
    }
    @Test
    public void testDeleteThenList() {
        Long cino = 1L;

        Long cno = cartItemRepository.getCartFromItem(cino);
        List<CartItemListDTO> cartItemList = cartItemRepository.getItemsOfCartDTOByCart(cno);
        for(CartItemListDTO dto : cartItemList) {
            log.info(dto);
        }
    }

}

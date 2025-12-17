package org.zerock.mallapi.dto;

import lombok.Data;

@Data
public class CartItemDTO {
    private String email;
    private Long pno; // product number
    private int qty;
    private Long cino;  //cartitemnumber
    
}

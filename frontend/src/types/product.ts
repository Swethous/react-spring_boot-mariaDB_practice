// src/types/product.ts

export interface Product {
  pno: number;
  pname: string;
  price: number;
  pdesc: string;
  delFlag: boolean;

  uploadFileNames: string[]; // 서버에서 내려주는 파일명(UUID)
}

export interface PageParam {
  page: number;
  size: number;
}
// src/types/cart.ts

/** ===== Response (서버 → 프론트) ===== */
export interface CartItem {
  cino: number;
  pno: number;
  pname: string;
  price: number;
  qty: number;
  imageFile: string;
}

/** ===== Request (프론트 → 서버) ===== */
export type ChangeCartRequest = {
  email: string;
  cino?: number;
  pno: number;
  qty: number;
};

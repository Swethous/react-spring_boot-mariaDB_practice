// src/types/common.ts
export interface PageResponse<T> {
  dtoList: T[];
  pageNumList: number[];
  pageRequestDTO: any;   // 필요하면 나중에 구체화
  prev: boolean;
  next: boolean;
  totalCount: number;
  prevPage: number;
  nextPage: number;
  totalPage: number;
  current: number;
}

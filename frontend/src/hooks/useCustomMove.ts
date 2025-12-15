// src/hooks/useCustomMove.ts
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { useState } from "react";

type MovePageParam = {
  page?: number;
  size?: number;
};

const getNum = (value: string | null, defaultValue: number): number => {
  if (value === null) return defaultValue;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? defaultValue : parsed;
};

export const useCustomMove = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [refresh, setRefresh] = useState(false)

  // 🔹 URL의 ?page=, ?size= 를 숫자로 읽어오기
  const page = getNum(searchParams.get("page"), 1);
  const size = getNum(searchParams.get("size"), 10);

  // 🔹 리스트로 이동 (페이지 버튼에서 호출)
  const moveToList = (pageParam?: MovePageParam) => {
    const nextPage = pageParam?.page ?? page; // 인자가 있으면 그거, 없으면 현재 page
    const nextSize = pageParam?.size ?? size;

    const queryStr = createSearchParams({
      page: String(nextPage),
      size: String(nextSize),
    }).toString();

    // /todo/list?page=2&size=10 이런 식으로 이동
    navigate(`/todo/list?${queryStr}`);
    // 또는 객체형:
    // navigate({ pathname: "/todo/list", search: `?${queryStr}` });
    setRefresh(!refresh)
  };
  const moveToProductList = (pageParam?: MovePageParam) => {
    const nextPage = pageParam?.page ?? page; // 인자가 있으면 그거, 없으면 현재 page
    const nextSize = pageParam?.size ?? size;

    const queryStr = createSearchParams({
      page: String(nextPage),
      size: String(nextSize),
    }).toString();

    // /todo/list?page=2&size=10 이런 식으로 이동
    navigate(`/products/list?${queryStr}`);
    // 또는 객체형:
    // navigate({ pathname: "/todo/list", search: `?${queryStr}` });
    setRefresh(!refresh)
  };

  // 🔹 수정 페이지로 이동
  const moveToModify = (tno: string) => {
    const queryStr = createSearchParams({
      page: String(page),
      size: String(size),
    }).toString();

    navigate(`/todo/modify/${tno}?${queryStr}`);
  };
  const moveToProductModify = (pno: number) => {
    const queryStr = createSearchParams({
      page: String(page),
      size: String(size),
    }).toString();

    navigate(`/products/modify/${pno}?${queryStr}`);
  };

  // 🔹 읽기 페이지로 이동
  const moveToRead = (tno: number) => {


    navigate(`/todo/read/${tno}`);
  };

    const moveToProductRead = (pno: number) => {
    navigate(`/products/read/${pno}`);
  };

  return { moveToList, moveToModify,moveToProductList, moveToRead,moveToProductRead,moveToProductModify, page, size, refresh };
};

export default useCustomMove;

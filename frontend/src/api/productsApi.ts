import { apiClient } from "./client";
import type { PageParam, Product } from "../types/product";
import jwtAxios from "../util/jwtUtil";

export const postAdd = async (formData: FormData) => {
  const res = await jwtAxios.post("/products/", formData);
  return res.data;
};

export const getList = async ( pageParam: PageParam ) => {
  const { page, size } = pageParam;

  const res = await jwtAxios.get("/products/list", {
    params: {
      page,
      size,
    },
  });

  return res.data;
};


export const getOne = async (pno: number) => {
  const res = await jwtAxios.get(`/products/${pno}`);
  return res.data;
};

export const deleteOne = async (pno:number) => {
  const res = await jwtAxios.delete(`/products/${pno}`)
  return res.data
}

export const putOne = async (pno: number, formData:FormData) => {
  const header = {headers: {"Content-Type": "multipart/form-data"}}
  const res = await jwtAxios.put(`/products/${pno}`, formData, header)
  return res.data
}
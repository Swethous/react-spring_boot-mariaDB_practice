import { apiClient } from "./client";
import type { PageParam, Product } from "../types/product";

export const postAdd = async (formData: FormData) => {
  const res = await apiClient.post("/products/", formData);
  return res.data;
};

export const getList = async ( pageParam: PageParam ) => {
  const { page, size } = pageParam;

  const res = await apiClient.get("/products/list", {
    params: {
      page,
      size,
    },
  });

  return res.data;
};


export const getOne = async (pno: number) => {
  const res = await apiClient.get(`/products/${pno}`);
  return res.data;
};

export const deleteOne = async (pno:number) => {
  const res = await apiClient.delete(`/products/${pno}`)
  return res.data
}

export const putOne = async (pno: number, formData:FormData) => {
  const header = {headers: {"Content-Type": "multipart/form-data"}}
  const res = await apiClient.put(`/products/${pno}`, formData, header)
  return res.data
}
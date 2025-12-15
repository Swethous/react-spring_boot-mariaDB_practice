import { apiClient } from "./client";
import type { TodoType, TodoAddType, GetListParams } from "../types/todo";


export const getOne = async (tno: number) => {
  const res = await apiClient.get(`/todo/${tno}`);
  return res.data;
};

export const getList = async ({ page, size }: GetListParams) => {
  const res = await apiClient.get(`/todo/list`, {
    params: { page, size },
  });
  return res.data;
};

export const postAdd = async(todoObj: TodoAddType) => {
  const res = await apiClient.post(`/todo/`, todoObj)
  return res.data
}

export const deleteOne = async (tno:number) => {
  const res = await apiClient.delete(`/todo/${tno}`)
  return res.data
}

export const putOne = async (todo:TodoType) => {
  const res = await apiClient.put(`/todo/${todo.tno}`, todo)
  return res.data
}
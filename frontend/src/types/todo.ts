// src/types/todo.ts

export type TodoType = {
  tno: number;
  title: string;
  writer: string;
  dueDate: string | null;
  complete: boolean;
};

export type TodoAddType = {
  title: string;
  writer: string;
  dueDate: string;
};

export type TodoModifyType = {
  tno: number;
  title: string;
  writer: string;
  dueDate: string;
  complete: boolean;
};

export type GetListParams = {
  page: number;
  size: number;
};

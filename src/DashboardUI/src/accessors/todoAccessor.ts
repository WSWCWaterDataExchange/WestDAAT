import axios from "axios";
import { Todo } from "../data-contracts/todo";

export const getTodos = async () => {
  const { data } = await axios.get<Todo[]>(
    `${process.env.REACT_APP_WEBAPI_URL}todo/findalltodos`
  );
  return data;
};
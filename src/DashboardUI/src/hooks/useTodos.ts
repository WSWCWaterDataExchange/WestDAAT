import { useQuery } from "react-query";
import { getTodos } from "../accessors/todoAccessor";

export default function useTodos() {
  return useQuery("todos", getTodos);
}

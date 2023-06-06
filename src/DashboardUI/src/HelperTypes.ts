import { useQuery } from "react-query";

export type Optional<T, K extends keyof T> = Partial<T> & Omit<T, K>;

export type UseQueryOptionsParameter<TInput, TResult> = Parameters<typeof useQuery<TResult, unknown, TResult, (string | (TInput))[]>>[2]
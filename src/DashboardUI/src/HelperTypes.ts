import { useQuery } from 'react-query';

/**
 * Represents props that only contain children. Use this instead of `React.PropsWithChildren<{}>`,
 * which causes issues with ESLint.
 */
export type EmptyPropsWithChildren = {
  children: React.ReactNode | undefined;
};

export type Optional<T, K extends keyof T> = Partial<T> & Omit<T, K>;

export type UseQueryOptionsParameter<TInput, TResult> = Parameters<
  typeof useQuery<TResult, unknown, TResult, (string | TInput)[]>
>[2];

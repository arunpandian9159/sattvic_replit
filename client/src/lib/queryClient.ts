import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      queryFn: async ({ queryKey }) => {
        const url = queryKey[0] as string;
        try {
          const response = await fetch(url);
          if (!response.ok) {
            const error = new Error(`HTTP error! status: ${response.status}`) as any;
            error.status = response.status;
            error.statusText = response.statusText;
            throw error;
          }
          return response.json();
        } catch (error) {
          console.error('Query failed:', url, error);
          throw error;
        }
      },
    },
    mutations: {
      retry: false,
      onError: (error) => {
        console.error('Mutation failed:', error);
      },
    },
  },
});

// API request helper for mutations
export async function apiRequest(url: string, options?: RequestInit) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
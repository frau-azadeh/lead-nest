import { useMemo } from 'react';

export function usePagination<T>(items: T[], currentPage: number, itemsPerPage: number) {
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  }, [items, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(items.length / itemsPerPage);

  return { paginatedItems, totalPages };
}

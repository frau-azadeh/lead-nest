import React from 'react'
import Button from './Button'

interface PaginationProps{

  currentPage: number;
  totalPages: number;
  onPageChange: (page:number) => void;

}

const Pagination:React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if(totalPages<=1) return null;
  const pages = Array.from({ length: totalPages }, (_,i) => i+1);
  return (
    <div className="flex justify-center mt-8 gap-x-2">
  <Button
    disabled={currentPage === 1}
    onClick={() => onPageChange(currentPage - 1)}
    variant="outline"
  >
    قبلی
  </Button>

  {pages.map((page) => (
    <Button
      key={page}
      variant={page === currentPage ? 'primary' : 'secondary'}
      onClick={() => onPageChange(page)}
    >
      {page}
    </Button>
  ))}

  <Button
    disabled={currentPage === totalPages}
    onClick={() => onPageChange(currentPage + 1)}
    variant="outline"
  >
    بعدی
  </Button>
</div>

  )
}

export default Pagination
import { RightArrowIcon, LeftArrowIcon } from "@/assets"
import colors from "@/common/constants/tailwind-colors"

type PaginationProps = {
  color: string
  currentPage: number
  totalPages: number
  totalResults: number
  perPage: number
  limit: number
  onPageChange: (type: "prev" | "next" | number) => void
  onLimitChange: (newLimit: number) => void
}

export default function Pagination({
  color,
  currentPage,
  totalPages,
  totalResults,
  perPage,
  limit,
  onPageChange,
  onLimitChange,
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    if (totalPages <= 7) for (let i = 1; i <= totalPages; i++) pages.push(i)
    else {
      if (currentPage <= 4) pages.push(1, 2, 3, 4, 5, "...", totalPages)
      else if (currentPage >= totalPages - 3)
        pages.push(
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        )
      else pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages)
    }

    return pages
  }

  const start = (currentPage - 1) * perPage + 1
  const end = Math.min(currentPage * perPage, totalResults)

  return (
    <div className="mb-2 mt-[0.2rem] flex items-center justify-between rounded-[0.5rem] border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => onPageChange("prev")}
          disabled={currentPage === 1}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange("next")}
          disabled={currentPage === totalPages}
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div className="flex items-center">
          {/*<p className="text-sm text-gray-700">*/}
          {/*  Showing <span className="font-medium">{start}</span> to <span className="font-medium">{end}</span> of{' '}*/}
          {/*  <span className="font-medium">{totalResults}</span> results*/}
          {/*</p>*/}
          <div className="flex items-center justify-end">
            <label className="mr-2 text-sm text-shark-800">Rows per page:</label>
            <select
              value={limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
              className="rounded border border-shark-300 px-1 py-[0.2rem] text-sm"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>
        <div>
          <nav
            aria-label="Pagination"
            className="shadow-xs isolate inline-flex -space-x-px rounded-md"
          >
            <button
              onClick={() => onPageChange("prev")}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 disabled:opacity-50"
            >
              <img src={LeftArrowIcon} alt="left-arrow-icon" />
            </button>

            {getPageNumbers().map((page, index) =>
              page === "..." ? (
                <span
                  key={index}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0"
                >
                  ...
                </span>
              ) : (
                <button
                  key={index}
                  onClick={() => onPageChange(page as number)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 ${
                    currentPage === page ? "z-10 text-white" : "text-shark-600 hover:bg-shark-600"
                  }`}
                  style={{ background: currentPage === page ? color : colors.shark["50"] }}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() => onPageChange("next")}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 disabled:opacity-50"
            >
              <img src={RightArrowIcon} alt="right-arrow-icon" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  )
}

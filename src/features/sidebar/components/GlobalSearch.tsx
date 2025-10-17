import React, { useEffect, useRef, useState } from "react";
import { SearchIcon } from "@/assets";
import { dealService } from "@/features/invoice/services/dealApi";
import { useAuthStore } from "@/features/auth/stores/authStore";
import Modal from "@/common/components/modal/NewModal";
import GlobalSearchedData from "@/common/components/forms/GlobalSearchedData";
import { toast } from "react-toastify";
import { Deal, MakeReadyEntity } from "@/core/entities";
import { CustomerVisitEntity } from "@/core/entities/customer-visit";

const DEFAULT_CONFIG = {
  fetchData: dealService.getDealsBySearch,
  placeholder: "Deal#, Stock# or Customer",
};

const fetchDataByRole = async (
  query: string,
  companyId: string,
  role: string,
) => {
  const config = DEFAULT_CONFIG;
  return config.fetchData(query, companyId);
};

const placeHolderValue = (role: string): string => {
  const config = DEFAULT_CONFIG;
  return config.placeholder;
};

export default function GlobalSearch() {
  const companyId = useAuthStore(
    (state) => state.user?.companyId?.toString() ?? "",
  );
  const role = useAuthStore((state) => state.user?.role?.toString() ?? "");
  const [search, setSearch] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [data, setData] = useState<
    Deal[] | MakeReadyEntity[] | CustomerVisitEntity[]
  >([]);
  const placeholder = placeHolderValue(role);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFocused, setIsFocused] = useState(true);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;

    try {
      const result = await fetchDataByRole(search, companyId, role);

      if (result.length > 0) {
        setData(result);
        setIsOpen(true);
      } else toast.warn("No data found for the searched value.");
    } catch (err) {
      toast.error("Something went wrong while searching.");
    } finally {
      setSearch("");
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMouseLeave = () => {
    if (!isFocused) setIsExpanded(false);
  };

  return (
    <div
      ref={containerRef}
      className="ml-auto flex justify-end"
      onMouseLeave={handleMouseLeave}
    >
      <form onSubmit={handleSearch}>
        <div
          className={`flex items-center rounded-[0.25rem] border border-shark-200 bg-white px-3 py-2 transition-all duration-300 ${
            isExpanded ? "w-[16rem]" : "w-[8rem]"
          }`}
          style={{ transformOrigin: "right center" }}
        >
          <input
            ref={inputRef}
            type="text"
            className="min-w-0 flex-1 bg-transparent text-xs text-gray-500 outline-none placeholder:text-gray-400"
            placeholder={placeholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => {
              setIsExpanded(true);
              setIsFocused(true);
            }}
            onBlur={() => setIsFocused(false)}
          />
          <img
            src={`${SearchIcon}`}
            alt="Search icon"
            className="filter-gray ml-2 h-4 w-4 flex-shrink-0 cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              setIsExpanded(true);
              inputRef.current?.focus();
              handleSearch(e);
            }}
          />
        </div>
      </form>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Searched Data"
      >
        <GlobalSearchedData data={data} setIsOpen={setIsOpen} />
      </Modal>
    </div>
  );
}

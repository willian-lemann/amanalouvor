import { SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ListFilterIcon, XIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";

import {
  usePathname,
  useRouter,
  useSearchParams,
  redirect,
  RedirectType,
} from "next/navigation";
import { useEffect, useState } from "react";

const types = [
  { label: "Apartamento", value: "apartamento" },
  { label: "Comercial", value: "comercial" },
  { label: "Residencial", value: "residencial" },
];

const filters = [
  { label: "Aluguel", value: "aluguel" },
  { label: "Venda", value: "venda" },
];

export function SearchContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const params = new URLSearchParams(searchParams);

  const [search, setSearch] = useState(params.get("q") || "");

  const hasFilters = params.has("q");

  function handleSearch() {
    if (search) {
      params.set("q", search);
    } else {
      params.delete("q");
    }
    replace(`${pathname}?${params.toString()}`);
  }

  const clearFilters = () => {
    redirect(`${pathname}`, RedirectType.replace);
  };

  function clearQueryFilter() {
    params.delete("q");
    replace(`${pathname}?${params.toString()}`);
    setSearch("");
  }

  useEffect(() => {
    document.addEventListener("input", (e: any) => {
      if (!e.inputType) {
        clearQueryFilter();
      }
    });

    return () => {
      document.removeEventListener("input", (e: any) => {
        if (!e.inputType) {
          clearQueryFilter();
        }
      });
    };
  }, []);

  return (
    <>
      <div className="relative flex-1 flex">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Pesquise pelo nome, endereço ou código do imóvel"
          value={search}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full py-3 pl-12 pr-4 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        />
      </div>

      <Button
        type="button"
        onClick={handleSearch}
        className="px-6 py-3 rounded-r-lg"
      >
        <SearchIcon className="mr-2 w-5 h-5" />
        Procurar
      </Button>

      {hasFilters ? (
        <Button
          onClick={clearFilters}
          variant="secondary"
          className="flex items-center gap-2 animate-fadeIn"
        >
          <Label className="cursor-pointer">Limpar filtros</Label>
          <XIcon className="h-4 w-4" />
        </Button>
      ) : null}
    </>
  );
}

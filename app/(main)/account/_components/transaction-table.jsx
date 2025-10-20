"use client";

import { useState, useEffect, useMemo } from "react";
import {
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Trash,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Clock,
  Pencil,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { categoryColors } from "@/data/categories";
import { bulkDeleteTransactions } from "@/actions/account";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";
import { useRouter } from "next/navigation";


const ITEMS_PER_PAGE = 10;

const RECURRING_INTERVALS = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};

export function TransactionTable({ transactions }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortConfig, setSortConfig] = useState({
    field: "date",
    direction: "desc",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [recurringFilter, setRecurringFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  // Memoized filtered and sorted transactions
  const filteredAndSortedTransactions = useMemo(() => {
    let result = [...transactions];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter((transaction) =>
        transaction.description?.toLowerCase().includes(searchLower)
      );
    }

    // Apply type filter
    if (typeFilter) {
      result = result.filter((transaction) => transaction.type === typeFilter);
    }

    // Apply recurring filter
    if (recurringFilter) {
      result = result.filter((transaction) => {
        if (recurringFilter === "recurring") return transaction.isRecurring;
        return !transaction.isRecurring;
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;

      switch (sortConfig.field) {
        case "date":
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case "amount":
          comparison = a.amount - b.amount;
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        default:
          comparison = 0;
      }

      return sortConfig.direction === "asc" ? comparison : -comparison;
    });

    return result;
  }, [transactions, searchTerm, typeFilter, recurringFilter, sortConfig]);

  // Pagination calculations
  const totalPages = Math.ceil(
    filteredAndSortedTransactions.length / ITEMS_PER_PAGE
  );
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedTransactions.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [filteredAndSortedTransactions, currentPage]);

  const handleSort = (field) => {
    setSortConfig((current) => ({
      field,
      direction:
        current.field === field && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleSelect = (id) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedIds((current) =>
      current.length === paginatedTransactions.length
        ? []
        : paginatedTransactions.map((t) => t.id)
    );
  };

  const {
    loading: deleteLoading,
    fn: deleteFn,
    data: deleted,
  } = useFetch(bulkDeleteTransactions);

  const handleBulkDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedIds.length} transactions?`
      )
    )
      return;

    deleteFn(selectedIds);
  };

  useEffect(() => {
    if (deleted && !deleteLoading) {
      toast.error("Transactions deleted successfully");
    }
  }, [deleted, deleteLoading]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setTypeFilter("");
    setRecurringFilter("");
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    setSelectedIds([]); // Clear selections on page change
  };

  return (
    // 1. Outer Container: Dark Background
    <div className="space-y-4 rounded-xl border border-zinc-800 shadow-xl p-4 bg-zinc-900 text-white">
      {deleteLoading && (
        // Use blue accent color for the loader
        <BarLoader className="mt-4" width={"100%"} color="#3b82f6" /> 
      )}
      {/* Filters */}
      {/* Filter Container: Dark background/border */}
      <div className="flex flex-wrap gap-2 items-center justify-between p-4 rounded-xl border border-zinc-700 bg-zinc-800"> 
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-zinc-400" />
          {/* Search Input: Dark styling */}
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-8 h-9 w-[100%] text-sm bg-zinc-700 border-zinc-600 text-white placeholder:text-zinc-400 focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2">
          {/* Selects: Dark styling */}
          <Select
            value={typeFilter}
            onValueChange={(value) => {
              setTypeFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[130px] bg-zinc-700 border-zinc-600 text-white hover:bg-zinc-600">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
              <SelectItem value="INCOME">Income</SelectItem>
              <SelectItem value="EXPENSE">Expense</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={recurringFilter}
            onValueChange={(value) => {
              setRecurringFilter(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[160px] bg-zinc-700 border-zinc-600 text-white hover:bg-zinc-600">
              <SelectValue placeholder="All Transactions" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
              <SelectItem value="recurring">Recurring Only</SelectItem>
              <SelectItem value="non-recurring">Non-recurring Only</SelectItem>
            </SelectContent>
          </Select>

          {/* Bulk Actions */}
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                variant="destructive"
                size="sm"
                // Using red-600 for destructive actions
                className="bg-red-600 hover:bg-red-700" 
                onClick={handleBulkDelete}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete Selected ({selectedIds.length})
              </Button>
            </div>
          )}

          {(searchTerm || typeFilter || recurringFilter) && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleClearFilters}
              title="Clear filters"
              // Clear filter button: Dark styling
              className="bg-zinc-700 border-zinc-600 text-white hover:bg-zinc-600"
            >
              <X className="h-4 w-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-md border border-zinc-700">
        <Table>
          {/* 2. Table Header: Fixed Dark Background */}
          <TableHeader className="sticky top-0 z-10 bg-zinc-800 border-b border-zinc-700 text-zinc-400">
            <TableRow className="hover:bg-zinc-800/90 border-zinc-700"> 
              <TableHead className="w-[50px]">
                {/* Checkbox: Needs styling update for dark mode if defaults don't work */}
                <Checkbox
                  checked={
                    selectedIds.length === paginatedTransactions.length &&
                    paginatedTransactions.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                  // Using blue accent for checked state
                  className="data-[state=checked]:bg-blue-500 data-[state=checked]:text-white border-zinc-500"
                />
              </TableHead>
              {/* ... (TableHead elements with sorting logic remain the same) ... */}
              <TableHead
                className="cursor-pointer text-zinc-400"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center">
                  Date
                  {sortConfig.field === "date" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead className="text-zinc-400">Description</TableHead>
              <TableHead
                className="cursor-pointer text-zinc-400"
                onClick={() => handleSort("category")}
              >
                <div className="flex items-center">
                  Category
                  {sortConfig.field === "category" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer text-right text-zinc-400"
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center justify-end">
                  Amount
                  {sortConfig.field === "amount" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead className="text-zinc-400">Recurring</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>

          {/* 3. Table Body/Rows: Dark/Zebra Styling */}
          <TableBody>
            {paginatedTransactions.length === 0 ? (
              <TableRow className="even:bg-zinc-900 hover:bg-zinc-800 transition-colors border-zinc-700"> 
                <TableCell
                  colSpan={7}
                  className="text-center text-zinc-500"
                >
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              paginatedTransactions.map((transaction) => (
                // Alternating row colors for better readability
                <TableRow 
                  key={transaction.id} 
                  className="even:bg-zinc-900 hover:bg-zinc-800 transition-colors border-zinc-800"
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.includes(transaction.id)}
                      onCheckedChange={() => handleSelect(transaction.id)}
                      // Using blue accent for checked state
                      className="data-[state=checked]:bg-blue-500 data-[state=checked]:text-white border-zinc-500"
                    />
                  </TableCell>
                  <TableCell className="text-zinc-300">
                    {format(new Date(transaction.date), "PP")}
                  </TableCell>
                  <TableCell className="text-white">{transaction.description}</TableCell>
                  <TableCell className="capitalize">
                    <span
                      style={{
                        background: categoryColors[transaction.category],
                      }}
                      className="px-2 py-1 rounded text-white text-sm"
                    >
                      {transaction.category}
                    </span>
                  </TableCell>
                  <TableCell
                    className={cn(
                      "text-right font-medium",
                      transaction.type === "EXPENSE"
                        ? "text-red-400" 
                        : "text-green-400"
                    )}
                  >
                    {transaction.type === "EXPENSE" ? "-" : "+"}${transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {transaction.isRecurring ? (
                      <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge
                            variant="secondary"
                            // Dark styling for recurring badge (purple-950/purple-400)
                            className="gap-1 bg-purple-950/50 text-purple-400 hover:bg-purple-900/60 border border-purple-800/50 px-2 py-0.5 text-xs rounded-md"
                          >
                            <RefreshCw className="h-3 w-3" />
                            {RECURRING_INTERVALS[transaction.recurringInterval]}
                          </Badge>
                        </TooltipTrigger>
                        {/* Tooltip content inherits dark styling from global config or needs custom styling */}
                        <TooltipContent className="bg-zinc-800 border-zinc-700 text-white">
                          Recurs {RECURRING_INTERVALS[transaction.recurringInterval]}
                        </TooltipContent>
                      </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <Badge 
                        variant="outline" 
                        className="gap-1 bg-zinc-800 border-zinc-700 text-zinc-400"
                      >
                        <Clock className="h-3 w-3" />
                        One-time
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 text-zinc-400 hover:bg-zinc-700">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      {/* Dropdown content inherits dark styling from global config or needs custom styling */}
                      <DropdownMenuContent align="end" className="bg-zinc-800 border-zinc-700 text-white">
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(
                              `/transaction/create?edit=${transaction.id}`
                            )
                          }
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-zinc-700"/>
                        <DropdownMenuItem
                          // Destructive text color for dark mode
                          className="text-red-400 hover:text-red-300 focus:bg-red-900/50" 
                          onClick={() => deleteFn([transaction.id])}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 gap-2">
          {/* Pagination Buttons: Dark styling */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700 disabled:opacity-50"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-zinc-400">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="bg-zinc-800 border-zinc-700 text-zinc-400 hover:bg-zinc-700 disabled:opacity-50"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
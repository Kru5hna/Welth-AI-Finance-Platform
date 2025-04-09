"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@radix-ui/react-checkbox";
import { format } from "date-fns";
import { categoryColors } from "@/data/categories";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronDown, ChevronUp, Clock, MoreHorizontal, RefreshCw, Search, Trash, X } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/router";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/use-fetch";
import { bulkDeleteTransactions } from "@/actions/account";
import { toast } from "sonner";
import { BarLoader } from "react-spinners";

const RECURRING_INTERVALS = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly"
}


const TransactionTable = ({ transactions }) => {

  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState([])
  const [sortConfig, setSortConfig] = useState({
    field: "date",
    direction: "desc"
});

  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [recurringFilter, setRecurringFilter] = useState("")

  const {
    loading: deleteLoading,
    fn: deleteFn,
    data: deleted,
  } = useFetch(bulkDeleteTransactions);

  const filteredAndSortedTransactions = useMemo( () => {
    let result = [...transactions];
    // Search Filter lavat ahe

    if(searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter((transaction) => 
      transaction.description?.toLowerCase().includes(searchLower) );
    }
    // Apply recurring filter

    if(recurringFilter) {
      result = result.filter((transaction) => {
        if(recurringFilter === "recurring") return transaction.isRecurring;
        return !transaction.isRecurring
      })
    }

    // Apply type filter
    if(typeFilter) {
      result = result.filter((transaction) => transaction.type === typeFilter)
    }

    // Apply Sort

    result.sort((a,b) => {
      let comparison = 0;

      switch(sortConfig.field) {
        case "date":
          comparison = new Date(a) - new Date(b);
          break;

        case "amount" :
          comparison = a.amount - b.amount;
          break;

        case "category":
          comparison = a.category.loaclCompare(b.category);

        default:
          comparison = 0;
      }
      return sortConfig.direction === "asc" ? comparison : -comparison;
    })

    return result;
    
  }, [transactions, searchTerm,typeFilter,recurringFilter,sortConfig] );


  const handleSort = (field) => {
    setSortConfig(current => ({
      field,
      direction:
       current.field === field && current.direction === "asc"? "desc" :"asc"
    }))
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

  const handleBulkDelete = async () => {
      if(
        !window.confirm (
          `Are you sure you want to delete ${selectedIds.length} transactions?`
        ) 
      ){
        return;
      }
      deleteFn(selectedIds)
  };

  useEffect(() => {
    if(deleted && !deleteLoading) {
      toast.error("Transactions deleted Successfully");
    }
  },[deleted,deleteLoading])
  const handleClearFilters = () => {
      setSearchTerm("")
      setRecurringFilter("");
      setTypeFilter("");
      setSelectedIds([]);
  }

  return (
    <div className="space-y-4">
      {/* Filters  */}

      { deleteLoading && <BarLoader className="mt-4" width={"100%"} color="#9333ea" />}

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input 
      placeholder= "Search Transactions..."
      value= {searchTerm}
      onChange = {(e) => setSearchTerm(e.target.value)}
      className="pl-8"
              />
          </div>

         <div>
         <Select value={RecurringFilter} onValueChange={(value) => setRecurringFilter(value)} >
  <SelectTrigger className="w-[150px]">
    <SelectValue placeholder="All Transactions" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="recurring">Recurring only</SelectItem>
    <SelectItem value="non-recurring">Non-recurring only</SelectItem>
  </SelectContent>
</Select>

      {selectedIds.length > 0 && (
        <div className="flex items-center gap-2">
          <Button variant="destructive" size= "sm" onClick={handleBulkDelete} >
            <Trash className="h-4 w-4 mr-2" />
            Delete Selected ({selectedIds.length})
          </Button>
          </div>
      )}

      ((searchTerm || typeFilter || recurringFilter) && (
        <Button variant="outline" size="icon" onClick={handleClearFilters} title="Clear Filters"> <X className="h-4 w-5" /> </Button>
      ))

         </div>

        </div>

      {/* Transactions  */}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox 
                checked = {
                  selectedIds.length === filteredAndSortedTransactions.length &&
                  filteredAndSortedTransactions.length > 0
                }
                />
              </TableHead>

              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center">Date {" "}

              {sortConfig.field === "date" && 
              (sortConfig.direction === "asc" ? (
                <ChevronUp className="ml-4 h-4 w-4" />
              ) : (
                <ChevronDown className="ml-4 h-4 w-4" />
              ) ) }

                </div>
              </TableHead>

              <TableHead>Description</TableHead>

              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("category")}
              >
                <div className="flex items-center">Category

                {sortConfig.field === "date" && 
              (sortConfig.direction === "asc" ? (
                <ChevronUp className="ml-4 h-4 w-4" />
              ) : (
                <ChevronDown className="ml-4 h-4 w-4" />
              ) ) }

                </div>
              </TableHead>

              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center justify-end">Amount

                {sortConfig.field === "date" && 
              (sortConfig.direction === "asc" ? (
                <ChevronUp className="ml-4 h-4 w-4" />
              ) : (
                <ChevronDown className="ml-4 h-4 w-4" />
              ) ) }

                </div>
              </TableHead>

              <TableHead>Description</TableHead>

              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedTransactions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted foreground"
                >
                  No Transactions Found
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedTransactions.map((transactions) => {
                <TableRow key={transactions.id}>
                  <TableCell>
                    <Checkbox onCheckedChange={() => handleSelect(transactions.id)} 
                    checked={selectedIds.includes(transactions.id)} />
                  </TableCell>
                  <TableCell>
                    {format(new Date(transactions.date), "PP")}
                  </TableCell>
                  <TableCell>{transactions.description}</TableCell>
                  <TableCell className="capitalize">
                    <span
                      style={{
                        background: categoryColors[transactions.category],
                      }}
                      className="px-2 py-1 rounded text-white"
                    >
                      {transactions.category}
                    </span>
                  </TableCell>
                  <TableCell
                    className="text-right font-medium"
                    style={{
                      color: transactions.type === "EXPENSE" ? "red" : "green",
                    }}
                  >
                    {transactions.type === "EXPENSE" ? "-" : "+"}$
                    {transactions.amount.toFixed(2)}
                  </TableCell>

                  <TableCell>
                    {transactions.isRecurring ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge variant="outline" className="gap-1 bg-purple-100 text-purple-700 ">
                              <RefreshCw className="h-3 w-3" />
                              {RECURRING_INTERVALS[transactions.recurringInterval]}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent >
                            <div className="font-medium">
                              <div>Next Date: </div>
                              <div> {format(new Date(transactions.nextRecurringDate), "PP")}</div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <Badge variant="outline" className="gap-1">
                        <Clock className="h-3 w-3" />
                       
                      </Badge>
                    )}
                  </TableCell>

                    <TableCell>
                    <DropdownMenu>
  <DropdownMenuTrigger asChild >
    <Button variant="ghost" classNameh-8 w-8 p-0 >
      <MoreHorizontal className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem
      onClick = {() => {
        router.push(
          `transaction/create?edit = ${transactions.id}`
        )
      }}

    >Edit</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem
    className="text-destructive"
    onClick= {() => deleteFn(transactions.id)}
    >Delete</DropdownMenuItem>
    
  </DropdownMenuContent>
</DropdownMenu>

                    </TableCell>

                </TableRow>;
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TransactionTable;

"use client";

import React, { useState } from "react";
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
import { ChevronDown, ChevronUp, Clock, MoreHorizontal, RefreshCw } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/router";

const RECURRING_INTERVALS = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly"
}


const TransactionTable = ({ transactions }) => {
  const filteredAndSortedTransactions = transactions;

  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState([])
  const [sortConfig, setSortConfig] = useState({
    field: "date",
    direction: "desc"
})

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

  return (
    <div className="space-y-4">
      {/* Filters  */}

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
    <DropdownMenuLabel
      onClick = {() => {
        router.push(
          `transaction/create?edit = ${transactions.id}`
        )
      }}

    >Edit</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem
    className="text-destructive"
    // onClick= {() => deleteFn(transactions.id)}
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

"use client";


import { updateDefaultAccount } from "@/actions/account";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import useFetch from "@/hooks/use-fetch";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";

import React, { useEffect } from "react";
import { toast } from "sonner";

const AccountCard = ({ account }) => {
  const { name, id, type, balance, isDefault } = account;

  const {
    loading: updateDefaultLoading,
    fn: updateDefaultFn,
    data: updatedAccount,
    error,
  } = useFetch(updateDefaultAccount);

  const handleDefaultChange = async (event) => {
    event.preventDefault();
  
    if (isDefault) {
      toast.warning("You need atleast 1 default account");
      return;
    }
  
    const res = await updateDefaultFn(id); // <- log here
  };
  
  useEffect(() => {
    if (updatedAccount?.success) {
      toast.success("Default Account Updated Successfully");
    }
  }, [updatedAccount]);

useEffect(() => {
  if( error ) {

    toast.error(error.message || "Failed to update Default Account")
  }
},[error])


return (
  <Card className="group relative overflow-hidden rounded-2xl border border-muted bg-background hover:shadow-xl transition-shadow duration-300 ease-in-out">
    <Link href={`/account/${id}`} className="block p-4">
      
      {/* Top: Title + Switch */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold capitalize text-foreground group-hover:text-primary transition-colors">
          {name}
        </h3>

        <Switch
          checked={isDefault}
          onClick={handleDefaultChange}
          disabled={updateDefaultLoading}
          className="scale-90"
        />
      </div>

      {/* Middle: Balance */}
      <div className="mb-2">
        <p className="text-3xl font-extrabold text-primary">
          ${parseFloat(balance).toFixed(2)}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()} Account
        </p>
      </div>

      {/* Bottom: Income / Expense */}
      <div className="flex justify-between items-center pt-4 border-t mt-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <ArrowUpRight className="h-4 w-4 text-green-500" />
          <span>Income</span>
        </div>
        <div className="flex items-center gap-1">
          <ArrowDownRight className="h-4 w-4 text-red-500" />
          <span>Expense</span>
        </div>
      </div>
    </Link>
  </Card>
);

};

export default AccountCard;

"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { createAccount } from "@/actions/dashboard";
import { accountSchema } from "@/app/lib/schema";

export function CreateAccountDrawer({ children }) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      name: "",
      type: "CURRENT",
      balance: "",
      isDefault: false,
    },
  });

  const {
    loading: createAccountLoading,
    fn: createAccountFn,
    error,
    data: newAccount,
  } = useFetch(createAccount);

  const onSubmit = async (data) => {
    await createAccountFn(data);
  };

  useEffect(() => {
    if (newAccount) {
      toast.success("Account created successfully");
      reset();
      setOpen(false);
    }
  }, [newAccount, reset]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to create account");
    }
  }, [error]);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className="bg-zinc-950 border-zinc-800">
        <DrawerHeader className="border-b border-zinc-800 pb-4">
          <DrawerTitle className="text-xl font-semibold text-white">
            Create New Account
          </DrawerTitle>
        </DrawerHeader>
  
        <div className="px-4 pb-6 overflow-y-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
  
            {/* Account Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-300">
                Account Name
              </label>
              <Input
                id="name"
                placeholder="e.g., Main Checking"
                className="bg-zinc-900 border-zinc-800 text-white placeholder:text-gray-500 focus:border-zinc-700"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-red-400">{errors.name.message}</p>
              )}
            </div>
  
            {/* Account Type */}
            <div className="space-y-2 text-white">
              <label htmlFor="type" className="text-sm font-medium text-gray-300">
                Account Type
              </label>
              <Select
                onValueChange={(value) => setValue("type", value)}
                defaultValue={watch("type")}
              >
                <SelectTrigger 
                  id="type"
                  className="bg-zinc-900 border-zinc-800  focus:border-zinc-700 text-white"
                >
                  <SelectValue placeholder="Select account type"  />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800">
                  <SelectItem value="CURRENT" className="text-white ">
                    Current
                  </SelectItem>
                  <SelectItem value="SAVINGS" className="text-white ">
                    Savings
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-xs text-red-400">{errors.type.message}</p>
              )}
            </div>
  
            {/* Initial Balance */}
            <div className="space-y-2">
              <label htmlFor="balance" className="text-sm font-medium text-gray-300">
                Initial Balance
              </label>
              <Input
                id="balance"
                type="number"
                step="0.01"
                placeholder="0.00"
                className="bg-zinc-900 border-zinc-800 text-white placeholder:text-gray-500 focus:border-zinc-700"
                {...register("balance")}
              />
              {errors.balance && (
                <p className="text-xs text-red-400">{errors.balance.message}</p>
              )}
            </div>
  
            {/* Default Account Toggle */}
            <div className="flex items-center justify-between rounded-xl border border-zinc-800 p-4 bg-zinc-900">
              <div className="space-y-1">
                <label htmlFor="isDefault" className="text-sm font-medium text-white">
                  Set as Default
                </label>
                <p className="text-xs text-gray-400">
                  This will be the default account for new transactions.
                </p>
              </div>
              <Switch
                id="isDefault"
                checked={watch("isDefault")}
                onCheckedChange={(checked) => setValue("isDefault", checked)}
              />
            </div>
  
            {/* Action Buttons */}
            <div className="flex gap-16 pt-8">
              <DrawerClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 bg-transparent border-zinc-700 text-white hover:bg-zinc-900 hover:text-white hover:scale-95 cursor-pointer"
                >
                  Cancel
                </Button>
              </DrawerClose>
              <Button
                type="submit"
                className="flex-1 bg-white text-black hover:bg-gray-100 hover:scale-95 cursor-pointer"
                disabled={createAccountLoading}
              >
                {createAccountLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </div>
  
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
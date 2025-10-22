import { getAccountWithTransactions } from '@/actions/account'
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react'
import { BarLoader } from 'react-spinners'; // Keep this for loading states
import { TransactionTable } from '../_components/transaction-table';
import { AccountChart } from '../_components/account-chart';

const AccountsPage = async ({ params }) => {
  const { id } = await params; 
  if (!id) notFound();

  const accountData = await getAccountWithTransactions(id);

  if (!accountData) {
    notFound();
  }

  const { transactions, ...account } = accountData;
  
  const transactionCount = account._count.transactions;

  return (
    <div className="space-y-10 p-4 sm:p-8 md:p-10 text-white bg-black min-h-screen">
      
      {/* Header and Summary Section  */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end border-b border-zinc-800 pb-6">
        {/* Account Name & Type */}
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-1">
            {account.name}
          </h1>
          <p className="text-base font-medium text-blue-400">
            {account.type.charAt(0) + account.type.slice(1).toLowerCase()} Account
          </p>
        </div>

        <div className="mt-4 md:mt-0 md:text-right">
          <div className="text-4xl font-bold tracking-tight text-white">
            ₹{parseFloat(account.balance).toFixed(2)}
          </div>
          <p className="text-sm text-zinc-500 mt-1">
            {transactionCount} Transaction{transactionCount !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold border-l-4 border-blue-500 pl-3">
          Spending Overview
        </h2>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 sm:p-6 shadow-xl">
          <Suspense fallback={<BarLoader color="#3b82f6" width="100%" />}>
            <AccountChart transactions={transactions} /> 
          </Suspense>
        </div>
      </div>
      
      {/* Transaction Table Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold border-l-4 border-blue-500 pl-3">
          Recent Transactions
        </h2>
        <TransactionTable transactions={transactions} /> 
      </div>

    </div>
  )
}

export default AccountsPage
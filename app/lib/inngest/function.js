import { db } from "@/lib/prisma";
import { inngest } from "./client";
import { endOfMonth, startOfMonth } from "date-fns";

// percentage print var adkun ahe 

export const checkBudgetAlert = inngest.createFunction(
  { name: "Check Budget Alerts" },
  { cron: "0 */6 * * *" },
  async ({ step }) => {
    const budgets = await step.run("fetch-budget", async () => {
      return await db.budget.findMany({
        include: {
          user: {
            include: {
              accounts: {
                where: {
                  isDefault: true,
                },
              },
            },
          },
        },
      });
    });

    for (const budget of budgets) {
      const defaultAccounts = budget.user.accounts[0];
      if (!defaultAccounts) continue;

      await step.run(`check-budget-${budget.id}`, async () => {
        

        const expenses = await db.transaction.aggregate({
          where: {
            userId: budget.userId,
            accountId: defaultAccounts.id,
            type: "EXPENSES",
            date: {
              gte: startOfMonth(),
              lte: endOfMonth(),
            },
          },
          _sum: {
            amount: true,
          },
        });

        const totalExpenses = expenses._sum.amount.toNumber() || 0;
        const budgetAmount = budget.amount;
        const percentageUsed = (totalExpenses / budgetAmount) * 100;

        if(percentageUsed >= 80 && (!budget.lastAlertSent || isNewMonth(new Date(budget.lastAlertSent), new Date()))) {
         // send Email
console.log(percentageUsed, budget.lastAlertSent);

         // Update lastAlertSent
         await db.budget.update({
            where: {id: budget.id},
            data: {lastAlertSent : new Date()}
         })
        }
      });
    }
  }
);

function isNewMonth(lastAlertDate, currentDate) {
   return (
      lastAlertDate.getMonth() !== currentDate.getMonth() || 
      lastAlertDate.getFullYear() !== currentDate.getFullYear()
   )
}

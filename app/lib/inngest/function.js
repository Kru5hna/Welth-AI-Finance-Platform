import { db } from "@/lib/prisma";
import { inngest } from "./client";
import { endOfMonth, startOfMonth } from "date-fns";

// 👀 Startup log
console.log("✅ Budget Alert Function Loaded");

export const checkBudgetAlert = inngest.createFunction(
  { name: "Check Budget Alerts" },
  { cron: "0 */6 * * *" }, // runs every 6 hours
  async ({ step }) => {
    const budgets = await step.run("fetch-budget", async () => {
      const result = await db.budget.findMany({
        include: {
          user: {
            include: {
              accounts: {
                where: { isDefault: true },
              },
            },
          },
        },
      });
      console.log(`📦 Fetched ${result.length} budgets`);
      return result;
    });

    for (const budget of budgets) {
      const defaultAccounts = budget.user.accounts[0];
      if (!defaultAccounts) {
        console.warn(`⚠️ No default account found for user: ${budget.userId}`);
        continue;
      }

      await step.run(`check-budget-${budget.id}`, async () => {
        const expenses = await db.transaction.aggregate({
          where: {
            userId: budget.userId,
            accountId: defaultAccounts.id,
            type: "EXPENSE",
            date: {
              gte: startOfMonth(new Date()),
              lte: endOfMonth(new Date()),
            },
          },
          _sum: {
            amount: true,
          },
        });

        const totalExpenses = expenses._sum.amount?.toNumber() || 0;
        const budgetAmount = budget.amount;
        const percentageUsed = (totalExpenses / budgetAmount) * 100;

        console.log(`📊 Budget ID: ${budget.id}`);
        console.log(`   → Used: ₹${totalExpenses} of ₹${budgetAmount}`);
        console.log(`   → Usage: ${percentageUsed.toFixed(2)}%`);

        if (
          percentageUsed >= 80 &&
          (!budget.lastAlertSent ||
            isNewMonth(new Date(budget.lastAlertSent), new Date()))
        ) {
          console.log(`📣 ALERT: Budget ${budget.id} exceeded 80%! Sending email...`);

          // TODO: sendEmail(budget.user.email)

          await db.budget.update({
            where: { id: budget.id },
            data: { lastAlertSent: new Date() },
          });

          console.log(`✅ Alert sent and 'lastAlertSent' updated`);
        }
      });
    }
  }
);

function isNewMonth(lastAlertDate, currentDate) {
  return (
    lastAlertDate.getMonth() !== currentDate.getMonth() ||
    lastAlertDate.getFullYear() !== currentDate.getFullYear()
  );
}

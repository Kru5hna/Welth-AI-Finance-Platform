"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";


const serializedTransaction = (obj) => {
   const serialized = { ...obj };

   if(obj.balance) {
      serialized.balance = obj.balance.toNumber();
   }
    if(obj.amount) {
      serialized.amount = obj.amount.toNumber();
   }
   return serialized;

}

export async function createAccount(data) {

   try {
      const {userId} = await auth();
      if(!userId) throw new Error("Unauthorized");

      let user = await db.user.findUnique({
         where: {clerkUserId: userId},
      })

      if(!user) {
         throw new Error("User Not found")

          // Optional: fetch user details from Clerk
//   const clerkUser = await clerkClient.users.getUser(userId);

//   // Create the user in your database
//   user = await db.user.create({
//     data: {
//       clerkUserId: userId,
//       email: clerkUser.emailAddresses[0].emailAddress, // or whatever you want to store
//     },
//   });

      }

      // Convert balance to float before saving

      const balanceFloat = parseFloat(data.balance);
      if(isNaN(balanceFloat)) throw new Error("Invalid balance Amount");


      // Check if this is the user's first account

      const existingAccount = await db.account.findMany({
         where: {userId : user.id},
      })

      const shouldBeDefault  = 
      existingAccount.length === 0 ? true : data.isDefault;


      // If this account should be default , unset the other default accounts
      
      if(shouldBeDefault) {
         await db.account.updateMany({
            where: {userId : user.id , isDefault : true},
            data: {isDefault: false}
         })
      }

      const account = await db.account.create({
         data: {
            ...data,
            balance : balanceFloat,
            userId :user.id,
            isDefault : shouldBeDefault
         }
      });

      const serializedAccount = serializedTransaction(account);

      revalidatePath('/dashboard');
      return {
         success: true, 
         data: serializedAccount
      }

   }catch(e) {
      throw new Error(e.message);
      
   }
}
// shows user account in a descending order pattern
export async function getUserAccounts () {
   const {userId} = await auth();
      if(!userId) throw new Error("Unauthorized");

      const user = await db.user.findUnique({
         where: {clerkUserId: userId},
      })

      if(!user) {
         throw new Error("User Not found")
      }

      const accounts = await db.account.findMany( {
         where: {userId: user.id},
         orderBy: {createdAt: "desc"},
         include : {
            _count: {
               select: {
                  transactions: true,
               }
            }
         }
      });

      const serializedAccount = accounts.map(serializedTransaction);

      return serializedAccount;
}

export async function getDashboardData() {
   const {userId} = await auth();
   if(!userId) throw new Error("Unauthorized!");

   const user = await db.user.findUnique({
      where: {
         clerkUserId: userId
      }
   });
   if(!user) throw new Error("User not found");

   const transactions = await db.transaction.findMany({
      where: {userId: user.id},
      orderBy: {date: 'desc'},

   });
      return transactions.map(serializedTransaction);

}
"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";


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
export default async function updateDefaultAccount(accountId) {
   try {
      const {userId} = await auth();
         if(!userId) throw new Error("Unauthorized");
   
         const user = await db.user.findUnique({
            where: {clerkUserId: userId},
         })
   
         if(!user) {
            throw new Error("User Not found")
         }

         await db.account.updateMany({
            where: { userId: user.id, isDefault: true },
            data: {isDefault: false}
         })

         revalidatePath('/dashboard');
         return {success: true, data: serializedTransaction(account)}
         

   } catch (error)  {
      return { success: false, error: error.message }
   }
}
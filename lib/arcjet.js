import arcjet, { tokenBucket } from "@arcjet/next";

const aj = arcjet({
   key : process.env.ARCJET_KEY,
   // how are we going to track on the basis of what, userId from Clerk!
   characteristics: ["userId"], 
   rules: [
      tokenBucket({
         mode: "LIVE",
         refillRate: 10,
         interval: 3600,
         capacity: 10
      })
   ]
});
 
export default aj;
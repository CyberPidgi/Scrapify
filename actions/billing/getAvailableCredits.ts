"use server"

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server"
import { setupUser } from "./setupUser";

export async function getAvailableCredits(){
  const { userId } = auth();

  if (!userId) throw new Error("User not found");

  console.log("User ID:", userId) 
  
  const balance = await prisma.userBalance.findUnique({
    where:  {
      userId
    }
  })

  if (!balance) {
    await setupUser();
  };

  return balance ? balance.credits : 100;
}
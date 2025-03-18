"use server"

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server"
import { date } from "zod";

export async function getUserPurchaseHistory(){
  const { userId } = auth();

  if (!userId){
    throw new Error("User not authenticated")
  }

  return await prisma.userPurchase.findMany({
    where: {
      userId,
    },
    orderBy: {
      date: 'desc'
    }
  })
}
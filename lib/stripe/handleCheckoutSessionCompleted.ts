import "server-only";

import { writeFile } from "fs";
import Stripe from "stripe";
import { getCreditsPack, PackId } from "@/types/billing";
import prisma from "../prisma";

export async function handleCheckoutSessionCompleted(event: Stripe.Checkout.Session) {
  // writeFile("session_completed.json", JSON.stringify(event), (err) => {})

  if (!event.metadata) throw new Error("Missing metadata")

  const { userId, packId } = event.metadata;

  if (!userId){
    throw new Error("Missing user id")
  }

  if (!packId){
    throw new Error("Missing pack Id")
  }

  const purchasedPack = getCreditsPack(packId as PackId)
  if (!purchasedPack){
    throw new Error("Purchased pack not found");
  }

  await prisma.userBalance.upsert({
    where: {
      userId,
    },
    create: {
      userId,
      credits: purchasedPack.credits
    },
    update: {
      credits: {
        increment: purchasedPack.credits
      }
    }
  })

  await prisma.userPurchase.create({
    data: {
      userId,
      stripeId: event.id,
      description: `${purchasedPack.name} package - ${purchasedPack.credits} credits`,
      amount: event.amount_total!,
      currency: event.currency!,
    }
  })
}
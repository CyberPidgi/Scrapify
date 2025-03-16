"use server"

import { symmetricDecrypt, symmetricEncrypt } from "@/lib/encryption";
import prisma from "@/lib/prisma";
import { createCredentialSchema, createCredentialSchemaType } from "@/schema/credential";
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache";

export async function createCredential(form: createCredentialSchemaType) {
  const { userId } = auth();
  const { success, data } = createCredentialSchema.safeParse(form);

  if (!success) {
    throw new Error("Invalid form data")
  }

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const encryptedValue = symmetricEncrypt(data.value);

  console.log("@@TEST", {
    value: data.value,
    encryptedValue,
  });

  const result = await prisma.credential.create({
    data: {
      name: data.name,
      value: encryptedValue,
      userId,
    }
  });

  if (!result){
    throw new Error("Failed to create credential")
  }

  revalidatePath('/credentials');
}
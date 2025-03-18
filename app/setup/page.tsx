import { setupUser } from "@/actions/billing/setupUser";
import { waitFor } from "@/lib/helper/waitFor";
import { useEffect, useState } from "react";

export default async function SetupPage() {
  return await setupUser();
}
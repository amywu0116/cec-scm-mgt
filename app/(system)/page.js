"use client";
import { PATH_ANNOUNCEMENT_SETTINGS } from "@/constants/paths";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.push(PATH_ANNOUNCEMENT_SETTINGS);
  }, []);

  return;
}

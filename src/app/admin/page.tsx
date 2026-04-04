import type { Metadata } from "next";
import { redirect } from "next/navigation";
export const metadata: Metadata = { title: "Admin — iUseTools" };
export default function AdminPage() { redirect("/admin/login"); }

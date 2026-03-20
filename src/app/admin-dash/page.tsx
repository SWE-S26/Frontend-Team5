import { redirect } from "next/navigation";

export default function AdminDash() {
  redirect("/admin-dash/profiles-manage");
}

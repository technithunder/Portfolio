import type { Metadata } from "next";
import Login from "@component/v2/auth/Login";

export const metadata: Metadata = {
  title: "OrderOasis"
};

export default function LoginPage() {
  return <Login />;
}

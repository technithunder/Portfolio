import Signup from "@component/v2/auth/Signup";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OrderOasis",
  
};

export default function SignUpPage() {
  return <Signup />;
}

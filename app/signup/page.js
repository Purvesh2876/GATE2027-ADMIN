import { Suspense } from "react";
import SignupForm from "./SignupForm";

export const metadata = { title: "Create your account" };

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupForm />
    </Suspense>
  );
}

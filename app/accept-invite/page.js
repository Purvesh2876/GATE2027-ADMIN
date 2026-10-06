import { Suspense } from "react";
import InviteForm from "./InviteForm";

export const metadata = { title: "Set up your account" };

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={null}>
      <InviteForm />
    </Suspense>
  );
}

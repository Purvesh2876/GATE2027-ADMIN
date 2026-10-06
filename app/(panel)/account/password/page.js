import ChangePasswordForm from "./ChangePasswordForm";

export const metadata = { title: "Change password" };

export default function ChangePasswordPage() {
  return (
    <>
      <div className="page-head">
        <h1>Change password</h1>
        <p>You will stay signed in on this device. Any other device is signed out.</p>
      </div>
      <ChangePasswordForm />
    </>
  );
}

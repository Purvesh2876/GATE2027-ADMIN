import Link from "next/link";
import AuthCard from "./components/AuthCard";

export const metadata = { title: "Page not found" };

/* Also what a signed-in exhibitor sees on any staff address: the same plain
   "not found", so nothing reveals that staff pages exist. */
export default function NotFound() {
  return (
    <AuthCard title="We could not find that page" lead="The address may be wrong, or the page may have moved.">
      <Link className="btn btn-fill btn-lg btn-block" href="/">Go to the home page</Link>
    </AuthCard>
  );
}

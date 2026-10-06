import PanelShell from "../components/PanelShell";

/* Everything inside this folder needs a login. The (panel) name is only a
   folder group: it does not appear in the address. */
export default function PanelLayout({ children }) {
  return <PanelShell>{children}</PanelShell>;
}

import NameAndIDView from "./components/NameAndIDView";
import { UserSessionProvider } from "@/provider";

export default function Page() {
  return (
    <UserSessionProvider>
      <NameAndIDView />
    </UserSessionProvider>
  );
}

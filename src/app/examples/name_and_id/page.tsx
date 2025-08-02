import NameAndIDView from "@/features/examples/nameAndID/NameAndIDView";
import { UserSessionProvider } from "@/provider";

export default function Page() {
  return (
    <UserSessionProvider>
      <NameAndIDView />
    </UserSessionProvider>
  );
}

import NameAndIDView from "../components/NameAndIDView";
import { UserSessionProvider } from "@/provider";

const NameAndIdPage = () => {
  return (
    <UserSessionProvider>
      <NameAndIDView />
    </UserSessionProvider>
  );
};

export default NameAndIdPage;

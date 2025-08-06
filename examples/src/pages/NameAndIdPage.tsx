import NameAndIDView from "../components/NameAndIDView";
import { UserSessionProvider } from "@celab/react-user-session";

const NameAndIdPage = () => {
  return (
    <UserSessionProvider>
      <NameAndIDView />
    </UserSessionProvider>
  );
};

export default NameAndIdPage;

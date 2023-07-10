import {fetcher} from "./Fetcher";

const path = {
  changePassword: "/users/change-password",
};

export interface IChangePassword {
  // oldPassword: string;
  newPassword: string;
}

function changePassword(body: IChangePassword): Promise<IChangePassword> {
  return fetcher(
    {url: path.changePassword, method: "post", data: body},
    {displayError: true}
  );
}

export default {
  changePassword,
};

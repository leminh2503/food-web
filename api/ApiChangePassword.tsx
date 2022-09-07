import {fetcher} from "./Fetcher";
import {ILeaveWork} from "../types";

const path = {
    
    changePassword:"/users/change-password",
   
  };

  export interface IChangePassword{
  
    newPassword:string;
    
  
  }

  function changePassword(body: IChangePassword): Promise<IChangePassword>{
    return fetcher(
      {url: path.changePassword, method: "post", data: body},
      {displayError: true}
    );
  }

  export default {
   
    changePassword,
    
  };
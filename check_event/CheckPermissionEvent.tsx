import store from "@app/redux/store";

export const CheckPermissionEvent = (eventName?: string): boolean => {
  if (eventName) {
    const data = store?.getState()?.user?.role?.permissions;
    // console.log(data);
    const check = data?.filter((el) => el?.permissionKey === eventName) || [];
    return check?.length > 0;
  }
  return true;
};

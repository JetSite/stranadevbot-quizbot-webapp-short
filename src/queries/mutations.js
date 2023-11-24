import { useMutation } from "react-query";
import { setLogs, updateUser } from "../api";

export function useLogsQuery() {
  return useMutation(setLogs);
}

export function useUpdateUser() {
  return useMutation(updateUser);
}

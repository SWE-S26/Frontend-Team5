import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

// always import these two instead of the raw ones from react-redux
// the raw ones don't know your store's shape so you lose all type safety
export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector = <T>(selector: (state: RootState) => T): T => useSelector(selector);

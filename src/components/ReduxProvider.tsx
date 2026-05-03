"use client";

import { Provider } from "react-redux";
import { store } from "@/store/store";

// wrapper created so layout.tsx stays a server component
export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}

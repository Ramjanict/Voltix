import { createContext } from "react";

export interface ContextType {
  fetchUserDetails: () => Promise<void>;
  cartProductCount: number;
  fetchAddToCart: () => Promise<void>;
}

const ContextApi = createContext<ContextType>({
  fetchUserDetails: async () => {},
  cartProductCount: 0,
  fetchAddToCart: async () => {},
});

export default ContextApi;

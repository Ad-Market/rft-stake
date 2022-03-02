import { useWeb3React } from "@web3-react/core";
import React, {useMemo} from "react";
import { useNativeBalance } from "./useBalance";

export const useAccount = () => {   

    const {account, library} = useWeb3React();

    return;
}
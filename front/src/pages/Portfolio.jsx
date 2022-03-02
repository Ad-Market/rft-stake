import { Flex, Heading } from "@chakra-ui/react";
import React from "react";
import { useWeb3Wallet } from "../hooks/useWeb3Wallet";

export const Portfolio = () => {
    
    const {account, active} = useWeb3Wallet();

    if(!account && !active){
        return (
            <Flex width="100%" height={"100%"} alignItems={"center"} justifyContent="center">
                <Heading as="h1" size="xl">
                    Please connect your wallet
                </Heading>
            </Flex>
        )
    }
    
    
    return (
        <>
           
        </>
    )
}
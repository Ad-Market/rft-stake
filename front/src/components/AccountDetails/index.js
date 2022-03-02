import { Box, Text, Button, Flex, SkeletonText, Skeleton } from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import React, { useEffect } from "react";
import { ERC20 } from "../../abis/ERC20";
import { STAKEFACTORY_ABI, STAKEFACTORY_ADDRESS } from "../../abis/StakeFactory";
import { STAKETOKEN_ADDRESS, STAKETOKEN_ABI } from "../../abis/StakeToken";
import { useBalance, useNativeBalance } from "../../hooks/useBalance";
import { useContract } from "../../hooks/useContract";
import { useERC20 } from "../../hooks/useERC20";
import { useStaking } from "../../hooks/useStaking";
import {Card, CardHeader} from "../Card";
import { ItemLine, TokenAmount } from "./styled";

export const AccountDetails = () => {

    const {account, activate} = useWeb3React();
    const nativeBalance = useNativeBalance();
    const {totalStaked, rewards, distributed, claimRewards} = useStaking(account);
    const {symbol, balance} = useERC20(STAKETOKEN_ADDRESS);

    if(!account){
        return(
            <Card d='flex' flexDir="column" h={'100%'} borderColor={'border.card'}>
                <CardHeader title="Account" />
                <Flex p={5} flexDirection={"column"} h={'100%'} justifyContent={'center'} align={'center'}>
                    <Text>Oops, you must be connected</Text>
                    <Button mt={4} variant="outline" onClick={() => activate()}>Connect wallet</Button>
                </Flex>
            </Card>
        )
    }

    return(
        <Card h={'100%'} borderColor={'border.card'}>
            <Flex alignItems="baseline" justifyContent="space-between">
                <Box>   
                    <CardHeader title="Account" />             
                    <Box p={5} mt={6}>
                        <Text fontSize={'md'}>Balance</Text>
                        <TokenAmount fontSize={'38px'} withBg={true} amount={balance} symbol={symbol} />
                        <Skeleton size={'xs'} isLoaded={nativeBalance !== ''}>
                            <TokenAmount fontSize={'28px'} amount={nativeBalance ?? 0} symbol={'BNB'} />
                        </Skeleton>
                    </Box>
                </Box>
                <Flex p={5} gap={5} flexDir={"column"} alignItems={'flex-end'} px={5} pb={5} textAlign={'center'}>
                    <Button variant="outline" size="md">Buy {symbol}</Button>
                    <Button variant="outline" size="md">Track your rewards</Button>                    
                </Flex>
            </Flex>
            <hr />
            <Box p={5} mt={6}>
                <ItemLine title={'Total staked'} amount={totalStaked} symbol={symbol} />
                <ItemLine title={'Total rewards'} amount={distributed} symbol={symbol} />
                <ItemLine title={'Rewards to claim'} amount={rewards} symbol={symbol} />
            </Box>
            <Box px={5} pb={5} textAlign={'center'}>
                <Button onClick={() => claimRewards()} variant="outline" size="lg">
                    Claim rewards
                </Button>
            </Box>
        </Card>
    )

}
import React, { useEffect } from "react";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import {Card} from "../../Card";
import { ItemLine } from "../../AccountDetails/styled";
import { AmountInput } from "../styled";
import { useWeb3React } from "@web3-react/core";
import { useContract } from "../../../hooks/useContract";
import { STAKEFACTORY_ABI, STAKEFACTORY_ADDRESS } from "../../../abis/StakeFactory";
import { STAKETOKEN_ABI, STAKETOKEN_ADDRESS } from "../../../abis/StakeToken";
import { useStaking } from "../../../hooks/useStaking";
import { useERC20 } from "../../../hooks/useERC20";

export const InitialContent = ({navigate}) => {

    const {totalStaked, rewards, distributed} = useStaking();
    const {symbol} = useERC20(STAKETOKEN_ADDRESS);
    
    return (
        <Flex flexDir={'column'} gap={7}>
            <Card py={4} px={5} borderColor={'border.card'} display={'flex'} alignItems="center" justifyContent={'space-between'}>
                <Text fontSize={'xl'} fontWeight={'bold'}>Current APY</Text>
                <Text fontSize={'2xl'} fontWeight={'bold'} color="green.300">0.8<small>%</small></Text>
            </Card>
            <Card py={4} borderColor={'border.card'}>
                <Text px={5} fontSize={'md'}>Pool details</Text> 
                <Box px={5} mt={6} mb={5}>
                    <ItemLine title={'Total staked'} amount={totalStaked} symbol={symbol} />
                    <ItemLine title={'Total rewards to claim'} amount={rewards} symbol={symbol} />
                    <ItemLine title={'Total distributed'} amount={distributed} symbol={symbol} />
                </Box>
                <hr />
                <Box px={5} mt={5}>
                    <ItemLine title={'Staking fee'} amount={'1'} symbol={'%'} />
                    <ItemLine title={'Unstaking fee'} amount={'2'} symbol={'%'} />
                    <ItemLine title={'Locking fee'} amount={'1'} symbol={'%'} />
                </Box>
            </Card>
            <Flex my={10} alignContent={"center"} justifyContent={'space-evenly'} alignItems={'center'}>
                <Button bg="" onClick={() => navigate('stake')} variant="purple">Stake</Button>
                <Button bg="" onClick={() => navigate('unstake')} variant="purple">Unstake</Button>
            </Flex>
        </Flex>
    )
};

export const StakeContent = () => {

    const [amount, setAmount] = React.useState(0);
    const {account, library} = useWeb3React();
    const {stake} = useStaking(account);
    const {balance, symbol} = useERC20(STAKETOKEN_ADDRESS);
    const {approve} = useERC20(STAKETOKEN_ADDRESS);

    return(
        <Flex flexDir={'column'} gap={7}>
            <Card py={4} px={5} borderColor={'border.card'}>
                <Flex alignItems={"center"} justifyContent={"space-between"}>
                    <Text>Amount</Text>
                    <Text>Balance: {balance} {symbol}</Text>
                </Flex>
                <Flex alignItems={"center"} justifyContent={"space-between"} mt={5}>
                    <AmountInput action={(e) => setAmount(e)} />
                </Flex>
            </Card>
            <Card py={4} borderColor={'border.card'}>
                <Text px={5} fontSize={'md'}>Tx details</Text> 
                <Box px={5} mt={6} mb={5}>
                    <ItemLine title={'Staking/Unstaking feed'} amount={'1'} symbol={'%'} />
                    <ItemLine title={'Locking feed'} amount={'1'} symbol={'%'} />                    
                </Box>
                <hr />
                <Box px={5} mt={5}>
                    <ItemLine title={'Total staked'} amount={amount - (amount * 0.02)} symbol={symbol} />
                </Box>
            </Card>
            <Flex mt={10} alignContent={"center"} justifyContent={'space-evenly'} alignItems={'center'}>
                <Button variant="outline" onClick={() => stake(amount)}>Stake</Button>  
                <Button variant="outline" onClick={() => approve(STAKEFACTORY_ADDRESS)}>approve</Button>  
            </Flex>
        </Flex>
    )

}

export const UnstakeContent = ({}) => {

    const [amount, setAmount] = React.useState(0);
    const {account} = useWeb3React();
    const {unstake} = useStaking(account);

        return(
            <>
            <Flex flexDir={'column'} gap={7}>
                    <Card py={4} px={5} borderColor={'border.card'}>
                        <Flex alignItems={"center"} justifyContent={"space-between"}>
                            <Text>Amount</Text>
                            <Text>Balance: 800,000 RFT</Text>
                        </Flex>
                        <Flex alignItems={"center"} justifyContent={"space-between"} mt={5}>
                            <AmountInput action={(e) => setAmount(e)} />
                        </Flex>
                    </Card>
                    <Card py={4} borderColor={'border.card'}>
                        <Text px={5} fontSize={'md'}>Tx details</Text> 
                        <Box px={5} mt={6} mb={5}>
                            <ItemLine title={'Staking/Unstaking feed'} amount={'1'} symbol={'%'} />
                            <ItemLine title={'Locking feed'} amount={'1'} symbol={'%'} />                    
                        </Box>
                        <hr />
                        <Box px={5} mt={5}>
                            <ItemLine title={'Total staked'} amount={amount - (amount * 0.02)} symbol={'RFT'} />
                        </Box>
                    </Card>
                    <Flex mt={10} alignContent={"center"} justifyContent={'space-evenly'} alignItems={'center'}>
                        <Button variant="outline" onClick={() => unstake(amount)}>Unstake</Button>              
                    </Flex>
                </Flex>
            </>
        )
    
    }
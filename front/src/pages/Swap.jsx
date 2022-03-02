import { Button, Flex, Box, Heading, Text } from "@chakra-ui/react";
import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; 
import {Card, CardHeader} from "../components/Card";

const CardWelcome = () => (
    <Card width='60%'>
        <CardHeader 
            title="Welcome to the Dashboard"
        />
        <Flex flexDirection="column" gap="3" p={4}>
            <Text fontSize={18} fontWeight={"bold"}>Bogged Finance is a set of tools to make you a better DeFi trader.</Text>
            <Text>Use BogSwap, our multi-chain DEX aggregator, to trade tokens from 20+ DEXes across Binance Smart Chain, Polygon, Cronos, Fantom, and Avalanche.</Text>
            <Text>Place Limit Orders and Stop Losses on your Pancakeswap and Apeswap tokens - coming soon to all DEXes and chains.</Text>        
        </Flex>
    </Card>
)

const CardAchievements = () => (
    <Card width="40%">
        <CardHeader
            title={`Achievements`}
        />
        <Box p={5}>
            <Text>Next unlock in 100 BOG</Text>
            <Text>Premium Features:</Text>
            <Text>Hold or Stake $BOG to unlock advanced features on BOGCharts and Bogged.Finance</Text>
        </Box>
    </Card>
)

export const Swap = () => {

    const navigate = useNavigate();

    return (
        <Box w={'100%'}>
            <Heading as="h1" textAlign={"left"} size="lg">Welcome to REFLECTY.finance</Heading>
            <Flex width="100%" mt="10" gap='5'>
                <Button justifyContent={'space-between'} w='50%' onClick={() => navigate('/app/rewards')} variant="big">
                    Track your rewards
                    <FaArrowRight />
                </Button>
                <Button justifyContent={'space-between'} onClick={() => navigate('/app/stake')} w='50%' variant="big">
                    Stake your RFT
                    <FaArrowRight />
                </Button>
            </Flex>
            <Flex width="100%" mt="10" gap='5'>
                <CardWelcome />
                <CardAchievements />
            </Flex>
        </Box>
    )
}
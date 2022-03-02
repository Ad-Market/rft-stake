import React from "react";
import { Flex, Box, Heading, Text } from "@chakra-ui/react";
import { AccountDetails } from "../components/AccountDetails";
import { Stake } from "../components/Stake";

const StakePageIntro = () => (
    <Box>
        <Heading as={'h1'} size={'xl'}>Reflecty staking</Heading>
        <Text mt={4} lineHeight={1.5} fontSize={'md'}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. </Text>
        <Text mt={2} lineHeight={1.5} fontSize={'md'}>Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus.</Text>
    </Box>
)

export const StakePage = () => {
    
    return (
        <Flex pt='10' w={'100%'} m={'0 auto'} flexDirection={['column', null, null, 'row']} justifyContent={[null, null, null, 'space-around']}>
            <Flex flexDirection={"column"} flex={'0 0 45%'} gap={10}>
                <StakePageIntro />
                <AccountDetails />
            </Flex>
            <Flex flex={'0 0 35%'}>
                <Stake />
            </Flex>
        </Flex>
    );
};
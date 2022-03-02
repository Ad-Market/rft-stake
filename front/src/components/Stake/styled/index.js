import { Flex, Box, Input, Text } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { useERC20 } from "../../../hooks/useERC20";
import {STAKETOKEN_ADDRESS} from "../../../abis/StakeToken";

const AmountInputWrapper = styled(Flex)`
    position: relative;
    &::after {
        content: ${({ symbol }) => `"${symbol}"`};
    }
`

export const AmountInput = ({ action }) => {
        
    const { symbol } = useERC20(STAKETOKEN_ADDRESS);
    
    return (
        <AmountInputWrapper symbol={symbol} alignItems={'center'} justifyContent={'flex-start'}>
            <Input fontWeight={600} onChange={(e) => action(e.target.value)} type="number" fontSize={38} size={'xs'} variant={"unstyled"} placeholder="0.00" />                
        </AmountInputWrapper>
    )
}
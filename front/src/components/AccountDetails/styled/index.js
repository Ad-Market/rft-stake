import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import styled from "@emotion/styled";

export const StyledTokenAmount = styled(Box)`
    display: flex;
    align-items: baseline;
    background: ${({withBg}) => withBg ? '-webkit-linear-gradient(rgba(119, 255, 116, 1), rgba(118, 255, 222, 1))' : 'white'};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 600;
    div{
        font-size: 0.7em;
        font-weight: 600;
        margin-left: 0.5em;
        color: #fff;
        background: #AAAAAA;
        -webkit-background-clip: text;
    }
`

export const TokenAmount = ({amount, symbol, withBg, fontSize}) => {
    return (
        <StyledTokenAmount fontSize={fontSize} withBg={withBg}>
            {amount} <Box>{symbol}</Box>
        </StyledTokenAmount>
    )
}

export const StyledItemLine = styled(Flex)`
    align-items: center;
    justify-content: space-between;
    &:not(:last-child){
        margin-bottom: 5px;
    }
`

export const ItemLine = ({amount, symbol, title}) => {
    return (
        <StyledItemLine>
            <TokenAmount amount={amount} symbol={symbol} fontSize={'23px'} />
            <Box>
                {title}
            </Box>
        </StyledItemLine>
    )
}
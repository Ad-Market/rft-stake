import React from 'react';
import { Modal as ModalWrapper, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, ModalCloseButton, useBreakpointValue, Slide, Box} from "@chakra-ui/react";

export function Modal({ render, title, footer, isOpen, onToggle }){
    
    const isMobile = useBreakpointValue({ base: true, xs: true, sm: false })

    if(isMobile) {
        return (
            <Slide in={isOpen} direction={"bottom"} style={{zIndex: 9999}}>
                <Box
                    p='40px'
                    color='white'
                    mt='4'
                    bg='teal.500'
                    rounded='md'
                    shadow='md'
                    >
                {render}
                </Box>
            </Slide>
        )
    }
    
    return (
        <>
            <ModalWrapper closeOnOverlayClick={true} isOpen={isOpen} onClose={onToggle} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{title}</ModalHeader>
                    <ModalCloseButton />
                    
                    <ModalBody>
                       
                    </ModalBody>
                        {render}
                    <ModalFooter>
                        {footer}
                    </ModalFooter>
                </ModalContent>
            </ModalWrapper>
        </>
    )
}
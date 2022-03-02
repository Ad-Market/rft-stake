// 1. import `extendTheme` function
import { extendTheme } from '@chakra-ui/react'
import { mode } from '@chakra-ui/theme-tools';

const colors = {
	border:{
		card: '#6C6969',
	}
}
const components = {
	Button: {
		variants: {
			big: {
				padding: 12,
				backgroundColor: '#7993ff',
				borderRadius: 10,
				textAlign: 'left',
				fontSize: '1.2rem',
				fontWeight: 'bold',
				color: 'white',
				justifyContent: 'start',
			},
			purple:{
				backgroundColor: '#7993ff',	
			}
		}
	}
}

const styles = {
	global: props => ({
		body: {
			color: mode('gray.900', 'whiteAlpha.900')(props),
			bg: mode('whiteAlpha.900', '#00000b')(props),
			fontFamily: "Open Sans",
		},		
	}),
	Tooltip: {
		borderRadius: '100px'
	},
};

const theme = extendTheme({ 
    initialColorMode: 'dark',
    useSystemColorMode: false,
    styles,
	colors,
	components
})

export default theme
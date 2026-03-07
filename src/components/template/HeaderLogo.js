import React from 'react'
import Logo from 'components/template/Logo'
import { useSelector } from 'react-redux'

const HeaderLogo = () => {

	const mode = useSelector(state => state.theme.mode)

	return (
		<Logo
			mode={mode}
			type="full"
			className="hidden md:block"
			logoHeight="44px"
		/>
	)
}

export default HeaderLogo
import React from 'react'
import { Dropdown } from 'components/ui'
import HorizontalMenuNavLink from './HorizontalMenuNavLink'

const HorizontalMenuDropdownItem = ({nav}) => {
	const { title, path, key } = nav

	const itemTitle = title

	return (
		<Dropdown.Item eventKey={key} > 
			{path 
				? 
				<HorizontalMenuNavLink path={path}>
					{itemTitle}
				</HorizontalMenuNavLink>
				: 
				<span>{itemTitle}</span>
			}
		</Dropdown.Item>
	)
}

export default HorizontalMenuDropdownItem
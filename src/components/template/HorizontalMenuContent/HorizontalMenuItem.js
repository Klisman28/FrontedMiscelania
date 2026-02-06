import React from 'react'
import navigationIcon from 'configs/navigation-icon.config'
import { MenuItem } from 'components/ui'
import HorizontalMenuNavLink from './HorizontalMenuNavLink'

const HorizontalMenuItem = ({ nav, isLink, manuVariant }) => {

	const { title, icon, path } = nav

	const itemTitle = title
	const IconComponent = icon ? navigationIcon[icon] : null

	return (
		<MenuItem variant={manuVariant}>
			{IconComponent && (
				<span className="text-2xl">
					<IconComponent />
				</span>
			)}
			{(path && isLink)
				?
				<HorizontalMenuNavLink path={path}>
					{itemTitle}
				</HorizontalMenuNavLink>
				:
				<span>{itemTitle}</span>
			}
		</MenuItem>
	)
}

export default HorizontalMenuItem
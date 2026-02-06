import React from 'react'
import navigationIcon from 'configs/navigation-icon.config'

export const Icon = ({ component: Component }) => {
	return <><Component /></>
}

const VerticalMenuIcon = ({ icon, gutter }) => {



	if (typeof icon !== 'string' && !icon) {

		return <></>
	}

	const IconComponent = navigationIcon[icon]

	if (!IconComponent) {

		return <></>
	}



	return (
		<span
			className={`text-2xl ${gutter ? 'ltr:mr-2 rtl:ml-2' : ''}`}
			style={{ display: 'inline-flex', alignItems: 'center', width: '24px', height: '24px' }}
		>
			{React.createElement(IconComponent, {
				style: { width: '100%', height: '100%', display: 'block' }
			})}
		</span>
	)
}

VerticalMenuIcon.defaultProps = {
	gutter: true
}

export default VerticalMenuIcon
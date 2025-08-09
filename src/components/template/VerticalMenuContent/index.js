import React, { useState, useEffect } from 'react'
import { Menu } from 'components/ui'
import VerticalSingleMenuItem from './VerticalSingleMenuItem'
import VerticalMenuIcon from './VerticalMenuIcon'
import VerticalCollapsedMenuItem from './VerticalCollapsedMenuItem'
import { themeConfig } from 'configs/theme.config'
import { NAV_ITEM_TYPE_TITLE, NAV_ITEM_TYPE_COLLAPSE, NAV_ITEM_TYPE_ITEM } from 'constants/navigation.constant'
import useMenuActive from 'utils/hooks/useMenuActive'

const { MenuGroup } = Menu

const VerticalMenuContent = props => {
	const {
		navMode,
		collapsed,
		routeKey,
		navigationTree = [],
		userAuthority = [],
		onMenuItemClick
	} = props

	const { activedRoute } = useMenuActive(navigationTree, routeKey)
	// Estado para controlar los menús expandidos
	const [openKeys, setOpenKeys] = useState([])

	// Si hay una ruta activa y su padre no está en openKeys, lo agregamos.
	useEffect(() => {
		if (activedRoute?.parentKey && !openKeys.includes(activedRoute.parentKey)) {
			setOpenKeys(prev => [...prev, activedRoute.parentKey])
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activedRoute?.parentKey])

	// Función para alternar el estado de expansión de un menú
	const toggleMenu = key => {
		setOpenKeys(prev =>
			prev.includes(key)
				? prev.filter(item => item !== key)
				: [...prev, key]
		)
	}

	const handleLinkClick = () => {
		onMenuItemClick?.()
	}

	const getNavItem = nav => {
		if (nav.subMenu.length === 0 && nav.type === NAV_ITEM_TYPE_ITEM) {
			return (
				<VerticalSingleMenuItem
					key={nav.key}
					nav={nav}
					onLinkClick={handleLinkClick}
					sideCollapsed={collapsed}
					userAuthority={userAuthority}
				/>
			)
		}

		if (nav.subMenu.length > 0 && nav.type === NAV_ITEM_TYPE_COLLAPSE) {
			return (
				<VerticalCollapsedMenuItem
					key={nav.key}
					nav={nav}
					onLinkClick={onMenuItemClick}
					sideCollapsed={collapsed}
					userAuthority={userAuthority}
				/>
			)
		}

		if (nav.type === NAV_ITEM_TYPE_TITLE) {
			return (
				<MenuGroup
					key={nav.key}
					label={
						<div
							style={{
								display: 'flex',
								alignItems: 'center',
								cursor: 'pointer'
							}}
							onClick={() => toggleMenu(nav.key)}
						>
							{nav.icon && (
								<VerticalMenuIcon
									icon={nav.icon}
									style={{ marginRight: collapsed ? '0px' : '8px' }} // Sin margen si está colapsado
								/>
							)}
							{!collapsed && nav.title}
						</div>
					}
				>


					{
						// Solo renderizamos los submenus si el menú está expandido
						openKeys.includes(nav.key) && (
							<div style={{ marginLeft: '25px' }}>
								{nav.subMenu.map(subNav => (
									subNav.subMenu.length > 0
										? (
											<VerticalCollapsedMenuItem
												key={subNav.key}
												nav={subNav}
												onLinkClick={onMenuItemClick}
												sideCollapsed={collapsed}
												userAuthority={userAuthority}
											/>
										)
										: (
											<VerticalSingleMenuItem
												key={subNav.key}
												nav={subNav}
												onLinkClick={onMenuItemClick}
												sideCollapsed={collapsed}
												userAuthority={userAuthority}
											/>
										)
								))}
							</div>
						)
					}
				</MenuGroup>
			)
		}
	}

	return (
		<Menu
			className="px-4 pb-4 border-0 "
			style={{ border: 'none' }}      // Sobrescritura adicional (por si hace falta)
			variant={navMode}
			sideCollapsed={collapsed}
			defaultActiveKeys={activedRoute ? [activedRoute.key] : []}
		>
			{navigationTree.map(nav => getNavItem(nav))}
		</Menu>
	)
}

VerticalMenuContent.defaultProps = {
	navMode: themeConfig.navMode
}

export default VerticalMenuContent

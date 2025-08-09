import React from 'react'
import { Avatar, Dropdown } from 'components/ui'
import withHeaderItem from 'utils/hoc/withHeaderItem'
import useAuth from 'utils/hooks/useAuth'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { HiOutlineUser, HiOutlineLogout } from 'react-icons/hi'

const dropdownItemList = [
]

export const UserDropdown = ({ className }) => {

	// bind this 
	const userInfo = useSelector((state) => state.auth.user)

	const { signOut } = useAuth()

	const handleSignOut = () => {
		signOut();
		// Recargar la página después de cerrar sesión
	}

	const UserAvatar = (
		<div className={classNames(className, 'flex items-center gap-2')}>
			<Avatar size={32} shape="circle" icon={<HiOutlineUser />} />
			<div className="hidden md:block">
				{/* <div className="text-xs capitalize">EXTRA</div> */}
				<div className="font-bold">{userInfo.owner}</div>
			</div>
		</div>
	)

	return (
		<div>
			<Dropdown menuStyle={{ minWidth: 240 }} renderTitle={UserAvatar} placement="bottom-end">
				<Dropdown.Item variant="header">
					<div className="py-2 px-3 flex items-center gap-2">
						<Avatar shape="circle" icon={<HiOutlineUser />} />
						<div>
							<div className="font-bold text-gray-900 dark:text-gray-100">{userInfo.username}</div>
							<div className="text-xs">{userInfo.owner}</div>
						</div>
					</div>
					<div className='py-2 px-3 items-center gap-2'>
						{userInfo.authority?.map((role, key) => {
							const colors = ['red', 'blue', 'amber', 'orange', 'purple', 'green', 'indigo', 'yellow', 'gray', 'emerald']
							const randomColor = colors[Math.floor(Math.random() * colors.length)];

							return (
								<div className={`text-xs text-${randomColor}-500 font-bold`} key={key}>
									{role}
								</div>
							)
						})}
					</div>
				</Dropdown.Item>
				<Dropdown.Item variant="divider" />
				{dropdownItemList.map(item => (
					<Dropdown.Item eventKey={item.label} key={item.label} className="mb-1">
						<Link className="flex gap-2 items-center" to={item.path}>
							<span className="text-xl opacity-50">{item.icon}</span>
							<span>{item.label}</span>
						</Link>
					</Dropdown.Item>
				))}
				{/* <Dropdown.Item variant="divider" /> */}
				<Dropdown.Item onClick={handleSignOut} eventKey="Sign Out" className="gap-2">
					<span className="text-xl opacity-50">
						<HiOutlineLogout />
					</span>
					<span>Cerrar Sesión</span>
				</Dropdown.Item>
			</Dropdown>
		</div>
	)
}

export default withHeaderItem(UserDropdown)

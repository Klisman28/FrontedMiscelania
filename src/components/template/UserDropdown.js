import React from 'react'
import { Avatar, Dropdown } from 'components/ui'
import withHeaderItem from 'utils/hoc/withHeaderItem'
import useAuth from 'utils/hooks/useAuth'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import { HiOutlineUser, HiOutlineLogout } from 'react-icons/hi'

const UserDropdown = ({ className }) => {
	const userInfo = useSelector((state) => state.auth.user)
	const { signOut } = useAuth()

	const handleSignOut = () => {
		signOut()
	}

	const UserAvatar = (
		<div className={classNames(className, 'flex items-center gap-2 cursor-pointer')}>
			<Avatar size={32} shape="circle" icon={<HiOutlineUser />} />
			<div className="hidden md:block">
				<div className="font-bold text-gray-900">{userInfo.first_name || userInfo.username}</div>
			</div>
		</div>
	)

	return (
		<div>
			<Dropdown
				menuStyle={{ minWidth: 280, padding: 12 }}
				renderTitle={UserAvatar}
				placement="bottom-end"
				className="bg-white border border-slate-200 rounded-2xl shadow-lg"
			>
				{/* Profile Header */}
				<Dropdown.Item variant="custom" className="p-0 hover:bg-transparent">
					<div className="flex items-start gap-3 mb-2">
						<Avatar
							size={40}
							shape="circle"
							className="bg-indigo-50 text-indigo-600 border border-indigo-100"
							icon={<HiOutlineUser />}
						/>
						<div className="flex-1 min-w-0">
							<div className="flex flex-col">
								<span className="font-bold text-slate-900 truncate text-sm leading-tight">
									{userInfo.username}
								</span>
								<span className="text-xs text-slate-500 truncate mt-0.5 font-medium">
									{userInfo.owner || userInfo.email || 'Usuario'}
								</span>
							</div>
							{/* Role Chip - Ubicado debajo para mejor jerarquía visual */}
							<div className="mt-2">
								{userInfo.authority?.map((role, index) => (
									<span
										key={index}
										className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-wider"
									>
										{role}
									</span>
								))}
							</div>
						</div>
					</div>
				</Dropdown.Item>

				{/* Separator */}
				<div className="my-2 border-t border-slate-100" />

				{/* Sign Out Item */}
				<Dropdown.Item
					onClick={handleSignOut}
					eventKey="Sign Out"
					className="p-0 hover:bg-transparent focus:bg-transparent active:bg-transparent"
				>
					<div className="flex items-center gap-3 h-11 px-3 rounded-xl text-slate-700 hover:bg-slate-50 active:bg-slate-100 transition-all duration-200 cursor-pointer group">
						<span className="text-xl text-slate-400 group-hover:text-slate-600 transition-colors">
							<HiOutlineLogout />
						</span>
						<span className="font-medium text-sm">Cerrar Sesión</span>
					</div>
				</Dropdown.Item>
			</Dropdown>
		</div>
	)
}

export default withHeaderItem(UserDropdown)

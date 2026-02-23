import { useSelector, useDispatch } from 'react-redux'
import { setUser, initialState } from 'store/auth/userSlice'
import { apiSignIn, apiSignOut } from 'services/AuthService'
import { onSignInSuccess, onSignOutSuccess } from 'store/auth/sessionSlice'
import appConfig from 'configs/app.config'
import { REDIRECT_URL_KEY } from 'constants/app.constant'
import { useNavigate } from 'react-router-dom'
import useQuery from './useQuery'

function useAuth() {

	const dispatch = useDispatch()

	const navigate = useNavigate()

	const query = useQuery()

	const { token, signedIn } = useSelector((state) => state.auth.session)

	const signIn = async ({ username, password }) => {
		try {
			const resp = await apiSignIn({ username, password })
			if (resp.data) {
				const { token } = resp.data.data
				dispatch(onSignInSuccess(token))
				if (resp.data.data.user) {
					const { user } = resp.data.data
					const roles = user.roles.map((role) => {
						return role.toUpperCase()
					});

					// Superadmin Detection Logic
					// Roles might be strings or objects. The map above converts to uppercase strings, but let's check `user.roles` safely.
					const isSuperAdmin =
						user.isSuperAdmin === true ||
						user.username === 'root' ||
						(Array.isArray(user.roles) && user.roles.some(r => (typeof r === 'string' ? r : r.name) === 'superadmin'));

					if (isSuperAdmin) {
						roles.push('SUPERADMIN');
					}

					dispatch(setUser({
						avatar: '',
						username: user.username,
						owner: user.employee?.fullname || user.username,
						authority: [...new Set(roles)], // Ensure unique
						subscriptionStatus: user.company?.subscription_status || 'active'
					}))
				} else {
					// Fallback for unexpected response structure
					dispatch(setUser({
						avatar: '',
						username: 'Anonymous',
						authority: ['USER'],
						owner: '',
						subscriptionStatus: 'active'
					}))
				}
				const redirectUrl = query.get(REDIRECT_URL_KEY)
				navigate(redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath)
				return {
					status: 'success',
					message: ''
				}
			}
		} catch (errors) {
			return {
				status: 'failed',
				message: errors?.response?.data?.message || errors.toString()
			}
		}
	}

	const handleSignOut = () => {
		dispatch(onSignOutSuccess())
		dispatch(setUser(initialState))
		navigate(appConfig.unAuthenticatedEntryPath)
	}

	const signOut = async () => {
		try {
			await apiSignOut()
			handleSignOut()
		} catch (errors) {
			handleSignOut()
		}
	}

	return {
		authenticated: token && signedIn,
		signIn,
		signOut
	}
}

export default useAuth
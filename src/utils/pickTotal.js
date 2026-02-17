import { pickList } from './pickList'

export const pickTotal = (res, key) => res?.data?.data?.total ?? pickList(res, key).length

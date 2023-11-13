import { getUserData } from '~system/UserIdentity'

export const getUserId = async () => {
    let userData = await getUserData({})
    return userData.data?.userId || "Unknown"
}
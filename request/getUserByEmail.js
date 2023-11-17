
export async function getUserByEmail(email) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })

        return user
    } catch (err) {
        return
    }
}
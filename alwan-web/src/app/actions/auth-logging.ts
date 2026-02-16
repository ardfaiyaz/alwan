'use server'

export async function logUserLogin(email: string) {
    console.log(`\x1b[32m[AUTH] User logged on: ${email}\x1b[0m`)
}

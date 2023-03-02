export class CreateUserDto {
    email: string
    nickname: string | null
    profileImage: string | null
    role: string
    addressUpper: string | null
    addressLower: string | null
}

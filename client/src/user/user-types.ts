export interface IUser {
    _id: string,
    username: string,
    email: string,
    cell: string,
    role: 'user' | 'admin' | 'specialist'
}
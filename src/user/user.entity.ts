import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'

@Entity({ schema: 'JobBoard', name: 'User' })
export class User {
    @PrimaryGeneratedColumn({ type: 'int' })
    userId: number

    @Index({ unique: true })
    @Column({ type: 'varchar' })
    email: string

    @Column({ type: 'varchar' })
    nickname: string | null

    @Column({ type: 'varchar' })
    profileImage: string | null

    @Column({ type: 'varchar' })
    role: string

    @Column({ type: 'varchar' })
    addressUpper: string | null

    @Column({ type: 'varchar' })
    addressLower: string | null

    @CreateDateColumn()
    createdDtm: Date

    @UpdateDateColumn()
    updatedDtm: Date | null

    @DeleteDateColumn()
    deletedDtm: Date | null
}

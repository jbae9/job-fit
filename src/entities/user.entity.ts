import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'

@Entity({ schema: 'jobfit', name: 'user' })
export class User {
    @PrimaryGeneratedColumn({ type: 'int' })
    userId: number

    @Index({ unique: true })
    @Column({ type: 'varchar' })
    email: string

    @Column({ type: 'varchar', nullable: true })
    nickname: string | null

    @Column({ type: 'varchar', nullable: true })
    profileImage: string | null

    @Column({ type: 'varchar' })
    role: string

    @Column({ type: 'varchar', nullable: true })
    addressUpper: string | null

    @Column({ type: 'varchar', nullable: true })
    addressLower: string | null

    @CreateDateColumn()
    createdDtm: Date

    @UpdateDateColumn()
    updatedDtm: Date | null

    @DeleteDateColumn()
    deletedDtm: Date | null
}

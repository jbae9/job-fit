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
    @Column()
    email: string

    @Column('varchar', { length: 200, select: false })
    password: string

    @Column('varchar', { length: 50 })
    role: string

    @CreateDateColumn()
    createdDtm: Date

    @UpdateDateColumn()
    updatedDtm: Date | null

    @DeleteDateColumn()
    deletedDtm: Date | null
}

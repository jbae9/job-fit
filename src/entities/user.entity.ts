import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { Jobpost } from './jobpost.entity'
import { Stack } from './stack.entity'

@Entity({ schema: 'jobfit', name: 'user' })
export class User {
    @PrimaryGeneratedColumn({ type: 'int' })
    userId: number

    @ManyToMany(() => Jobpost, (jobpost) => jobpost.users)
    @JoinTable({
        name: 'likedjobpost',
        inverseJoinColumn: {
            name: 'jobpost_id',
            referencedColumnName: 'jobpostId',
        },
        joinColumn: {
            name: 'user_id',
            referencedColumnName: 'userId',
        },
    })
    jobposts: Jobpost[]

    @ManyToMany(() => Stack, { onDelete: 'CASCADE' })
    @JoinTable({
        name: 'userstack',
        joinColumn: {
            name: 'user_id',
            referencedColumnName: 'userId',
        },
        inverseJoinColumn: {
            name: 'stack_id',
            referencedColumnName: 'stackId',
        },
    })
    stacks: Stack[]

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

    // 경도
    @Column({ type: 'double', nullable: true })
    longitude: number | null

    // 위도
    @Column({ type: 'double', nullable: true })
    latitude: number | null

    @CreateDateColumn()
    createdDtm: Date

    @UpdateDateColumn()
    updatedDtm: Date | null

    @DeleteDateColumn()
    deletedDtm: Date | null
}

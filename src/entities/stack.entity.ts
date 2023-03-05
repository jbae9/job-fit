import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    ManyToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { Jobpost } from './jobpost.entity'
import { User } from './user.entity'

@Entity({ schema: 'jobfit', name: 'stack' })
export class Stack {
    @PrimaryGeneratedColumn({ type: 'int' })
    stackId: number

    @ManyToMany(() => Jobpost)
    jobposts: Jobpost[]

    @ManyToMany(() => User)
    users: User[]

    @Index({ unique: true })
    @Column('varchar', { length: 100 })
    stack: string

    @Column('varchar', { length: 50 })
    category: string
}

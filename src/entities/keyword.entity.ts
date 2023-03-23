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

@Entity({ schema: 'jobfit', name: 'keyword' })
export class Keyword {
    @PrimaryGeneratedColumn({ type: 'int' })
    keywordId: number

    @ManyToMany(() => Jobpost, (jobpost) => jobpost.keywords)
    jobposts: Jobpost[]

    @Index({ unique: true })
    @Column('varchar', { length: 100 })
    keyword: string

    @Index({ unique: true })
    @Column('int')
    keywordCode: number
}

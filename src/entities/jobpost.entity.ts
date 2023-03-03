import { Company } from 'src/entities/company.entity'
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'
import { Keyword } from './keyword.entity'
import { Stack } from './stack.entity'
import { User } from './user.entity'

@Entity({ schema: 'jobfit', name: 'jobpost' })
export class Jobpost {
    @PrimaryGeneratedColumn({ type: 'int' })
    jobpostId: number

    @ManyToOne(() => Company)
    @JoinColumn({ name: 'company_id' })
    company: Company

    @ManyToMany(() => Keyword)
    @JoinTable({
        name: 'jobpostkeyword',
        joinColumn: {
            name: 'jobpost_id',
            referencedColumnName: 'jobpostId',
        },
        inverseJoinColumn: {
            name: 'keyword_code',
            referencedColumnName: 'keywordCode',
        },
    })
    keywords: Keyword[]

    @ManyToMany(() => User)
    @JoinTable({
        name: 'likedjobpost',
        joinColumn: {
            name: 'jobpost_id',
            referencedColumnName: 'jobpostId',
        },
        inverseJoinColumn: {
            name: 'user_id',
            referencedColumnName: 'userId',
        },
    })
    users: User[]

    @ManyToMany(() => Stack)
    @JoinTable({
        name: 'jobpoststack',
        joinColumn: {
            name: 'jobpost_id',
            referencedColumnName: 'jobpostId',
        },
        inverseJoinColumn: {
            name: 'stack_id',
            referencedColumnName: 'stackId',
        },
    })
    stacks: Stack[]

    @Column('int')
    companyId: number

    @Column('text')
    title: string

    @Column('mediumtext')
    content: string

    @Column('int', { nullable: true })
    salary: number | null

    @Column('varchar', { length: 100 })
    originalSiteName: string

    @Column('text')
    originalUrl: string

    @Column('text', { nullable: true })
    originalImgUrl: string | null

    @Column('datetime', { nullable: true })
    postedDtm: Date | null

    @Column('datetime', { nullable: true })
    deadlineDtm: Date | null

    @Column('varchar', { length: 100, nullable: true })
    preferenceCondition: string | null

    @Column('int', { nullable: true })
    views: number | null

    @CreateDateColumn()
    createdDtm: Date

    @UpdateDateColumn()
    updatedDtm: Date | null

    @DeleteDateColumn()
    deletedDtm: Date | null
}

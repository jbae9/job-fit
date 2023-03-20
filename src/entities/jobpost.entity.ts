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

@Index(['companyId', 'title'], { unique: true })
@Entity({ schema: 'jobfit', name: 'jobpost' })
export class Jobpost {
    @PrimaryGeneratedColumn({ type: 'int' })
    jobpostId: number

    @ManyToOne(() => Company)
    @JoinColumn({ name: 'company_id' })
    company: Company

    @ManyToMany(() => Keyword, (keyword) => keyword.jobposts, { cascade: true })
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

    @ManyToMany(() => User, (user) => user.jobposts, { cascade: true })
    users: User[]

    @ManyToMany(() => Stack, (stack) => stack.jobposts, { cascade: true })
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

    @Column('varchar')
    title: string

    @Column('mediumtext')
    content: string

    @Column('int', { nullable: true })
    salary: number | null

    @Column('varchar', { length: 100 })
    originalSiteName: string

    @Column('varchar', { length: 1000 })
    originalUrl: string

    @Column('varchar', { length: 1000, nullable: true })
    originalImgUrl: string | null

    @Column('datetime', { nullable: true })
    postedDtm: Date | null

    @Column('datetime', { nullable: true })
    deadlineDtm: Date | null

    @Column('int', { nullable: true })
    views: number | null

    @Column({ type: 'varchar', length: 1000, nullable: true })
    originalAddress: string | null

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

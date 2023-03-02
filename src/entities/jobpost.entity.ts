import { Company } from 'src/entities/company.entity'
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'

@Entity({ schema: 'jobboard', name: 'jobpost' })
export class Jobpost {
    @PrimaryGeneratedColumn({ type: 'int' })
    jobPostId: number

    @ManyToOne(() => Company)
    @JoinColumn({ name: 'company_id' })
    company: Company

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

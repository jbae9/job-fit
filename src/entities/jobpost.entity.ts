import { Company } from 'src/entities/company.entity'
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'

@Entity({ schema: 'JobBoard', name: 'Jobpost' })
export class Jobpost {
    @PrimaryGeneratedColumn({ type: 'int' })
    jobPostId: number

    // @ManyToOne((type) => Company, (company) => company.companyId)
    // company: Company

    @Column('text')
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

    @Column('datetime')
    deadlineDtm: Date

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

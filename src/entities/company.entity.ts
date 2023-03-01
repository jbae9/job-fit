import { Jobpost } from 'src/entities/jobpost.entity'
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    Index,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm'

@Entity({ schema: 'JobBoard', name: 'Company' })
export class Company {
    @PrimaryGeneratedColumn({ type: 'int' })
    companyId: number

    @OneToMany(() => Jobpost, (jobPost) => jobPost.jobPostId)
    jobPost: Jobpost[]

    @Index({ unique: true })
    @Column('varchar', { length: 100 })
    companyName: string

    @Column('varchar', { length: 10, nullable: true })
    representativeName: string | null

    @Column('int', { nullable: true })
    numberEmployees: number | null

    @Column('varchar', { length: 300, nullable: true })
    address: string | null

    @Column('int', { nullable: true })
    @Column('varchar', { length: 200 })
    imageUrl: string

    @CreateDateColumn()
    createdDtm: Date

    @UpdateDateColumn()
    updatedDtm: Date | null

    @DeleteDateColumn()
    deletedDtm: Date | null
}

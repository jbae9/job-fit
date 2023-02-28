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

@Entity({ schema: 'jobfit', name: 'company' })
export class Company {
    @PrimaryGeneratedColumn({ type: 'int' })
    companyId: number

    // @OneToMany((type) => Jobpost, (jobPost) => jobPost.jobPostId)
    // jobPost: Jobpost[]

    @Index({ unique: true })
    @Column('varchar', { length: 100 })
    name: string

    @Column('varchar', { length: 300 })
    address: string

    @Column('varchar', { length: 200 })
    imageUrl: string

    @CreateDateColumn()
    createdDtm: Date

    @UpdateDateColumn()
    updatedDtm: Date | null

    @DeleteDateColumn()
    deletedDtm: Date | null
}

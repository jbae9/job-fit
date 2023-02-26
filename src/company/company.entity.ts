import { JobPost } from 'src/job-post/job-post.entity'
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

    @OneToMany((type) => JobPost, (jobPost) => jobPost.jobPostId)
    jobPost: JobPost[]

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

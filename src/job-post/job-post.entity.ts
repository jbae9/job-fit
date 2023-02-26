import { Company } from 'src/company/company.entity'
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

@Entity({ schema: 'JobBoard', name: 'JobPost' })
export class JobPost {
    @PrimaryGeneratedColumn({ type: 'int' })
    jobPostId: number

    @ManyToOne((type) => Company, (company) => company.companyId)
    company: Company

    @Index({ unique: true })
    @Column()
    email: string

    @Column('varchar', { length: 200, select: false })
    password: string

    @Column('varchar', { length: 50 })
    role: string

    @CreateDateColumn()
    createdDtm: Date

    @UpdateDateColumn()
    updatedDtm: Date | null

    @DeleteDateColumn()
    deletedDtm: Date | null
}

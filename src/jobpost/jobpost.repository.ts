import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Jobpost } from '../entities/jobpost.entity';

@Injectable()
export class JobpostRepository extends Repository<Jobpost>{
	constructor(private dataSource: DataSource) {
		super(Jobpost, dataSource.createEntityManager());
	}

	async getSaraminData(jobpost: {}) {
		// const result = await this.createQueryBuilder()
		// 	.insert()
		// 	.into(Jobpost)
		// 	.values(jobpost)
		// 	.execute()
		// return result;
	}
}
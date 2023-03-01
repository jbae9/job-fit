import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from "typeorm";
import { Jobpost } from '../entities/jobpost.entity';

@Injectable()
export class JobpostService {
	constructor(
		@InjectRepository(Jobpost) private jobRepository: Repository<Jobpost>,
	) {
		this.jobRepository = jobRepository;
	}

}

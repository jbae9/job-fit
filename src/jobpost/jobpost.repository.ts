import { DataSource, Repository } from 'typeorm'
import { Jobpost } from 'src/entities/jobpost.entity'
import { Injectable } from '@nestjs/common'
import { CompanyRepository } from 'src/company/company.repository'
import { off } from 'process'

@Injectable()
export class JobpostRepository extends Repository<Jobpost> {
    constructor(
        private dataSource: DataSource,
        private companyRepository: CompanyRepository
    ) {
        super(Jobpost, dataSource.createEntityManager())
    }

    async postJobpostsInBulk(jobposts) {
        await this.createQueryBuilder()
            .insert()
            .into(Jobpost)
            .values(jobposts)
            .execute()
    }

    async createJobposts(jobposts) {
        // 공고 데이터 한번씩 돌면서
        for (let jobpost of jobposts) {
            const {
                companyName,
                title,
                content,
                salary,
                originalSiteName,
                originalUrl,
                originalImgUrl,
                postedDtm,
                deadlineDtm,
            } = jobpost

            const companyId = await this.companyRepository.findCompanyId(
                companyName
            )

            const query = `INSERT INTO jobpost (company_id, title, content, salary, original_site_name, original_url, original_img_url, posted_dtm, deadline_dtm)
                           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                           ON DUPLICATE KEY UPDATE
                           title = COALESCE(?, title),
                           content = COALESCE(?, content),
                           salary = COALESCE(?, salary),
                           original_site_name = COALESCE(?, original_site_name),
                           original_url = COALESCE(?, original_url),
                           original_img_url = COALESCE(?, original_img_url),
                           posted_dtm = COALESCE(?, posted_dtm),
                           deadline_dtm = COALESCE(?, deadline_dtm)`

            const values = [
                companyId,
                title,
                content,
                salary,
                originalSiteName,
                originalUrl,
                originalImgUrl,
                postedDtm,
                deadlineDtm,
                title,
                content,
                salary,
                originalSiteName,
                originalUrl,
                originalImgUrl,
                postedDtm,
                deadlineDtm,
            ]

            await this.query(query, values)
        }
    }

    async getRecentJobposts() {
        const query = `select j.jobpost_id, company_name, original_img_url, title, keywords, stacks, stackimgurls from jobpost j 
                        inner join (select jobpost_id, j.keyword_code, group_concat(keyword) as keywords from jobpostkeyword j 
                        inner join keyword k on j.keyword_code = k.keyword_code 
                        group by j.jobpost_id ) j2 on j.jobpost_id = j2.jobpost_id
                        inner join (select jobpost_id, group_concat(stack) as stacks, group_concat(stack_img_url) as stackImgUrls from jobpoststack j 
                        inner join stack s  on j.stack_id = s.stack_id  
                        group by j.jobpost_id) j3 on j.jobpost_id = j3.jobpost_id
                        inner join company c on j.company_id = c.company_id 
                        order by j.updated_dtm
                        limit 15 offset 0`

        return await this.query(query)
    }

    async getFilteredJobposts(
        order: string,
        orderBy: string,
        limit: number,
        offset: number
    ) {
        let where = ''

        switch (order) {
            case 'recent':
                order = 'j.updated_dtm'
                break
            case 'popular':
                order = 'likes, views'
                break
            case 'ending':
                if (orderBy === 'asc') {
                    where = 'where deadline_dtm is not null'
                    break
                } else {
                    order = 'deadline_dtm'
                    break
                }
            default:
                order = 'j.updated_dtm'
        }

        order += ' ' + orderBy

        const query = `select j.jobpost_id, company_name, original_img_url, title, keywords, stacks, stackimgurls, likes, views, deadline_dtm from jobpost j 
                        inner join (select jobpost_id, j.keyword_code, group_concat(keyword) as keywords from jobpostkeyword j 
                        inner join keyword k on j.keyword_code = k.keyword_code 
                        group by j.jobpost_id ) j2 on j.jobpost_id = j2.jobpost_id
                        inner join (select jobpost_id, group_concat(stack) as stacks, group_concat(stack_img_url) as stackImgUrls from jobpoststack j 
                        inner join stack s  on j.stack_id = s.stack_id  
                        group by j.jobpost_id) j3 on j.jobpost_id = j3.jobpost_id
                        inner join company c on j.company_id = c.company_id 
                        inner join (select j.jobpost_id, count(user_id) as likes from jobfit.jobpost j 
                        left join jobfit.likedjobpost l on j.jobpost_id = l.jobpost_id
                        group by j.jobpost_id) l on j.jobpost_id = l.jobpost_id
                        ${where}
                        order by ?
                        limit ? offset ?`

        const values = [order, limit, offset]

        // const test = await this.createQueryBuilder('jobpost')
        //     .leftJoin('jobpost.keywords', 'keyword')
        //     .leftJoin('jobpost.company', 'company')
        //     .leftJoin('jobpost.stacks', 'stack')
        //     // .addSelect(['stack.stack', 'stack.stackImgUrl'])
        //     .leftJoin('jobpost.users', 'likedjobpost')
        //     // .addSelect('COUNT(likedjobpost.userId) AS likes')
        //     .addGroupBy('jobpost.jobpostId')
        //     .orderBy('jobpost.deadlineDtm', 'ASC')
        //     .select([
        //         'jobpost.jobpostId',
        //         'company.companyName',
        //         'jobpost.originalImgUrl',
        //         'jobpost.title',
        //         'keyword',
        //         'stack',
        //         // 'keyword.keyword',
        //         // 'stack.stack',
        //         // 'stack.stackImgUrl',
        //         'COUNT(likedjobpost.userId) AS likes',
        //         'jobpost.views',
        //         'jobpost.deadlineDtm',
        //     ])
        //     .where('jobpost.deadlineDtm IS NOT NULL')
        //     .skip(offset)
        //     .take(limit)
        //     .getMany()

        // const test = await this.createQueryBuilder('jobpost')
        //     .leftJoinAndMapMany('jobpost.keywords', 'keyword')
        //     .take(10)
        //     .getMany()

        // if (order.includes('ending')) {
        //     return test
        // }

        return await this.query(query, values)
    }
}

import { DataSource, Repository } from 'typeorm'
import { Jobpost } from 'src/entities/jobpost.entity'
import { Injectable } from '@nestjs/common'
import { CompanyRepository } from 'src/company/company.repository'
import { default as keywords } from '../resources/data/parsing/keywordsForParsing.json'
import { default as stacks } from '../resources/data/parsing/stacksForParsing.json'
import { InjectRepository } from '@nestjs/typeorm'
import { Keyword } from 'src/entities/keyword.entity'
import { Stack } from 'src/entities/stack.entity'

@Injectable()
export class JobpostRepository extends Repository<Jobpost> {
    constructor(
        private dataSource: DataSource,
        private companyRepository: CompanyRepository,
        @InjectRepository(Keyword)
        private keywordRepository: Repository<Keyword>,
        @InjectRepository(Stack) private stackRepository: Repository<Stack>
    ) {
        super(Jobpost, dataSource.createEntityManager())
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
                originalAddress,
                addressUpper,
                addressLower,
                longitude,
                latitude,
            } = jobpost

            // 회사 id 들고오는 쿼리
            const companyId = await this.companyRepository.findCompanyId(
                companyName
            )

            const { keywords, stacks } = await this.keywordParser(
                title,
                content
            )

            const createdJobpost = await this.createQueryBuilder('jobpost')
                .insert()
                .into('jobpost')
                .values({
                    companyId,
                    title,
                    content,
                    salary,
                    originalSiteName,
                    originalUrl,
                    originalImgUrl,
                    postedDtm,
                    deadlineDtm,
                    originalAddress,
                    addressUpper,
                    addressLower,
                    longitude,
                    latitude,
                })
                .orUpdate(
                    ['salary', 'original_img_url', 'deadline_dtm'],
                    ['company_id', 'title']
                )
                .updateEntity(false)
                .execute()

            if (
                createdJobpost.raw.insertId !== 0 &&
                createdJobpost.raw.affectedRows === 1
            ) {
                await this.createQueryBuilder()
                    .relation(Jobpost, 'keywords')
                    .of({ jobpostId: createdJobpost.raw.insertId })
                    .add(keywords)

                await this.createQueryBuilder()
                    .relation(Jobpost, 'stacks')
                    .of({ jobpostId: createdJobpost.raw.insertId })
                    .add(stacks)
            }
        }
    }

    async keywordParser(title: string, content: string | object) {
        const contentKeywords = []
        const contentStacks = []

        if (typeof content === 'object') content = JSON.stringify(content)
        content = title + ' ' + content

        for (let i = 0; i < keywords.length; i++) {
            if (keywords[i].excludes) {
                for (let k = 0; k < keywords[i].excludes.length; k++) {
                    content = content.replaceAll(keywords[i].excludes[k], '')
                }
            }

            for (let j = 0; j < keywords[i].keyword.length; j++) {
                const re = new RegExp(`${keywords[i].keyword[j]}`, 'gi')
                if (re.test(content)) {
                    const keyword = await this.keywordRepository.findOne({
                        where: { keywordCode: keywords[i].keywordCode },
                    })
                    contentKeywords.push(keyword)
                    break
                }
            }
        }

        for (let i = 0; i < stacks.length; i++) {
            for (let j = 0; j < stacks[i].stack.length; j++) {
                if (stacks[i].excludes) {
                    for (let k = 0; k < stacks[i].excludes.length; k++) {
                        content = content.replaceAll(stacks[i].excludes[k], '')
                    }
                }

                const regExVar = stacks[i].stack[j].replace(
                    /[.*+?^${}()|[\]\\]/g,
                    '\\$&'
                )
                const re = new RegExp(`\\b${regExVar}\\b`, 'gi')
                if (re.test(content)) {
                    const stack = await this.stackRepository.findOne({
                        where: { stack: stacks[i].stack[0] },
                    })
                    if (stack === null) console.warn(stacks[i])
                    contentStacks.push(stack)
                    break
                }
            }
        }

        return { keywords: contentKeywords, stacks: contentStacks }
    }

    async getFilteredJobposts(
        sort: string,
        order: string,
        limit: number,
        offset: number,
        others: object
    ) {
        let where = ''
        let having = ''
        switch (sort) {
            case 'recent':
                sort = `j.updated_dtm ${order}`
                break
            case 'popular':
                sort = `likesCount ${order}, views ${order}`
                break
            case 'ending':
                if (order === 'asc') {
                    sort = `deadline_dtm ${order}`
                    where = 'where deadline_dtm is not null'
                    break
                } else {
                    sort = `deadline_dtm ${order}`
                    break
                }
            default:
                sort = `j.updated_dtm ${order}`
        }

        if (others) {
            const othersKeys = Object.keys(others)
            for (let i = 0; i < othersKeys.length; i++) {
                if (othersKeys[i] === 'stack') {
                    const stacks = others[othersKeys[i]].split(',')
                    for (let j = 0; j < stacks.length; j++) {
                        if (having.length === 0) {
                            having += `having stacks like '%${stacks[j]}%'`
                        } else {
                            having += ` and stacks like '%${stacks[j]}%'`
                        }
                    }
                } else if (othersKeys[i] === 'keywordCode') {
                    const keywordCodes = others[othersKeys[i]].split(',')
                    for (let j = 0; j < keywordCodes.length; j++) {
                        if (having.length === 0) {
                            having += `having keywordCodes like '%${keywordCodes[j]}%'`
                        } else {
                            having += ` and keywordCodes like '%${keywordCodes[j]}%'`
                        }
                    }
                } else if (othersKeys[i] === 'search') {
                    const searchWords = others[othersKeys[i]].split(' ')
                    for (let j = 0; j < searchWords.length; j++) {
                        if (where.length === 0) {
                            where += `where company_name like '%${searchWords[j]}%'
                            or title like '%${searchWords[j]}%'
                            or keywords like '%${searchWords[j]}%'
                            or stacks like '%${searchWords[j]}%'
                            or address_upper like '%${searchWords[j]}%'
                            or address_lower like '%${searchWords[j]}%'
                            or content like '%${searchWords[j]}%'`
                        } else {
                            where += ` and company_name like '%${searchWords[j]}%'
                            or title like '%${searchWords[j]}%'
                            or keywords like '%${searchWords[j]}%'
                            or stacks like '%${searchWords[j]}%'
                            or address_upper like '%${searchWords[j]}%'
                            or address_lower like '%${searchWords[j]}%'
                            or content like '%${searchWords[j]}%'`
                        }
                    }
                } else if (othersKeys[i] === 'page') {
                    offset = (Number(others['page']) - 1) * limit
                } else {
                    if (where.length === 0) {
                        where += `where ${othersKeys[i]}='${
                            others[othersKeys[i]]
                        }'`
                    } else {
                        where += ` and ${othersKeys[i]}='${
                            others[othersKeys[i]]
                        }'`
                    }
                }
            }
        }

        let query = `select j.jobpost_id, company_name, original_img_url, title, keywords, keywordCodes, stacks, stackimgurls, likesCount, likedUsers, views, deadline_dtm, address_upper, address_lower from jobpost j 
                        left join (select jobpost_id, j.keyword_code, group_concat(j.keyword_code) as keywordCodes ,group_concat(keyword) as keywords from jobpostkeyword j 
                        left join keyword k on j.keyword_code = k.keyword_code 
                        group by j.jobpost_id) j2 on j.jobpost_id = j2.jobpost_id
                        left join (select jobpost_id, group_concat(stack) as stacks, group_concat(stack_img_url) as stackImgUrls from jobpoststack j 
                        left join stack s on j.stack_id = s.stack_id  
                        group by j.jobpost_id) j3 on j.jobpost_id = j3.jobpost_id
                        left join company c on j.company_id = c.company_id 
                        left join (select j.jobpost_id, count(user_id) as likesCount, group_concat(user_id) as likedUsers from jobfit.jobpost j 
                        left join jobfit.likedjobpost l on j.jobpost_id = l.jobpost_id
                        group by j.jobpost_id) l on j.jobpost_id = l.jobpost_id ${where}
                        ${having}
                        order by ${sort}
                        limit ? offset ?`

        const values = [limit, offset]

        const data = await this.query(query, values)

        query = `select count(*) as totalCount
        from (select keywordCodes, stacks from jobpost j 
            left join (select jobpost_id, j.keyword_code, group_concat(j.keyword_code) as keywordCodes ,group_concat(keyword) as keywords from jobpostkeyword j 
            left join keyword k on j.keyword_code = k.keyword_code 
            group by j.jobpost_id) j2 on j.jobpost_id = j2.jobpost_id
            left join (select jobpost_id, group_concat(stack) as stacks, group_concat(stack_img_url) as stackImgUrls from jobpoststack j 
            left join stack s on j.stack_id = s.stack_id  
            group by j.jobpost_id) j3 on j.jobpost_id = j3.jobpost_id
            left join company c on j.company_id = c.company_id 
            left join (select j.jobpost_id, count(user_id) as likesCount, group_concat(user_id) as likedUsers from jobfit.jobpost j 
            left join jobfit.likedjobpost l on j.jobpost_id = l.jobpost_id
            group by j.jobpost_id) l on j.jobpost_id = l.jobpost_id ${where}
            ${having}
            order by ${sort}) as results`

        const totalCount = await this.query(query, values)

        return { data, totalCount: Number(totalCount[0].totalCount) }
    }

    async getAddresses() {
        const addressUpper = await this.query(`select address_upper
                                                from jobpost j
                                                where address_upper is not null
                                                group by address_upper 
                                                order by address_upper asc`)

        const addressLower = await this
            .query(`select address_upper, address_lower
                    from jobpost j 
                    where address_lower is not null and address_upper is not null
                    group by address_lower 
                    order by address_upper asc, address_lower asc`)

        return { addressUpper, addressLower }
    }

    async getStacks() {
        return await this.query(`select j2.stack, j2.category
                                from jobpost j
                                left join (select j.stack_id, j.jobpost_id, stack, category
                                from jobpoststack j 
                                left join stack s on j.stack_id = s.stack_id) j2 on j.jobpost_id = j2.jobpost_id
                                where j2.stack is not null
                                group by j2.stack
                                order by j2.category asc, j2.stack asc`)
    }

    async getKeywords() {
        return await this
            .query(`select jobpost_id, j.keyword_code, keyword from jobpostkeyword j 
                    left join keyword k on j.keyword_code = k.keyword_code 
                    group by keyword_code
                    order by keyword asc`)
    }

    async postLike(userId: number, jobpostId: number) {
        const like = await this.find({
            relations: ['users'],
            where: {
                jobpostId: jobpostId,
            },
        })
        let query = 'insert'
        like[0]?.users.forEach((user) => {
            if (user.userId == userId) {
                query = 'delete'
            }
        })
        if (query === 'insert') {
            query += ` into likedjobpost(jobpost_id, user_id) values (?, ?)`
        } else {
            query += ` from likedjobpost where jobpost_id = ? and user_id=  ?`
        }
        const values = [jobpostId, userId]
        try {
            await this.query(query, values)
            return 'success'
        } catch (err) {
            console.log(err)
            return 'fail'
        }
    }

    // 채용공고 상세정보
    async getJobpostDetail(jobpostId: number) {
        try {
            return await this.createQueryBuilder('jobpost')
                .leftJoinAndSelect('jobpost.company', 'company')
                .leftJoinAndSelect('jobpost.keywords', 'keyword')
                .leftJoinAndSelect('jobpost.stacks', 'stack')
                .where('jobpost.jobpost_id = :jobpostId', { jobpostId })
                .getOne()
        } catch (error) {
            return { message: '상세정보를 불러올 수 없습니다.' }
        }
    }
}

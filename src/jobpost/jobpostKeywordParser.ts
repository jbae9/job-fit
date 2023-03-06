// const keywords = require('./keywordsForParsing.json')
// const stacks = require('./stacksForParsing.json')
import { default as keywords } from '../resources/data/parsing/keywordsForParsing.json'
import { default as stacks } from '../resources/data/parsing/stacksForParsing.json'

export async function jobpostKeywordParser(
    title: string,
    content: string | object
) {
    const contentKeywords = []
    const contentStacks = []

    if (typeof content === 'object') content = JSON.stringify(content)
    content = title + ' ' + content
    // content = content.replace(/\s/g, '')
    // content = content.toLowerCase()

    for (let i = 0; i < keywords.length; i++) {
        if (keywords[i].excludes) {
            for (let k = 0; k < keywords[i].excludes.length; k++) {
                content = content.replaceAll(keywords[i].excludes[k], '')
            }
        }

        for (let j = 0; j < keywords[i].keyword.length; j++) {
            if (content.includes(keywords[i].keyword[j])) {
                contentKeywords.push({
                    keyword: keywords[i].keyword[j],
                    keywordCode: keywords[i].keywordCode,
                })
                break
            }
        }
    }

    for (let i = 0; i < stacks.length; i++) {
        for (let j = 0; j < stacks[i].stack.length; j++) {
            if (
                content.includes(stacks[i].stack[j]) ||
                content.includes(stacks[i].stack[j].toUpperCase())
            ) {
                contentStacks.push({
                    stack: stacks[i].stack[j],
                    category: stacks[i].category,
                })
            }
        }
    }

    return { keywords: contentKeywords, stacks: contentStacks }
}

// jobpostKeywordParser(
//     '연구소 오디오 워터마크 및 플러그인 연구 개발직',
//     {
//         requirements:
//             '• Java(Kotlin) & Spring Framework 기반 웹 서버 개발 경력 7년 이상\n• ORM (JPA, Hibernate)기반 개발 역량을 보유하신 분\n• 대규모 서비스 설계, 구축, 운영 경험이 있으신 분\n• 다양한 Stakeholder, 개발자와 함께 복잡한 비즈니스 요구사항을 풀어내며 적극적이고 원활한 커뮤니케이션이 가능하신 분',
//         main_tasks:
//             '[‍마이리얼트립 제품 개발 조직은 이렇게 일합니다.]\n\n마이리얼트립은 고객과 데이터를 중심의 최고의 여행 서비스를 개발합니다. \n\n전 세계의 항공, 숙박, 교통, 투어&액티비티 상품들을 효과적으로 관리하고, 서로 다른 상품들의 경험을 통일하여 쉽고, 편리한 탐색/예약/구매 경험을 제공하기 위해 노력합니다. 최고 수준의 기술로 기존에 존재하지 않는 새로운 여행 경험을 제시하고자 합니다.\n\n• 데이터를 기반으로 고객에게 최상의 임팩트를 제공하기 위해 모든 구성원이 함께 치열하게 고민합니다. 데이터를 기반으로 문제를 정의하고, 제품/사업/운영 조직이 함께 해결책을 모색합니다. 모든 조직이 최상의 결과물을 얻기 위해 치열하게 도전합니다.\n\n• 고객의 소리에 집중합니다. 우리가 고객이 가지고 있는 문제에 집중하며, 그 문제를 단순히 풀어내는 것이 아니라, 10배, 100배 더 잘 풀어내기 위해 끊임없이 고민합니다.\n\n• 상호존중과 신뢰를 기반으로 함께 성장합니다. 나이/연차와 무관한 강한 책임감을 가지고 각자 맡은 업무를 주도적으로 진행하며, 동료들과 더 나은 서비스를 위하여 자유롭게 의견을 개진합니다. 그리고 경쟁이 아닌 함께 성장하는 문화를 만들어가고자 합니다.\n\n\n[마이리얼트립의 미들레이어 개발 팀장은 이런 일을 해요.]\n\n미들레이어 개발팀은 MSA로 세분화된 여러 버티컬(투어&액티비티, 숙박, 교통, 항공, 커뮤니티 등)의 상품과 컨텐츠를 취합하여 서비스하고 있습니다.\n\n메인홈, 도시홈과 같은 중요 진입점을 담당하면서 보다 안정적이고 빠른 서비스를 제공하는 것을 목표로 하고 있습니다. \n\n또한 모바일 앱 배포 없이 유연한 서비스 적용을 위하여 Server Driven UI 를 도입하고 있습니다.\n\n앞으로 담당할 주요 업무는 아래와 같습니다.\n\n• 메인홈, 도시홈과 같은 중요 진입점 페이지 개발 & 운영\n• Server Driven UI 를 위한 프레임웍과 운영툴 개발\n• 팀원들의 성장을 돕는 People management와 채용에 적극적으로 참여',
//         intro: 'The North Star\n“Travel Everyday” 마이리얼트립은 누구나 여행의 즐거움을 더 자주 느낄 수 있는 세상을 만들어 가고 있습니다. 미션을 향해 거침없이 도전하는 팀과 함께 여행의 새로운 패러다임을 만들어 보세요.\n\n마이리얼트립은 여행을 떠나기 위해 필요한 모든 것을 한 곳에서 검색하고 예약할 수 있는 국내 최고의 Travel Super App입니다.\n\n2012년 가이드 투어 서비스를 시작으로 2016년 숙박, 2018년 항공, 2019년 패키지까지 출시하며 여행에 필요한 모든 경험을 고객에게 제공하고 있습니다. 마이리얼트립은 차별화된 기술을 바탕으로 새로운 여행 방식을 만들어가고, 코로나 시대 이후의 여행을 준비하고 있습니다.\n\n마이리얼트립은 2018년 거래액 1,300억 원, 2019년 3,600억 원을 달성해 매년 300%씩 고속 성장을 지속해왔습니다. 또한 이러한 성과를 바탕으로 알토스벤처스,스마일게이트인베스트먼트,IMM인베스트먼트와 같은 국내외 유수의 투자사로부터 누적 총 824억 원의 자금을 유치했습니다.\n\n마이리얼트립 팀과 함께 여행의 미래를 그려나갈 분들을 모십니다.\n\n- 마이리얼트립의 플랫폼 전략 : https://bit.ly/30MxgiW\n- 마이리얼트립 국내 사업 피버팅 전략 : https://bit.ly/3cPtmh8\n\n* 채용공통사항\n[채용절차]\n- 서류전형 ＞ 1차 면접 ＞ 2차 면접 ＞ 처우협의 ＞ 입사\n- 기술 면접 진행 전 면접관의 판단에 따라 전화 인터뷰 혹은 온라인 코딩테스트 절차가 추가될 수 있습니다.\n- 기술 면접은 지원분야 기술 Stack 관련 질문으로 진행됩니다.\n- 각 전형별 결과는 15일 이내에 안내 드립니다.\n\n[지원서류]\n마이리얼트립은 별도의 정해진 양식 없이 자유형식의 지원서를 받고 있습니다. 지원하신 직무에 본인의 강점이 잘 드러날 수 있도록 자유롭게 작성해 주세요.\n \n＜지원서 작성 Tip＞\n- 지원하시는 직무의 주요 업무와 자격 요건에 부합하는 직무 경험과 성과가 잘 드러나도록 작성해주세요.\n- 개발 직무의 경우, 지원서 상에 수행하신 프로젝트 별 기술 스택을 잘 기재해 주시기 바랍니다.\n- 지원서 내에 본인의 강점이 잘 드러나는 웹 링크(깃허브, 노션, 구글드라이브 등)은 자유롭게 첨부해주세요. (접근 권한은 오픈한 상태로 공유해주세요.)\n- 직무와 무관한 개인정보(주민번호, 가족사항, 신체사항, 연봉 정보 등)는 제외해 주세요.\n- 문서 형식은 PDF 파일로 제출해주세요.\n\n[근무환경] \n- 근무형태 : 정규직 (수습기간 3개월 후 정규직 전환 심사)\n- 근무시간 : 주5일 (월~금)\n- 근무제도 : 자율출퇴근제, 재택근무제\n- 근무지 : 서울시 서초구 강남대로 311 드림플러스 강남\n\n마이리얼트립이 일하는 방법 (http://www.wanted.co.kr/events/21_10_s01_b02)',
//         benefits:
//             '- 여행상품 지원 (마이리얼트립 포인트 - 연 150만원, 지인쿠폰 월 5만원)\n- 다양한 휴가제도 (생일 반차, 가족행사 휴가 2일, 경조사 휴가 등)\n- 자기계발비 지원 (체력단련, 도서구매, 문화생활 - 연 180만원)\n- 직무교육비 지원 (직무 관련 강의, 컨퍼런스 - 교육비 80% 지원)\n- 점심 식비 지원\n- 업무장비 지원 (직군 별 최신 장비 제공)\n- 건강검진 지원 (연 1회)\n- 실손보험 제공 (본인 포함 4인)\n- 워크샵 운영 (연 1회)',
//         preferred_points:
//             '• 특정 도메인을 담당하는 개발팀을 리딩/매니징한 경험\n• MSA(Microservice Architecture), EDA(Event Driven Architecture) 개발 경험\n• 모바일 앱 개발 경험 또는 모바일 아키텍처를 이해하고 협업한 경험\n• 조직의 기술과 문화를 지속해서 높여나가기 위한 활동 경험',
//     },
//     1
// )

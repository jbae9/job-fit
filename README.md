# 잡핏 (jobfit)
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://github.com/jbae9/job-fit/blob/main/src/public/images/logo.png" width="423" height="204" alt="Nest Logo" 
/></a>

<p dir="auto"><br><br></p>

<h2>👉🏻 프로젝트 소개</h2>
- IT 채용 공고를 쉽게 보고, 찾고, 추천 받을 수 있는 사이트

<p dir="auto"></p>

> Jobfit 팀 노션 Click! [https://www.notion.so/JobFit-7dc48ce92bb94a6d9cb5db185484483b]

> Jobfit 이용해보기 Click! [http://jobfit.ap-northeast-2.elasticbeanstalk.com/]

![image](https://user-images.githubusercontent.com/77329973/227474359-b7436e4c-f627-465d-9af7-4c68b5601e2e.png)

<p dir="auto"><br><br></p>

<h2> 👏 프로젝트 참여 인원 </h2>
<table border="3">
  <tbody><tr align="center">
  </tr>
  <tr align="center">
  <td width="300">배진영</td>
  <td width="300">길재형</td>
  <td width="300">박현민</td>
  </tr>
  <tr>
    <td>
      <p align="center" dir="auto">
        <img src="https://file.notion.so/f/s/346203ae-d16a-4ed6-877d-635642c30861/KakaoTalk_20230324_1620207421.jpg?id=97ee8c19-11af-4f53-b3a1-15abba3ba7a8&table=block&spaceId=054b625d-d544-461f-9383-d28f4efa5786&expirationTimestamp=1680083993261&signature=KIG3pEqloHhEfmoRnDGAQd6Z3ZtMQQ52xiTcC-I1Y5U&downloadName=KakaoTalk_20230324_1620207421.jpg" width="150" style="max-width: 100%;">
      </p>
    </td>
    <td>
      <p align="center" dir="auto">
        <img src="https://file.notion.so/f/s/628d6b63-ad6d-44e4-b9f8-321483df2fb5/KakaoTalk_20230324_190940484.jpg?id=5f0e485c-a3ca-4e6f-90bc-56dce1c054c4&table=block&spaceId=054b625d-d544-461f-9383-d28f4efa5786&expirationTimestamp=1680084065694&signature=eTv_C8ZXeOQ_9hLVSLzBoOp7GT8IDdwdrsEz6GPi0_8&downloadName=KakaoTalk_20230324_190940484.jpg" width="150" style="max-width: 100%;">
      </p>
    </td>
    <td>
      <p align="center" dir="auto">
        <img src="https://file.notion.so/f/s/3362e4f1-6043-41de-a5f0-a122cb1e07b9/KakaoTalk_20221014_180701326.jpg?id=4cfc1982-87f3-4501-a543-d9d32ca03f5f&table=block&spaceId=054b625d-d544-461f-9383-d28f4efa5786&expirationTimestamp=1680084186976&signature=KBBqN9WeT_yMf9itK0qiPjlIYh3_Y8Dw0-CCdt2jTNE&downloadName=KakaoTalk_20221014_180701326.jpg" width="150" style="max-width: 100%;">
      </p>
    </td>
  </tr>
  <tr align="center">
    <td>
      <a href="https://github.com/jbae9">
        @진영
      </a>
    </td>
    <td>
      <a href="https://github.com/Mrgil0">
        @재형
      </a>
    </td>
    <td>
      <a href="https://github.com/ParkAsher">
        @현민
      </a>
    </td>
  </tr>
  <tr align="center">
    <td>
      '원티드' 스크레이핑 <br>
      공고의 키워드와 기술스택 파싱 <br>
      공고 추천 알고리즘 <br>
      공고 기준별로 불러오기 <br>
      공고 검색 기능 <br>
    </td>
    <td>
    '사람인' 스크레이핑 <br>
    키워드와 기술스택 검색 기능 <br>
    채용공고 조회수 기능 <br>
    채용공고 찜과 찜 취소 <br>
    </td>
    <td>
      '프로그래머스' 스크레이핑<br>
      카카오 소셜 로그인<br>
      Refresh token 인증<br>
      채용공고 찜, 찜 취소 기능 캐싱 적용<br>
      회원 기술 스택과 주소 등록<br>
      채용공고 상세 조회 <br>
    </td>
  </tr>
</tbody></table>

<p dir="auto"><br><br></p>

<h2 tabindex="-1" dir="auto"><a id="user-content--프로젝트-아키텍쳐" class="anchor" aria-hidden="true" href="#-프로젝트-아키텍쳐"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a><g-emoji class="g-emoji" alias="hammer_and_wrench" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/1f6e0.png">🛠</g-emoji> 프로젝트 아키텍쳐</h2>

![image](https://user-images.githubusercontent.com/77329973/227474723-746436b8-762a-4514-a3e5-266f51bbf533.png)

<p dir="auto"><br><br></p>

<h2 tabindex="-1" dir="auto"><a id="user-content--기술-스택" class="anchor" aria-hidden="true" href="#-기술-스택"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a><g-emoji class="g-emoji" alias="gear" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/2699.png">⚙</g-emoji> 기술 스택</h2>
<h3 tabindex="-1" dir="auto"><a id="user-content--frond-end" class="anchor" aria-hidden="true" href="#-frond-end"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a><g-emoji class="g-emoji" alias="heavy_check_mark" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/2714.png">✔</g-emoji> Front-end</h3>
<div dir="auto">
<img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=HTML5&logoColor=white">
<img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=CSS3&logoColor=white">
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=white">
<img src="https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jQuery&logoColor=white">
<img src="https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=Bootstrap&logoColor=white">
<img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=Axios&logoColor=white">
</div>
<h3 tabindex="-1" dir="auto"><a id="user-content--back-end" class="anchor" aria-hidden="true" href="#-back-end"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a><g-emoji class="g-emoji" alias="heavy_check_mark" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/2714.png">✔</g-emoji> Back-end</h3>
<div dir="auto">
<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white">
<img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=NestJS&logoColor=white">
<img src="https://img.shields.io/badge/Typeform-262627?style=for-the-badge&logo=Typeform&logoColor=white">
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white">
<img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=MySQL&logoColor=white">
</div>
<details>
<img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=Axios&logoColor=white">
<img src="https://img.shields.io/badge/Selenium-43B02A?style=for-the-badge&logo=Selenium&logoColor=white">
<img src="https://img.shields.io/badge/cheerio-008DB6?style=for-the-badge&logo=cheerio&logoColor=white">
<summary> 스크레이핑 툴</summary>
</details>
<h3 tabindex="-1" dir="auto"><a id="user-content--back-end" class="anchor" aria-hidden="true" href="#-back-end"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a><g-emoji class="g-emoji" alias="heavy_check_mark" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/2714.png">✔</g-emoji> Database</h3>
<div dir="auto">
<img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=MySQL&logoColor=white">
<img src="https://img.shields.io/badge/Amazon RDS-527FFF?style=for-the-badge&logo=Amazon RDS&logoColor=white">
<img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=Redis&logoColor=white">
</div>
<h3 tabindex="-1" dir="auto"><a id="user-content--dev-tools" class="anchor" aria-hidden="true" href="#-dev-tools"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a><g-emoji class="g-emoji" alias="heavy_check_mark" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/2714.png">✔</g-emoji> Dev tools</h3>
<div dir="auto">
<img src="https://img.shields.io/badge/Amazon EC2-FF9900?style=for-the-badge&logo=Amazon EC2&logoColor=white">
<img src="https://img.shields.io/badge/Amazon CloudWatch-FF4F8B?style=for-the-badge&logo=Amazon CloudWatch&logoColor=white">
<img src="https://img.shields.io/badge/Amazon Elatic Beanstalk-FF9900?style=for-the-badge&logo=Amazon Elatic Beanstalk&logoColor=white">
<img src="https://img.shields.io/badge/Amazon CodePipeline-FF9900?style=for-the-badge&logo=Amazon CodePipeline&logoColor=white">
</div>
<h3 tabindex="-1" dir="auto"><a id="user-content--dev-tools" class="anchor" aria-hidden="true" href="#-dev-tools"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a><g-emoji class="g-emoji" alias="heavy_check_mark" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/2714.png">✔</g-emoji> 협업툴</h3>
<div dir="auto">
<img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=Git&logoColor=white">
<img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=GitHub&logoColor=white">
<img src="https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=Slack&logoColor=white">
<img src="https://img.shields.io/badge/Notion-000000?style=for-the-badge&logo=Notion&logoColor=white">
</div>

<p dir="auto"><br><br></p>

<h2><g-emoji class="g-emoji" alias="memo" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/1f4dd.png">📝</g-emoji>기술적 의사 결정 </h2>

- 웹 프레임워크와 ORM
    - NestJS
        - **NestJS**는 모듈의 의존성 주입을 기반으로 하는 프레임워크로, 컨트롤러, 서비스 간의 **의존성을 관리**하고, 
        
        코드의 **유지 보수**와 **테스트**에 용이하다. 또한, **TypeScript**를 도입하여 개발 시 발생하는 오류들을 사전에 방지할 수 있다.
        
    - TypeORM
        - TypeScript를 지원하여, **타입 체크**를 지원한다. Repository 패턴을 지원하므로 코드를 구조화 하기 편리하다. 
        
        다양한 관계를 지원하고, 관계를 더 쉽게 조작하기 위해 많은 기능을 제공한다.
        
- 크롤링과 스크레이핑 라이브러리
    - Axios
        - Axios는 비동기 HTTP 통신 라이브러리다. API를 접속할 수 있는 Wanted와 프로그래머스 채용 공고에 접속하고 정보를 읽기 위해 사용된다.
    - Cheerio
        - Cheerio는 HTML DOM 파싱 라이브러리다. Axios를 써서 사람인 공고에 접속하고 Cheerio를 사용해서 HTML 요소를 파싱하기 위해 사용된다.
    - Selenium
        - Selenium은 포터블 프레임워크지만 웹 크롤링 라이브러리로 사용할 수 있다. 
        
        브라우저를 직접 실행해서 크롤링을 함으로서 자원을 많이 쓸 수 있고 Axios와 Cheerio 보다 느리다. 
        
        사람인의 공고 상세 페이지는 페이지 렌더가 되고 난 후 스크레이핑을 해야하기 때문에 Selenium을 써야했다.
        
- 캐싱
    - AWS ElastiCache + Redis Engine
        - **Redis**는 **In-Memory** 기반의 데이터 저장소로, 디스크에 데이터를 저장하지 않고 메모리에 저장해 I/O 작업을 수행하지 않으므로 빠른 데이터 처리 속도를 제공한다.
        
        우리 서비스는 많은 채용공고를 사용자에게 제공하는 것이 목적이므로 많은 데이터를 요청하고 읽어야 한다.
        
        특정 조건에 맞는 채용공고와 자주 접근하는 페이지를 예상하여 메모리에 저장하고, **디스크 접근 횟수를 줄이고 조회 속도를 향상**시키기 위해 사용한다.
        
        현재, 30MB 용량을 무료로 제공하는 Redis Cloud 플랫폼을 사용하고 있지만, 추후 배포 단계에 다른 AWS 서비스들과 호환성을 높이기 위해, 
        
        **AWS ElastiCache의 Redis 인스턴스를 사용하는 것을 계획**하고 있다.
        
        - AWS ElastiCache는 Amazon Web Service에서 제공하는 관리형 캐시 서비스다. In-Memory 데이터 저장소를 제공하며, **Redis**와 같은 인기있는 오픈 소스 캐시 엔진을 제공한다.

- 배포
    - AWS Elastic Beanstalk
        - Amazon의 Elastic Beanstalk는 '서비스로서의 플랫폼' (PaaS) 이며 **EC2 인스턴스를 생성**하고 **어플리케이션 배포 자동화**를 할 수 있습니다. 
        
        또한, 유저 트래픽이 높을 때 **인스턴스 자동 scaling**이 가능하고 AWS CloudWatch를 설정해서 **애플리케이션 및 인﻿프라 모니터링**이 가능합니다.
            
       저희가 원하는 여러가지 기능을 한 서비스로 이용할 수 있기 때문에 선택하게 되었습니다.
            

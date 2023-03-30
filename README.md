# 잡핏 (JobFit)
<p align="center">
  <a href="http://jobfit.ap-northeast-2.elasticbeanstalk.com/" target="blank"><img src="https://i.imgur.com/EloNqXK.png"  alt="Nest Logo" 
/></a>

<p dir="auto"><br><br></p>

<h2>👉🏻 프로젝트 소개</h2>
- IT 채용 공고를 쉽게 보고, 찾고, 추천 받을 수 있는 사이트

<p dir="auto"></p>

> Jobfit 팀 노션 Click! [https://wheat-baker-241.notion.site/JobFit-7dc48ce92bb94a6d9cb5db185484483b]

> Jobfit 브로셔 Click! [https://wheat-baker-241.notion.site/IT-6cab1da1841f44ff81b238b6d74a50af]

> Jobfit 이용해보기 Click! [http://jobfit.ap-northeast-2.elasticbeanstalk.com/]


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
        <img src="https://i.imgur.com/XWCRQI0.png" width="150" style="max-width: 100%;">
      </p>
    </td>
    <td>
      <p align="center" dir="auto">
        <img src="https://i.imgur.com/B7572rP.png" width="150" style="max-width: 100%;">
      </p>
    </td>
    <td>
      <p align="center" dir="auto">
        <img src="https://i.imgur.com/vEcbocx.png" width="150" style="max-width: 100%;">
      </p>
    </td>
  </tr>
  <tr align="center">
    <td>
      <a href="https://github.com/jbae9">
        @jbae9
      </a>
    </td>
    <td>
      <a href="https://github.com/Mrgil0">
        @Mrgil0
      </a>
    </td>
    <td>
      <a href="https://github.com/ParkAsher">
        @ParkAsher
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

![image](https://i.imgur.com/uDxoSGo.png)

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
<img src="https://img.shields.io/badge/Typeorm-262627?style=for-the-badge&logo=Typeorm&logoColor=white">
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white">
</div>
<h3 tabindex="-1" dir="auto"><a id="user-content--back-end" class="anchor" aria-hidden="true" href="#-back-end"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a><g-emoji class="g-emoji" alias="heavy_check_mark" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/2714.png">✔</g-emoji> 스크래이핑 툴</h3>
<div dir="auto">
<img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=Axios&logoColor=white">
<img src="https://img.shields.io/badge/Selenium-43B02A?style=for-the-badge&logo=Selenium&logoColor=white">
<img src="https://img.shields.io/badge/cheerio-008DB6?style=for-the-badge&logo=cheerio&logoColor=white">
  </div>
<h3 tabindex="-1" dir="auto"><a id="user-content--back-end" class="anchor" aria-hidden="true" href="#-back-end"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a><g-emoji class="g-emoji" alias="heavy_check_mark" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/2714.png">✔</g-emoji> Database</h3>
<div dir="auto">
<img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=MySQL&logoColor=white">
<img src="https://img.shields.io/badge/Amazon RDS-527FFF?style=for-the-badge&logo=Amazon RDS&logoColor=white">
<img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=Redis&logoColor=white">
</div>
<h3 tabindex="-1" dir="auto"><a id="user-content--dev-tools" class="anchor" aria-hidden="true" href="#-dev-tools"><svg class="octicon octicon-link" viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true"><path d="m7.775 3.275 1.25-1.25a3.5 3.5 0 1 1 4.95 4.95l-2.5 2.5a3.5 3.5 0 0 1-4.95 0 .751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018 1.998 1.998 0 0 0 2.83 0l2.5-2.5a2.002 2.002 0 0 0-2.83-2.83l-1.25 1.25a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042Zm-4.69 9.64a1.998 1.998 0 0 0 2.83 0l1.25-1.25a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042l-1.25 1.25a3.5 3.5 0 1 1-4.95-4.95l2.5-2.5a3.5 3.5 0 0 1 4.95 0 .751.751 0 0 1-.018 1.042.751.751 0 0 1-1.042.018 1.998 1.998 0 0 0-2.83 0l-2.5 2.5a1.998 1.998 0 0 0 0 2.83Z"></path></svg></a><g-emoji class="g-emoji" alias="heavy_check_mark" fallback-src="https://github.githubassets.com/images/icons/emoji/unicode/2714.png">✔</g-emoji> DevOps</h3>
<div dir="auto">
<img src="https://img.shields.io/badge/Amazon EC2-FF9900?style=for-the-badge&logo=Amazon EC2&logoColor=white">
<img src="https://img.shields.io/badge/Amazon CloudWatch-FF4F8B?style=for-the-badge&logo=Amazon CloudWatch&logoColor=white">
<img src="https://img.shields.io/badge/Amazon Elatic Beanstalk-FF9900?style=for-the-badge&logo=Amazon Elatic Beanstalk&logoColor=white">
<img src="https://img.shields.io/badge/Amazon CodePipeline-FF9900?style=for-the-badge&logo=Amazon CodePipeline&logoColor=white">
<img src="https://img.shields.io/badge/AWS ElastiCache-FF9900?style=for-the-badge&logo=AWS ElastiCache&logoColor=white">
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


<table>
<thead>
<tr>
<th align="left"><strong>기술 스택</strong></th>
<th align="left"><strong>사용이유</strong></th>
</tr>
</thead>
<tbody>
<tr>
<td align="left">NestJS</td>
<td align="left">
  <ul>
    <li>
      NestJS는 모듈의 의존성 주입을 기반으로 하는 프레임워크
    </li>
    <li>
      컨트롤러, 서비스 간의 의존성을 관리하고, 코드의 유지 보수와 테스트에 용이
    </li>
    <li>
      TypeScript를 도입하여 개발 시 발생하는 오류들을 사전에 방지
    </li>
    
  </ul>
  </td>
</tr>
<tr>
<td align="left">TypeORM</td>
<td align="left">
   <ul>
    <li> 
      TypeScript를 지원하여, 타입 체크를 지원
    </li>
    <li>
      Repository 패턴을 지원하므로 코드를 구조화 하기 편리
    </li>
    <li>
      다양한 관계를 지원하고, 관계를 더 쉽게 조작하기 위해 많은 기능을 제공
    </li>
  </ul>
 </td>
</tr>
<tr>
<td align="left">Axios</td>
<td align="left">
  <ul>
    <li> 
      비동기 HTTP 통신 라이브러리
    </li>
    <li>
      Wanted와 프로그래머스 채용 공고 API에 접속하고 정보를 읽음
    </li>
  </ul>
 </td>
</tr>
<tr>
<td align="left">Cheerio</td>
<td align="left">
   <ul>
    <li> 
      HTML DOM 파싱 라이브러리
    </li>
    <li>
      Axios를 써서 사람인 공고에 접속하고 Cheerio를 사용해서 HTML 요소를 파싱하기 위해 사용
    </li>
  </ul>
 </td>
</tr>
<tr>
<td align="left">Selenium</td>
<td align="left">
   <ul>
    <li> 
      포터블 프레임워크지만 웹 크롤링 라이브러리로 사용
    </li>
    <li>
      Axios와 Cheerio 보다 느리지만 사람인의 공고 상세 페이지는 페이지 렌더가 되고 난 후 스크레이핑을 해야하기 때문에 Selenium을 사용했다.
    </li>
  </ul>
</td>
</tr>
<tr>
<td align="left">Redis Engine</td>
<td align="left">
   <ul>
    <li> 
      기반의 데이터 저장소로, 디스크에 데이터를 저장하지 않고 메모리에 저장한다.
    </li>
    <li>
       I/O 작업을 수행하지 않으므로 빠른 데이터 처리 속도를 제공
    </li>
     <li>
       조건에 맞는 채용공고와 자주 접근하는 페이지를 예상하여 메모리에 저장하고, 디스크 접근 횟수를 줄이고 조회 속도를 향상시키기 위해 사용
    </li>
  </ul>
</td>
</tr>
<tr>
<td align="left">AWS ElastiCache</td>
<td align="left">
   <ul>
    <li> 
      Amazon Web Service에서 제공하는 관리형 데이터베이스
    </li>
    <li>
       MySQL, PostgreSQL과 같은 인기있는 관계형 데이터베이스 엔진을 제공
    </li>
  </ul>
 </td>
</tr>
<tr>
<td align="left" width="20%">AWS Elastic Beanstalk<br /> AWS EC2 <br /> AWS CloudWatch</td>
<td align="left">
   <ul>
    <li> 
      Amazon의 Elastic Beanstalk는 '서비스로서의 플랫폼' (PaaS)으로 EC2 인스턴스를 생성하고 어플리케이션 배포 자동화를 할 수 있다.
    </li>
    <li>
       유저 트래픽이 높을 때 인스턴스 자동 scaling이 가능
    </li>
     <li>
       AWS CloudWatch를 설정해서 애플리케이션 및 인프라 모니터링이 가능
    </li>
  </ul>
</td>
</tr>
</tbody>
</table>

<h2>🔎 주요 기능</h2>
<details>
  <ul>
    <li>
    PassportStrategy를 이용한 카카오 인증 전략을 구현하여,<br />
카카오 계정으로 회원가입 및 로그인을 할 수 있다.
    </li>
      <image src="https://i.imgur.com/u0rmwPx.png"></image>
  </ul>
  <summary>
    카카오 소셜 로그인
  </summary>
</details>
<details>
  <ul>
    <li>
    로그인 한 회원이 마이 페이지에 접속하여, 회원이 선호하는 기술 스택을 검색하고 추가 할 수 있다. <br />
이 때 선택한 기술 스택들은 채용 공고 추천 알고리즘에 사용 된다.
    </li>
      <image src="https://i.imgur.com/N2HxeCq.png"></image>
  </ul>
  <summary>
    기술 스택 선택
  </summary>
</details>
<details>
  <ul>
    <li>
    채용공고 목록, 상세 페이지에서 채용공고 이미지 우측 상단의  별⭐ 버튼을 누르면 찜 하고 취소를 할 수 있다. <br />
회원이 찜 한 채용 공고는 추천 알고리즘에 사용 된다.
    </li>
      <image src="https://i.imgur.com/e4k4Cpf.png"></image>
  </ul>
  <summary>
    채용 공고 찜 하기 / 찜 취소하기
  </summary>
</details>
<details>
  <ul>
    <li>
    Header 검색창 이용<br />
      <p></p>
    - 입력한 단어를 회사 이름, 키워드 기술 스택, 주소, 공고 제목, 공고 내용 에 매칭 시켜 검색
    </li>
      <image src="https://i.imgur.com/FxHEWrU.png"></image>
  </ul>
  <ul>
    <li>
    필터 이용<br />
      <p></p>
    - 주소, 키워드, 기술 스택을 선택하여 검색
    </li>
      <image src="https://i.imgur.com/sda3dxD.png"></image>
  </ul>
  <summary>
    채용 공고 검색
  </summary>
</details>
<details>
  <ul>
    <li>
    채용 공고 목록에서 제목을 누르면 상세 페이지로 접속 할 수 있다.
    </li>
      <image src="https://i.imgur.com/8SmcCG0.png"></image>
  </ul>
  <summary>
    채용 공고 상세 페이지 확인
  </summary>
</details>
<details>
  <ul>
    <li>
    Axios, Cheerio, Selenium 라이브러리를 사용하여 원티드 / 프로그래머스 / 사람인 채용 공고 리스트를 크롤링
    </li>
    <li>
    NestJS 의 Task Scheduling 기능인 Cron 데코레이터를 이용하여 프로그래머스 채용 공고는 매일 새벽 3시, <br />
    원티드 채용 공고는 매일 새벽 4시, 사람인 채용 공고는 매일 새벽 5시에 크롤링을 하도록 설정
    </li>
  </ul>
  <summary>
    채용 공고 크롤링
  </summary>
</details>
<details>
  <ul>
    <li>
    SQL 쿼리문을 이용해서 추천 점수를 계산
    </li>
    <li>
    <details>
     1. 공고에 기재된 주소와 내 주소의 거리는 두 주소의 경도와 위도를 `Haversine 공식`을 사용해 계산
      
$$
\displaylines{distance =6371*acos(cos(radians(lat_{user}))*cos(radians(lat_{jobpost}))\\\\
  *cos(radians(long_{jobpost})-radians(long_{user}))\\\\
  +sin(radians(lat_{user}))*sin(radians(lat_{jobpost}))\Bigl)}
$$

1. 유저가 등록한 기술스택 중에 공고가 몇 개 일치 되는지 확인
    - 예: 유저가 NestJS, Javascript, Typescript를 등록했는데 공고의 기술스택은 NestJS, Javascript, Java일 때 2개 일치
2. 유저가 찜한 공고의 키워드 중에 다른 공고의 키워드는 몇 개 일치 되는지 확인
    - 예: 유저가 찜한 공고는 1번과 2번이다.
    1번 공고의 키워드는 신입과 IT이고 2번 공고의 키워드는 신입과 QA이다.
    유저가 찜한 공고의 키워드들은 신입, IT와 QA이다.
    
    다른 공고 4번의 키워드는 신입, 계약직, 고졸일 시 1개의 키워드만 일치한다.
3. 추천 요소를 정규화하기 위해서 최대값과 최소값을 구한다
4. 추천 점수를 계산하기 위해 모든 요소를 `Min-Max 정규화`를 한다.

$$
x_{norm} = \frac{x-min(x)}{max(x)-min(x)}
$$

- 주소만 정규화 함수의 결과에서 1을 뺀다. 주소가 가까울 수록 점수가 높아야되기 때문이다.

$$
distance_{norm} = 1-\frac{distance-min(distance)}{max(distance)-min(distance)}
$$

1. 각 요소에 비중을 줘서 추천 점수를 계산한다.

$$
\displaylines{score=0.5*(\frac{stackMatches-min(stackMatches)}{max(stackMatches)-min(stackMatches)})\\\\
  +0.3*(1-\frac{distance-min(distance)}{max(distance)-min(distance)})\\\\
  +0.3*(\frac{keywordMatches-min(keywordMatches)}{max(keywordMatches)-min(keywordMatches)})\\\\
  +0.1*(\frac{salary-min(salary)}{max(salary)-min(salary)}\Bigl)\\\\
  +0.05*(\frac{avgSalary-min(avgSalary)}{max(avgSalary)-min(avgSalary)})}
$$

위 함수의 변수:

- `stackMatches`: 유저의 기술스택이랑 일치하는 수
- `distance`: 유저의 거리와 공고에 기재된 주소의 거리
- `keywordMatches`: 유저의 찜한 공고의 키워드랑 일치하는 수
- `salary`: 공고에 기재된 연봉
- `avgSalary`: 공고를 올린 회사의 평균 연봉
    </details>
    </li>
  </ul>
  <summary>
    공고 추천 알고리즘
  </summary>
</details>


# 잡핏 (jobfit)
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://github.com/jbae9/job-fit/blob/main/src/public/images/logo.png" width="423" height="204" alt="Nest Logo" /></a>
<hr>

## 프로젝트 참여 인원
- 길재형, 배진영, 박현민

## 프로젝트 설명
- IT 채용 공고를 쉽게 보고, 찾고, 추천 받을 수 있는 사이트

> Jobfit 팀 노션 Click! [https://www.notion.so/JobFit-7dc48ce92bb94a6d9cb5db185484483b]

> Jobfit 이용해보기 Click! [http://jobfit.ap-northeast-2.elasticbeanstalk.com/]

![image](https://user-images.githubusercontent.com/77329973/227474359-b7436e4c-f627-465d-9af7-4c68b5601e2e.png)

## 아키텍쳐
![image](https://user-images.githubusercontent.com/77329973/227474723-746436b8-762a-4514-a3e5-266f51bbf533.png)

## 기술스택
- Language
  + Javascript
  + Typescript

- Framework
  + Node.js
  + Nest.js

- Data
  + Mysql
  + Redis
  
- CI/CD
  + AWS Codepipeline
  + AWS beanstalk

- Front
  + ejs


## 기술적 의사 결정:

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
            

## 트러블슈팅

- Axios, Cheerio VS Selenium
    - 사람인 사이트에 대해서:
        - 문제: 
          > 사람인 페이지를 Axios와 Cheerio를 이용하여 목록을 스크랩하고 상세 페이지를 다시 Axios를 통해 로드하는 과정에서 
          >   
          > **빈 값이 출력**
        
        - 해결: 
          > Axios 대신 Selenium으로 스크랩하여 **속도는 느리지만 확실히 스크랩**되도록 변경함
          
    - Wanted 사이트에 대해서:
        - 문제: 
          > 처음에는 Selenium을 이용해서 크롤링을 했지만 Wanted 채용 공고 사이트가 **무한 스크롤**로 구현되어서 
          >    
          > 모든 공고 데이터를 뽑아오기엔 **너무 느림**
       
        - 해결: 
          > Wanted API을 찾아서 **Axios만 이용한 스크레이핑** 속도 개선
        
- 403 (접근 권한 없음) 에러
    - 문제: 
    
        > Wanted 채용공고 사이트를 한 번 크롤링할 때 마다 약 5분만에 1만5천 GET 요청을 보내다 보니 IP가 차단되었다.
    
    - 해결:  
   
        > HTTP Header에서 가짜 유저 에이전트 (접속 통로)와 프록시 서버를 써봤지만 접속하는 IP는 동일해서 여전히 크롤링이 불가했다. 
        >
        > VPN으로 IP을 바꿀 시 사이트 접속이 가능했다. 약 1주일후에 차단이 풀렸다.
        >
        > 다시 차단이 안 되기 위해 Wanted 스크레이핑의 cron job는 트래픽이 적은 새벽에 크롤링하게 설정이 되어있다.
            
- 여러 채용 사이트 크롤링과 중복된 공고 처리 방식
    - 문제: 
    
        > 한 회사가 여러 채용공고 사이트에 같은 공고를 올렸을 경우, 제공되는 데이터의 종류와 양식이 달랐다. 
        >
        > 중복된 채용공고의 경우, 가장 마지막에 크롤링 한 사이트의 데이터로 무분별하게 업데이트 되는 상황이 발생하여, 데이터의 손실이 일어났다.
    - 해결: 
    
        > **채용공고의 제목**과 **회사의 고유번호**를 Unique index값으로 설정하여 중복 체크를 하고 중복인 경우,    
        >  
        > **orUpdate()** 메서드를 사용하여 특정 컬럼에 대한 update동작이 이루어지도록 했다.
            
- 채용공고 좋아요을 Redis를 이용해서 처리
    - 문제: 
   
        > 채용공고 좋아요를 누를 시 추가나 삭제를 동시에 판별 후 Redis에서 처리하는 과정에서 hash 타입을 이용하여 구현했는데 
        >
        > hash 타입은 삭제를 하기 위해 데이터를 다시 들고 와 있는지 확인 후 삭제를 처리하게 되는데 
        >   
        > 이 과정에서 원하는 값을 불러오는 부분이 힘들었고 불필요하게 코드가 길어지게 되었다.    
    - 해결: 
    
        > hash보다 중복된 데이터를 허용 안하는 sets를 이용했고, Redis에는 key 안에 공고 아이디와 유저 아이디를 섞어서 value로 넣고 
        > 
        > **zrem**을 이용해 이미 있는 데이터의 경우 자동으로 삭제가 되게 구현했다.

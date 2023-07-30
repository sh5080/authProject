<div align="center" style="font-size: 12pt;">
  <img alt="Logo" src="https://github.com/YourGitHubUsername/YourRepoName/assets/logo.png" width="800">
  
  <h1>세션, 로그인 비교 프로젝트</h1>
  <img src="https://img.shields.io/badge/2023.07.07~2023.07.14(기획, 구현)-8085CC?style=flat-square&logoColor=white"/>
  <br />
  <img src="https://img.shields.io/badge/진행중(리팩토링)-8085CC?style=flat-square&logoColor=white"/>
  <br />

  <h2>프로젝트 소개</h2>
  <p>
    이 프로젝트는 세션과 토큰을 공부하기 위해 로그인 기능을 구현한 웹 어플리케이션입니다. 
    Express.js를 기반으로 구현되었으며, 사용자의 로그인 상태를 세션과 토큰을 통해 관리합니다. 
    메서드별로 멱등성을 구분하지 않더라도 실질적으로 멱등한지 확인하기 위한 미들웨어를 통해
    POST를 POST답게, GET을 GET답게 구현하기 위한 장치를 마련했습니다.
  </p>
</div>

## 기능 설명

- 세션 / 토큰 로그인 기능
- 세션 기반 로그인 유지
- 토큰 기반 로그인 유지
- 서버 시작 후 첫 미들웨어로 모든 req값을 db에 저장(로그로도 사용 가능),
res보내기 직전 변동사항 체크 후 비교하는 멱등성 미들웨어 구현
- 클라이언트와 통신하여 쿠키 확인 후 팝업 전달 기능


## 기술 스택

|**Tech Stack**|                                                                                                                                      |
| ------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| **Frontend** | <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white"> <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white"> <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black"> |
| **Backend**  |                                                                                                                                                     <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white"> <img src="https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white"> <img src="https://img.shields.io/badge/JWT-00B5E2?style=flat-square&logo=jsonwebtokens&logoColor=white"> <img src="https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white">                                                                                                                |
| **Others**   |                                                                                                                <img src="https://img.shields.io/badge/Git-181717?style=flat-square&logo=git&logoColor=white"> <img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white">                                                                                                                |

## 설치 및 실행 방법

1. 프로젝트 클론

```bash
git clone https://github.com/sh5080/authProject.git
cd authProject
```

2. 환경 변수 설정
```env
KEY=your_secret_key
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
PORT=your_port_number
```

3. 의존성 설치
```bash
yarn install
```

4. 프로젝트 실행
```
yarn start
```

5. 테스트 코드
```
yarn test
```
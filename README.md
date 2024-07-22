### 프로젝트 개요
- 코알누 자바스크립트 온라인 스터디 2기 최종과제  
- 수행기간 : 2024/07/15 ~ 07/21(총 7일)
- 사용자의 현재 위치와 날씨에 어울리는 음악 플레이리스트를 추천
- 사용자에게 아티스트, 앨범 상세 정보 제공
- Spotify API, KakaoMaps API, OpenWeatherAPI 활용

### 배포
- https://js-study-02-spotifywithweather.netlify.app


### 팀원 소개 
#### 정승아(Product Owner)
- 프로젝트 역할 분담 및 진행 과정 총괄
- 사용자의 현재 위치 정보를 실시간으로 보여주는 기능 구현
#### 김성민(Scrum Master)
- 깃허브 리포지토리 생성 및 코드 변경 사항 관리
- 웹 페이지의 기본 골격 정의 및 메인 화면 구성 담당
#### 김보연(Developer)
- 앨범 상세 정보 보여주는 기능 담당
- 스크럼 미팅 회의록 작성
#### 최수안(Developer)
- 특정 아티스트 선택시 아티스트 상세 정보 보여주는 기능 담당
#### 박은선(Devleoper)
- 날씨 정보 바탕으로 플레이리스트 보여주는 기능 담당

### 구현 기능
- 위치 정보 제공
- 곡의 상세 정보
- 아티스트 상세 정보 기능
- 날씨에 맞는 플레이리스트 제공 기능
- 반응형 UI


### 이슈 해결
<details>
<summary>렌더링 문제 </summary>
- 이슈 설명 : 검색 후 다시 검색 기능 실행시 '곡'정보 화면 렌더링이 제대로 되지 않음</br>
- 원인 : trackCountSearchJS 변수가 이전 검색 결과로 인해 초기화되지 않아서 발생</br>
- 해결 : renderSearchResult 함수에서 각 검색 결과를 렌더링하기 전에 trackCountSearchJS를 초기화</br>

```javascript
trackCountSearchJS = 0;
```
</details>



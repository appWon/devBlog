AWS 서비스를 이용하면서 SERVER LESS 구축과 CLOUD FRONT 배포까지 진행하면서 과정과 문제를 기록해 보았다. Aws console 환경에서 구축 후 프로젝트에 적용을 해도 되지만 amplify-cli 를 활용하여 구축을 할 것이다.

> `사용한 기술`
>
> - next
> - react
> - Amplify-cli
> - material-ui
> - @toast-ui

# 1. Amplify setting

```
=="aws-amplify": "^4.3.3"==
amplify init
? Enter a name for the project
=> devBlog
? Enter a name for the environment 
=> dev
? Choose your default editor:
=> Visiual Studio Code
? Choose the type of app that you're building 
=> javascript
? What javascript framework are you using 
=> react
? Source Directory Path:
=> . (aws-exports.js 파일 위치로 인해 .로 설정)
? Distribution Directory Path:
=> out
? Build Command:  
=> npm run-script build
? Start Command:
=> npm run-script start
? Select the authentication method you want to use: 
=> AWS profile
? Please choose the profile you want to use 
default
```

Amplify init 을 하고 나면 `amplify 폴더` `aws-exports.js` 가 생성이 된다. 

가장먼저 `aws-exports.js` 세팅 데이터를 aws-amplify 에서 사용을하기 위해서 설정을해 해준다.

```javascript
# amplifyConfig.js
import Amplify from 'aws-amplify'
import config from './aws-exports'
Amplify.configure({ ...config, ssr: true })

# _app.js
import '../amplifyConfig'
```

위와 같이 세팅 후 불러와주기만 하면 사용할 수 있다. 



# 2. AWS cognito

이번에는 코그니토 서비스를 활용하여 로그인 인증을 구현할 것이다.

```
amplify add auth

Do you want to use the default authentication and security configuration?
=> Default configuration
How do you want users to be able to sign in? 
=> Email
Do you want to configure advanced settings?
=> No, I am done. 
Successfully added auth resource  ~~ ~~

amplify push
```

위와 같이 진행을 하였다면 [코그니토](https://ap-northeast-2.console.aws.amazon.com/)에서 `사용자 풀 관리`에서 `amplify project` 이름으로  새로운 항목이 추가 된것을 볼 수 있을 것이다. 좌측 메뉴에 `사용자 및 그룹` 에 들어가보면 아직 데이터가 없지만 나중에 회원가입을 하면 유저들이 추가가 된다.

## 회원가입

Amplify-cli를 통하여 amplify 서비스를 추가 및 수정을 하면 설정 데이터들이 `aws-exports.js` 에 입력이 된다. 그렇기 때문에 정말 간단하게 서비스 추가 후 간단한 설정으로 서비스를 이용할 수있다.

cognito auth를 추가하면서 자동으로 회원가입 기능도 구현이 되어있다. 활용하기 위해서 간단히 코드를 적어보겠다.

```javascript
import { Auth } from 'aws-amplify';


try {
  const { user } = await Auth.signUp({
    username: '이메일 형태',
    password: '패스워드',
    //attributes: {
    //    email,
    //}
  });
  console.log(user);
} catch (error) {
  console.log('error signing up:', error);
}

```

amplify add auth에서 `How do you want users to be able to sign in? email `  로 구성을 하였기 때문에 `username` 키값에는 e메일 형태로 데이터를 입력을 해야한다.

## 로그인

```javascript
import { Auth } from 'aws-amplify';

try {
	const result = await Auth.signIn('아이디', '패스워드')
	console.log(result)
} catch (err) {
	console.log(err)
}
```

로그인은 매우 간단하다. `signin` 함수에 아이디와 패스워드 파라미더 값을 넣어 주기만하면 하면된다. 그러면 `localstorage` 에 cognito jwt 데이터가 등록이 되면서 `새로고침` 을 했을 경우에 amplify를 사용하여 로그인 데이터를 불러올 수있다

그 외에.. cognito `자격 증명 공급자`를 통해서 소셜 로그인을 구현할 수 있다.

## Google 로그인

[Google 대시보드](https://console.cloud.google.com/apis/dashboard?project=ultra-compound-146808)에서 Cognito 와 연결을 하기 위해서 간단하게 설정이 필요하다. 

0. 코그니토 `앱 통합 - 도메인 이름` 메뉴에서 도메인 설정 후 복사를 한다.
1. `사용자 인증 정보` 메뉴에서 `사용자 인증 정보 만들기` 버튼을 누른다
2. 리스트에서 `OAuth 클라이언트 ID` 을 선택한다.
3. 애플리케이션 유형을   `웹 애플리케이션 ` 선택한다.
4. `승인된 자바스크립트 원본` 입력란에는 0번에서 복사한 도메인을 붙여 넣어 준다.
5. `승인된 리디렉션 URI` 입력란에는 0번에서 복사한 도메인 뒤에 `/oauth2/idpresponse` 을 붙여 입력을 한다.

```
amplify update auth ## 위에 add auth 를 사용하여 구현을 했기 때문에 update 사용한다

What do you want to do? 
=> Apply default configuration with Social Provider (Federation)
What domain name prefix do you want to use?
=> 
Enter your redirect signin URI: 
=> http://localhost:3000/ ## 배포를 했을경우에는 배포 URI
Do you want to add another redirect signin URI(y/n)
=> n
Enter your redirect signout URI: 
=> http://localhost:3000/ ## 배포를 했을경우에는 배포 URI
Do you want to add another redirect signout URI (y/n) 
=> n
Select the identity providers you want to configure for your user pool: (Press <space> to select, <
a> to toggle all, <i> to invert selection)
=> Google

amplify push
```

코그니토 `앱 통합 - 앱클라이언트 설정`   메뉴에 들어가보면 위에 입력한 데이터가 자동으로 입력이 되어있으면 `Google 대시보드` 에서 생성한 설정 데이터를 입력할 차례이다

1. 코그니토 `연동 - 자격 증명 공급자` 메뉴에서 Google을 선택 한다.
2. Google 앱 ID 항목에는 Goole 대시보드의 `클라이언트 ID` 키를 입력한다
3. 앱 보안 항목에는 Goole 대시보드의 `클라이언트 보안 비밀`  키를 입력한다
4. 인증 범위는 prefile email openid 를 입력하였다
5. 코그니토 `앱 통합- 앱 클라이언트 설정` 메뉴에 들어가보면 `활성화된 자격 증명 공급자`에 Google 황목이 추가 되었으면 클릭을 하고 저장한다.

```javascript
# 사용방법
import { Auth } from 'aws-amplify'

 <button onClick={() => Auth.federatedSignIn({provider: 'Google'})}>구글 로그인</button>
```

복잡한 설정 과정 끝에 사용하는 방법은 정말 간단하게 사용할 수 있다. [참고자료](https://docs.amplify.aws/lib/auth/social/q/platform/js/#full-samples)



# 3. AWS Appsync

appsync 서비스를 사용하면 간단하게 데이터 베이스를 활용할 수 있다. aws console을 이용하여 구현을 한다면 `AWS IAM` 부터 시작하여 스키마 구현 그리고 매핑까지 스스로해야한다. 처음에는 아무 생각없이 AWS console 환경에서 구현을 하였지만 `amplify-cli` 을 활용한다면 매우 간단하게 구현할 수있다.

```
amplify add api

? Please select from one of the below mentioned services: (Use arrow keys)
=> GraphQL 
? Provide API name:
=> dev-blog-appsync
? Choose the default authorization type for the API (Use arrow keys)
=> Amazon Cognito User Pool (기존으로 코그니토 설정 추후 다른 권한도 함께 사용가능)
? Do you want to configure advanced settings for the GraphQL API
=> No, I am done.
? Do you have an annotated GraphQL schema?(y/n)
=> n
? Choose a schema template: (Use arrow keys)
=> Single object with fields
```

설정을 하면 `amplify - backend - api 폴더 ` 아래에 schema.graphql 파일이 하나 생성이 된다. 이 파일은 appsync에서 사용할 스키마를 작성 하지만 aws appsync console 과 다른 것은 `디렉티브` 주석? 태그?와 함께 사용하여 특별한 기능을 부여할 수 있다.

```typescript
// schema.graphql
type Post
  @model
  @auth(
    rules: [
      { allow: owner, operations: [create, read, update, delete] }
      { allow: public, provider: iam, operations: [read] }
    ]
  ) {
  id: ID!
  markDown: String!
  title: String!
  createdAt: String!
  description: String
  tags: [String]
}
```

## 디렉티브 (Directives)

>@model : aws dynamodb에 접근하는 CRUD schema를 자동으로 생성을 한다.
>
>@auth : 서비스 접근 제한 및 승인을 할 수 있도록 AWS IAM 을 구현한다.
>
>[디렉티브 더 보기 ](https://docs.amplify.aws/cli/graphql-transformer/directives/) 

```
amplify push

? Do you want to generate code for your newly created GraphQL API
=> yes
? Choose the code generation language target 
=> javascript
? Enter the file name pattern of graphql queries, mutations and subscriptions
=> 엔터
? Do you want to generate/update all possible GraphQL operations - queries, mutations and subscripti
ons
=> y
? Enter maximum statement depth [increase from default if your schema is deeply nested]
=> 2
```

로딩이 끝나면 AWS DynamoDB 와  AWS Appsync 서비스를 사용할 수있다.

그리고 aws appsync console로 확인을 하면 위에  `Post` 라는 이름으로 `type mutation`  에 createPost, updatePost, deletePost `type Query` 에는 getPost, listPost 를 확인할 수있다.  amplify-cli를 활용하지 않았다면 이 모든거를 매핑과 권한 부여까지 일일이 해야했을거다.

## 게시글 등록, 삭제, 수정하기 + 읽기

위의 로딩이 끝나면 프로젝트에서도 폴더와 파일 몇개가 생겼을 것이다. graphql을 활용하기 위해 쿼리를 작성해야 하지만 미리 작성된 파일이 생겼기 때문에 그냥 활용만 하기만하면 된다.

```javascript
// 데이터 읽기
import { API, graphqlOperation } from 'aws-amplify'
import { listPosts } from '../graphql/queries'

//(1)
try {
  const { data } = await API.graphql({
    query: listPosts,
    authMode: 'AWS_IAM',
  })

  setPosts(data.listPosts.items)
} catch (err) {
  console.log('error : ', err)
}

//(2)
try {
  const { data } = await API.graphql(graphqlOperation({ query: listPosts }))

  setPosts(data.listPosts.items)
} catch (err) {
  console.log('error : ', err)
}
```

쿼리를 보내는 방법은 2가지가 있는데 1번째 방법을 선호하고 있다. `schema.graphql` 에서 권한을 부여하면서 스키마를 생성하였는데 2번째 방법을 사용하면 비인증(비 로그인) 유저에게는 접근할 수가 없다. 만약 접근을 원한다면 프로젝트가 렌더링 되었을 경우 amplify.configure 설정에서 따로 `aws_appsync_authenticationType` 권한을 `AWS_IAM`으로 주어야하는 복잡성이 생긴다. 그렇기 때문에 첫 번째 방법을 사용하면 좀더 쉽게 구현할 수있다.

```javascript
// 데이터 쓰기
import { API } from 'aws-amplify'
import { createPost } from '../graphql/mutations'

try{
	const result = await API.graphql({
    query: updatePost,
    variables: {
      input: { ...writeData, id: query.id, markDown: markDown },
    },
    authMode: 'AMAZON_COGNITO_USER_POOLS',
  })
}catch(err){
  console.log(err)
}
```

데이터를 작성하기 위해서는 variables 의 키값에 등록할 데이터를 넣어준다. 그리고 로그인이 되어있다면 cognito identity 권한에 의해서 게시글이 작성이 될것이다.

그 외 수정과 삭제도 위 와 같이 작성하면 된다.

# 4. AWS CloudFront 배포하기

프로젝트가 완성되었다면 배포를 해볼것이다. Aws에도 배포 하는 방법에도 여러가지가 있지만 CloudFront 서비스를 활용하여 배포를 해볼것이다

```
amplify add hosting

? Select the plugin module to execute
=> Amazon CloudFront and S3
? Select the environment setup: 
=> DEV (S3 only with HTTP)
? hosting bucket name 
=> dev-blog
? index doc for the website 
index.html

amplify publish
```

이렇게 진행을 하면 `aws s3` 서비스 버킷안에 프로젝트 빌드가 된다. cloudFront 는 s3에 빌드된 index.html을 기본 루트 객체로 선택이 되어 `캐싱`이 된다. 그리고 cloudFront uri에 접속하면 `캐싱` 된 화면을 뿌려 주게 되는 방식으로 이용이 되고 있다.

cloudFront를 처음 이용했을 때 `설정`에 가격 분류 항목에 `모든 엣지 로케이션에서 사용` 이라는 항목이 체크 되어있어 모든 엣지 로케이션에 캐싱이 된 후 cloudFront URI을 정상적으로 접근을 할 수 있어 불편하였다.
(캐싱 시간이 아주길다 1~2시간)

# AWS Rote 53, AWS Certificate Manager 도메인

프로젝트의 완성은 도메인까지라고 생각한다. AWS Route에 도메인을 구입하려면 비용이 들어 무료 도메인 사이트를 접속하여 잠시 도메인을 대여했다. 도메인 구성을 할때 순서가 좀 이상하지만...

`jjblog.ga` 이게 내가 빌려온 도메인이다.

1. AWS Route 53 - 호스팅 영역 메뉴를 선택 후 `호스팅 영역 생성` 클릭
2. 도메임 이름 `jjblog.ga` 입력 후 `유형` 은 퍼블릭 호스팅 역역 체크 후 `호스팅 영역 생성` 버튼을 클릭
3. 리스트에 내가 `생성한 도메인 이름` 클릭
4. 레코드 탭을 보면 레코드 리스트를 볼 수있다. 그 중 `유형` 항목에 NS 가 있는 데이터를 확인한다.
5. 그 데이터의 `값/트래픽 라우팅 대상` 의 데이터 들을 빌려온 도메인 홈페이에 들어가 `Nameserver 1~4` 에 등록을 한다.
6. 다시 Route 53 으로 돌아와 `레코드 생성` 버튼을 누른다.
7. `레코드 이름` 은 비둬두고 사용할 것이다. 레코드 유형은 `IPv4 주소 일부 ....`항목 클릭, `별칭` 스위치를 눌러 `트래픽 라우팅 대상` 에 CloudFront 배포에 대한별칭을 클릭한다
8. 배포 선택에 cloudFront URI을 http:// 지우고 입력한다 ex)ddln13c1ofz9y.cloudfront.net

![](https://images.velog.io/images/app235/post/fef67dfb-ad96-404f-8d33-0881dd10feac/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202021-10-29%20%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB%208.41.45.png)

9. AWS Certificate Manager 서비스 메뉴 중 `인증서 요청` 클릭
10. 인증서 유형으로 `퍼블릭 인증서 요청` 체크 후 다음 클릭
11. `완전히 정규화된 도메인 이름` 에는 `jjblog.ga`  내가 빌려온 도메인 입력을 한다. 그 후 `검증 방법 선택` 에는 DNS검증-권장 체크 후 요청을 클릭한다. 

여기서 아무리 기다려도 `검증 대기중`에서 안바뀔것이다.  기다리지 말고 다음을 진행 하자!!

12. 내가 생성한 `인증서 ID` 클릭 후 `도메인` 항목을 찾자. 그리고 `Route 53에서 레코드 생성` 이라는 버튼을 찾아서 클릭을 한다.
13. 그리고 `레코드 생성` 버튼을 누르면 잠시 후 검증이 된다.
14. 다시 aws CloudFront 서비스 콘솔로 들어가서, 내가 방금전 배포한 항목에 들어가 `일반` 탭에 있는 편집 버튼을 누른다
15. `대체 도메인 이름` 으로 내가 빌려온 도메인을 입력하고, `사용자 정의 SSL 인증서` 에는 방금전 생성한 SSL인증서를 선택하고 저장하면 좀.. 기다리면 정상적으로 도메인이 바뀐것을 확인 할 수 있을 거다.



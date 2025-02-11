# rutil-vm-front

![favicon](public/favicon.ico)
  
루틸 VM 프론트앤드

![Node.js (`11.0.23`)][shield-nodejs]
![React.js (`18.3.x`)][shield-reactjs]
![Storybook (`8.2.x`)][shield-storybook]

---

## 🚀Quickstart

### 🧰Prerequisite(s)

---

## VSCode 환경 구성

### Extension 설치

- [Better Comments (`aaron-bond.better-comments`)](https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments)
- [CSS Peek (`pranaygp.vscode-css-peek`)](https://marketplace.visualstudio.com/items?itemName=pranaygp.vscode-css-peek)
- [DotENV (`mikestead.dotenv`)](https://marketplace.visualstudio.com/items?itemName=mikestead.dotenv)
- [Elm Emmet (`necinc.elmmet`)](https://marketplace.visualstudio.com/items?itemName=necinc.elmmet)
- [ES7+ React/Redux/React-Native snippets (`dsznajder.es7-react-js-snippets`)](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets)
- [IntelliSense for CSS class names in HTML (`Zignd.html-css-class-completion`)](https://marketplace.visualstudio.com/items?itemName=Zignd.html-css-class-completion)
- [Mithril Emmet (`mithril-emmet`)](https://marketplace.visualstudio.com/items?itemName=mithril-emmet)
- [Path Intellisense (`christian-kohler.path-intellisense`)](https://marketplace.visualstudio.com/items?itemName=christian-kohler.path-intellisense)
- [Prettier - Code formatter (`esbenp.prettier-vscode`)](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [TODO Highlight (`wayou.vscode-todo-highlight`)](https://marketplace.visualstudio.com/items?itemName=wayou.vscode-todo-highlight)
- [Todo Tree (`Gruntfuggly.todo-tree`)](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.todo-tree)

> [!TIP] 
> 
> 일괄 설치
> 
> ```bat
> code --install-extension aaron-bond.better-comments `
> code --install-extension pranaygp.vscode-css-peek `
> code --install-extension mikestead.dotenv `
> code --install-extension necinc.elmmet `
> code --install-extension dsznajder.es7-react-js-snippets `
> code --install-extension Zignd.html-css-class-completion `
> code --install-extension mithril-emmet `
> code --install-extension christian-kohler.path-intellisense `
> code --install-extension esbenp.prettier-vscode `
> code --install-extension wayou.vscode-todo-highlight `
> code --install-extension Gruntfuggly.todo-tree
> ```

## NPM

> [!IMPORTANT] 
> 
> npm이 없을 경우 설치 권고
> 
> ```sh
> npm start  # React 앱 실행
> npm build	 # React 앱 빌드
> ```


### Run in VSCode

- <kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd>입력
- 프롬트 창에 `Tasks: Run Task` 입력
- (실행대상 ovirt서버에 따라) `start-rutil-vm-react` 선택

---

## (로컬용 API 대신) 다른 API를 지정하여 개발할 경우

> [!IMPORTANT]
>
> API에 연결하여 사용 할 경우 proxy 구성에 필요한 조건
>
> 로컬이 아닌 곳일 경우 `package.json` 파일에 
> 아래 내용을 임시로 추가 후 `npm start`
>
> ```json
> {
>   "proxy": "https://192.168.0.70:8443",
> }
> ```

[shield-nodejs]: https://img.shields.io/badge/Node.js-11.0.23-5FA04E?logo=nodedotjs&logoColor=5FA04E&style=flat-square
[shield-reactjs]: https://img.shields.io/badge/React.js-18.3.x-61DAFB?logo=react&logoColor=61DAFB&style=flat-square
[shield-storybook]: https://img.shields.io/badge/Storybook-8.2.x-FF4785?logo=storybook&logoColor=FF4785&style=flat-square

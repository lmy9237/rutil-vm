# rutil-vm-front

![favicon](favicon.ico)
  
Rutil VM 프론트앤드

![Node.js (`11.0.23`)][shield-nodejs]
![React.js (`18.3.x`)][shield-reactjs]
![Storybook (`8.2.x`)][shield-storybook]

---

## 🚀Quickstart

### 🧰Prerequisite(s)

- 🐳Docker
  - `node:18.12.1-alpine`
  - `nginx:alpine`

---

## VSCode 환경 구성

### Extension 설치

- [Better Comments (`aaron-bond.better-comments`)](https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments)
- [CSS Peek (`pranaygp.vscode-css-peek`)](https://marketplace.visualstudio.com/items?itemName=pranaygp.vscode-css-peek)
- [DotENV (`mikestead.dotenv`)](https://marketplace.visualstudio.com/items?itemName=mikestead.dotenv)
- [Elm Emmet (`necinc.elmmet`)](https://marketplace.visualstudio.com/items?itemName=necinc.elmmet)
- [ES7+ React/Redux/React-Native snippets (`dsznajder.es7-react-js-snippets`)](https://marketplace.visualstudio.com/items?itemName=dsznajder.es7-react-js-snippets)
- [ESLint (`dbaeumer.vscode-eslint`)](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [IntelliSense for CSS class names in HTML (`Zignd.html-css-class-completion`)](https://marketplace.visualstudio.com/items?itemName=Zignd.html-css-class-completion)
- [Mithril Emmet (`FallenMax.mithril-emmet`)](https://marketplace.visualstudio.com/items?itemName=FallenMax.mithril-emmet)
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
> code --install-extension dbaeumer.vscode-eslint `
> code --install-extension Zignd.html-css-class-completion `
> code --install-extension FallenMax.mithril-emmet `
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

## 🐳Docker

> [!IMPORTANT]
> 
> 🛠Build
> 
> ```sh
> docker build -t ititcloud/rutil-vm:0.3.4 .
> docker tag ititcloud/rutil-vm:0.3.4 ititcloud/rutil-vm:latest
> ```
> 
> ▶️Run
> 
> *On Linux*
> 
> ```sh
> # rutil-vm
> docker run -d -it --name rutil-vm \
> -e TZ=Asia/Seoul \
> -e LANGUAGE=ko_KR;ko;en_US;en \
> -e LC_ALL=ko_KR.UTF-8 \
> -e LANG=ko_KR.utf8 \
> -e NODE_ENV=production \                                    
> -e __RUTIL_VM_OVIRT_IP_ADDRESS__=192.168.0.70 \             # 백엔드 주소
> -v ./rutil-vm/certs/fullchain.pem:/etc/nginx/certs/fullchain.pem:ro # SSL 인증서 마운트
> -v /etc/pki/ovirt-engine/keys:/etc/pki/ovirt-engine/keys:ro # SSL관련 인증서 마운트
> -p 443:443 \                                                # Port Mapping
> ititcloud/rutil-vm:latest
> ```

> *On Windows*
> 
> ```batch
> :: rutil-vm-api
> docker run -d -it --name rutil-vm ^
> -e TZ=Asia/Seoul ^
> -e LANGUAGE=ko_KR;ko;en_US;en ^
> -e LC_ALL=ko_KR.UTF-8 ^
> -e LANG=ko_KR.utf8 ^
> -e NODE_ENV=production ^
> -e __RUTIL_VM_OVIRT_IP_ADDRESS__=192.168.0.70 ^
> -v ./rutil-vm/certs/fullchain.pem:/etc/nginx/certs/fullchain.pem:ro ^
> -v /etc/pki/ovirt-engine/keys:/etc/pki/ovirt-engine/keys:ro ^
> -p 443:443 ^
> ititcloud/rutil-vm:latest
> ```

[shield-nodejs]: https://img.shields.io/badge/Node.js-18.12.1-5FA04E?logo=nodedotjs&logoColor=5FA04E&style=flat-square
[shield-reactjs]: https://img.shields.io/badge/React.js-18.3.x-61DAFB?logo=react&logoColor=61DAFB&style=flat-square
[shield-storybook]: https://img.shields.io/badge/Storybook-8.2.x-FF4785?logo=storybook&logoColor=FF4785&style=flat-square

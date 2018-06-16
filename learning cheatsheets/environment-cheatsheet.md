## GIT and GITHUB terminal 

- [Git Cheatsheet by Tobias Günther](https://www.git-tower.com/blog/git-cheat-sheet)
- [A successful Git branching model by Vincent Driessen (2010)](https://nvie.com/posts/a-successful-git-branching-model/)


#### Basic workflow : clone, create/edit/remove locally, add, commit and push
  1. **git clone** https://github.com/muniekK/findMySelf.git
  2. cd findMySelf --> touch newfile.html -> **git status** 
  3. **git add . **
  4. **git status**
  5. **git commit** -m "comments"
  6. **git push**
  7. next day: **git pull** -> loop step 2


#### Advance workflow : **Branching** and **Mergin**
  1. **git pull**
  2. **git branch** newFeature
  3. **git checkout** newFeature
  4. update feature > **git status**
  5. **git add . -> git status -> git commit -m "messages" -> git push**
  6. go to github.com -> compare and Pull Request -> create Pull Request
  7. someone with permission will merge if its good
  8. delete the newFeature branch
  9. **git pull**


#### PUBLISH project with github
1. go at github.com/project -> setting -> Github Pages.source {master branch} -> save
2. go back at Github Pages.source and copy the link
3. paste it in website link at the project: project -> edit -> paste in website input

## MARKDOWN

- [Markdown syntax and editor online](https://stackedit.io/app#)
- [chrome extension for markdown preview offline](https://stackoverflow.com/questions/9843609/view-markdown-files-offline) : use to preview before push to github; to confirm the first editor and preview.

## DEVELOPER environment: Windows / visual studio code
- [windows process explorer](https://docs.microsoft.com/en-us/sysinternals/downloads/process-explorer)
- [Visual Studio Code intro and septup by Traversy Media](https://www.youtube.com/watch?v=fnPhJHN0jTE)

  - **File -> preferences -> Settings :**
  "editor.tabSize": 2,
  "editor.wordWrap": "off",
  "editor.detectIndentation": false,
  "terminal.integrated.shell.windows": "C:\\Program Files\\Git\\usr\\bin\\bash.exe",
  "terminal.integrated.shellArgs.windows": ["--login","-i"]

  - [Emmet Cheatsheet](https://docs.emmet.io/cheat-sheet/) : [video by Traversy Media](https://www.youtube.com/watch?v=5BIAdWNcr8Y)
  - Live Server by Ritwick Dey
  - Bracket Pair Colorizer by CoenraadS

#### visual studio code shortcut
- ALT + CLICK: add additional cursor
- CTRL + ALT + DOWN/UP : add cursor below/up
- CTRL + B : toggle sidebar
- CTRL + SPACE : trigger IntelliSense
- F11 : full screen

## Learnings websites
- [The Complete Web Developer in 2018: Zero to Mastery by Andrei Neagoie](https://www.udemy.com/the-complete-web-developer-in-2018/)
- [Traversy Media](https://www.youtube.com/user/TechGuyWeb/playlists)
  - [Node.js & Express From Scratch](https://www.youtube.com/watch?v=k_0ZzvHbNBQ&list=PLillGF-RfqbYRpji8t4SxUkMxfowG4Kqp)

- Jeffrey Way
  - [30 Days to Learn HTML & CSS](https://cosmolearning.org/video-lectures/course-introduction-3/)
  - [30 CSS Selectors You Must Memorize](https://code.tutsplus.com/tutorials/the-30-css-selectors-you-must-memorize--net-16048)
- [front-end-handbook-2018](https://github.com/FrontendMasters/front-end-handbook-2018)

- [simple nodejs in 30min by scott Domes](https://medium.freecodecamp.org/building-a-simple-node-js-api-in-under-30-minutes-a07ea9e390d2)

## Start a project
#### frontend

#### backend
1. [download/install node](https://nodejs.org/en/download/), it has npm included; in the console, type npm -v or node-v to see if its install
2. npm init, to start the project
3. npm install --save express: [expressjs Guide](https://expressjs.com/en/guide/routing.html)
4. npm install -g nodemon
4. create app.js as entry point


- touch .gitignore
  > /node_modules

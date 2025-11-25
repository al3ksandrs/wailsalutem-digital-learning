# WailSalutem Digital Learning
Monorepo setup

Root install:
```
npm install
```

To edit/compile the wiki you need to install MkDocs. Having Python installed is a prerequisite for this.
```
pip install mkdocs
```

To run the wiki locally:
```
npm run wiki
```

Starts local client (http://localhost:5173/) and server (port 3000):
```
npm run dev
```

The terminal shows status and logs of client and server

/common/ is used for shared code between client and server like types and constants or logic in the future

const http = require('http');
const fs = require('fs');
const handlers = require('./src/handlers')
const PORT = 8080;

const myRouter = (path) => {
    const routes = {
        '/': handlers.welcome,
        '/books': handlers.books,
        '/file-viewer': handlers.fileViewer,
        '/server-status': handlers.serverStatus,
    }

    if(routes[path]){
        return routes[path];
    }

    return handlers.notFound;
}

const server = http.createServer(function (request, response) {
    const url = new URL(`http://${request.headers.host}${request.url}`);
    const urlPath = url.pathname;
    const route = myRouter(urlPath);

    response.on('finish', function () {
        const used = process.memoryUsage().heapUsed / 1024 / 1024;
        console.log(`Script used ${used}`);

    });

    return route(request, response);
});

server.listen(PORT, function () {
    console.log(`Server running at http://localhost:${PORT}`);
});


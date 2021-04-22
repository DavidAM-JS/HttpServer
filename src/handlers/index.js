const fs = require('fs');
const http = require('http');
const os = require('os');

const welcome = (request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    const txt = fs.readFileSync('./src/public/welcome.html', 'utf-8');
    response.write(txt);
    response.end();
}

const books = (request, response) => {
    switch (request.method) {
        case 'GET':
            response.writeHead(200, { 'Content-Type': 'text/plain' });
            const txt = fs.readFileSync('./src/public/example.txt', 'utf-8');
            response.write(txt);
            response.end(`\n\nHello from ${request.url} using ${request.method}`);
            break;
        case 'POST':
            let aditionalData = '';
            request.on('data', (chunk) => {
                aditionalData += chunk;
            });
            request.on('end', () => {
                response.writeHead(200, { 'Content-Type': 'application/json' });
                fs.appendFileSync('./src/public/example.txt', `${aditionalData}\n\n`, 'utf-8');
                response.end(`\n\nHello from ${request.url} using ${request.method}`);
            });
            break;
        case 'DELETE':
            response.writeHead(200, { 'Content-Type': 'text/plain' });
            fs.truncateSync('./src/public/example.txt', 0)
            response.end(`\n\nDelete from ${request.url} using ${request.method}`);
            break;
        default:
            break;
    }
}

const fileViewer = (request, response) => {
    const path = new URL(`http://${request.headers.host}${request.url}`);
    const key = path.search.split('=')[0].split('?')[1];
    const param = path.search.split('filename=')[1];
    try {
        const file = fs.readFileSync(`./src/public/${param}`, 'utf-8');
        response.writeHead(200, { 'Content-Type': 'text/plain' });
        response.write(file);
        response.end();
    } catch (error) {
        (key !== 'filename') ? badRequest(request, response) : notFound(request, response);
    }
};

const badRequest = (request, response) => {
    response.writeHead(400, { 'Content-Type': 'text/html' });
    const html = fs.readFileSync('./src/public/400.html', 'utf-8');
    response.write(html);
    response.end();
}

const notFound = (request, response) => {
    response.writeHead(404, { 'Content-Type': 'text/html' });
    const html = fs.readFileSync('./src/public/404.html', 'utf-8');
    response.write(html);
    response.end();
}

const serverStatus = (request, response) => {
    response.writeHead(200, { 'Content-Type': 'application/json' });
    const statusJSON = {
        hostname: os.hostname(),
        cpusAv: os.cpus().length,
        architure: os.arch(),
        uptime: os.uptime(),
        userInfo: os.userInfo(),
        memoryAv: `${os.freemem() / 1024 / 1024} MB`,
    };

    response.write(JSON.stringify(statusJSON));
    response.end();
};

module.exports = {
    books,
    notFound,
    welcome,
    fileViewer,
    serverStatus,
}
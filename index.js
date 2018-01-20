const fs = require('fs');
const URL = require('url');
const http = require('http');
const request = require('request');

const port = 8090;
const homeHTML = fs.readFileSync('./home.html', 'utf-8');

function requestInstance(url, ua) {
	return request({
		url,
		headers: { 'User-Agent': ua }
	})
}

const Server = http.createServer((req, res) => {
	const url = URL.parse(req.url, true);
	if (url.pathname === '/') {
		// 首页
		res.writeHeader('200', { 'Contetn-Type': 'text/html' });
		fs.createReadStream('./home.html').pipe(res);
	} else if (url.pathname === '/bg') {
		// 每日必应壁纸加速
		req.pipe(requestInstance(`https://bing.ioliu.cn/v1?${url.search}`, req.headers['user-agent'])).pipe(res);
	} else {
		// 代理其他请求到 google.com 下
		req.pipe(requestInstance(`https://www.google.com/${url.path}`, req.headers['user-agent'])).pipe(res);
	}
});

Server.listen(port, () => {
	console.log(`Server on port ${port}`);
});

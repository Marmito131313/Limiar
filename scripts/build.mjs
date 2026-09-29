import fs from 'node:fs';
fs.mkdirSync('dist/server',{recursive:true});
fs.writeFileSync('dist/server/index.js',fs.readFileSync('worker/handler.js','utf8')+'\nexport default handler();\n');
fs.copyFileSync('worker/accounts.js','dist/server/accounts.js');
console.log('Worker gerado; assets serão publicados separadamente pela Cloudflare.');

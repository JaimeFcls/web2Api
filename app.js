const https = require('https');

function getMercadoLivreData(searchQuery, callback) {
    const host = 'api.mercadolibre.com';
    const path = `/sites/MLB/search?q=${encodeURIComponent(searchQuery)}`;
    const url = `https://${host}${path}`;

    https.get(url, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            const response = JSON.parse(data);
            callback(response);
        });
    });
}

const server = require('http').createServer((req, res) => {
    const searchQuery = req.url.slice(1); // Obtém o parâmetro de busca a partir da URL do servidor

    if (searchQuery == "") {
        res.setHeader('Content-Type', 'text/plain;charset=utf-8');
        res.end('Nenhum parâmetro de busca fornecido, após o 8000/ digite algo');
        return;
    }

    getMercadoLivreData(searchQuery, (response) => {
        if (response) {
            const firstItem = response.results[0];
            const title = firstItem.title;
            const price = firstItem.price;

            res.setHeader('Content-Type', 'text/plain;charset=utf-8');
            res.end(` Pedido gerado\n\n Produto: ${title}\n Valor: R$ ${price}\n`);
        } else {
            res.setHeader('Content-Type', 'text/plain;charset=utf-8');
            res.end('Erro na requisição');
        }
    });
});

server.listen(8000, () => {
    console.log('Servidor em execução na porta 8000');
});
const {Client} = require('@elastic/elasticsearch');

const elastic = new Client({
    node: process.env.ES_URL,
    auth: {
        username: process.env.ES_USER,
        password: process.env.ES_PASSWORD
    }
});

// 测试连接
elastic
    .ping()
    .then(() => console.log('已成功连接到Elasticsearch'))
    .catch(err => console.error('无法连接到Elasticsearch:', err));

module.exports = elastic;

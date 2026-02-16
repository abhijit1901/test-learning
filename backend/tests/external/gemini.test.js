const nock = require('nock');
const axios = require('axios');

it('mocks external API', async () => {
  nock('https://api.example.com')
    .post('/chat')
    .reply(200, { message: 'mocked' });

  const res = await axios.post('https://api.example.com/chat', {});
  expect(res.data.message).toBe('mocked');
});

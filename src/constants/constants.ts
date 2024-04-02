export default process.env.NODE_ENV !== 'production'
  ? {
      BASE_URL: 'https://api.sgrande.delivery/api/admin/',
      WS_BASE_URL: 'https://socket.sgrande.delivery/admin',
      TOKEN: 'KkAUmBJBpKLI6SMjSYSX8vqkwehE6H5a0D6mfnJiIq3UdRvkxwvtsC0cnmZpgG9Y',
    }
  : {
      BASE_URL: 'http://localhost:8000/api/admin/',
      WS_BASE_URL: 'http://localhost:3333/admin',
      TOKEN: 'KkAUmBJBpKLI6SMjSYSX8vqkwehE6H5a0D6mfnJiIq3UdRvkxwvtsC0cnmZpgG9Y',
    };

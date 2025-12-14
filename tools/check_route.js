const http = require('http');
const url = 'http://localhost:3000/exam/createprova';
http.get(url, (res) => {
  console.log('STATUS', res.statusCode);
  let s='';
  res.on('data', d=> s+=d);
  res.on('end', ()=> {
    console.log('LEN', s.length);
    console.log(s.slice(0,2000));
  });
}).on('error', (e)=>{
  console.error('ERR', e.message);
});

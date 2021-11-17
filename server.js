const http = require('http');
const path = require('path');
const fs = require('fs');
const Koa = require('koa');
const koaBody = require('koa-body');
const koaStatic = require('koa-static');
const uuid = require('uuid');
const app = new Koa();
const fetch = require('node-fetch');
const cors = require('koa2-cors');
const Router = require('koa-router');
const router = new Router();


const RandomTextGenerator = require("random-text-generator");

const faker = require('faker');
faker.locale = "fi";

app.use(cors());

app.use(cors());
app.use(koaBody({
  text: true,
  urlencoded: true,
  multipart: true,
  json: true,
}));

const public = path.join(__dirname, '/public')
app.use(koaStatic(public));

app.use(async (ctx, next) => {
  const origin = ctx.request.get('Origin');
  if (!origin) {
    return await next();
  }

  const headers = { 'Access-Control-Allow-Origin': '*', };

  if (ctx.request.method !== 'OPTIONS') {
    ctx.response.set({ ...headers });
    try {
      return await next();
    } catch (e) {
      e.headers = { ...e.headers, ...headers };
      throw e;
    }
  }

  if (ctx.request.get('Access-Control-Request-Method')) {
    ctx.response.set({
      ...headers,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH',
    });

    if (ctx.request.get('Access-Control-Request-Headers')) {
      ctx.response.set('Access-Control-Allow-Headers', ctx.request.get('Access-Control-Request-Headers'));
    }

    ctx.response.status = 204;
  }
});



//Задача 6.2 из React Life-cycles

const notes = [{ id: 9999, content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam luctus sagittis magna, sit amet rhoncus nunc commodo eget. Aenean vitae ipsum quis lacus volutpat interdum in vel est.' },
{ id: 99999, content: 'Nulla placerat purus in erat pellentesque, ornare pretium nunc auctor. Ut molestie volutpat nibh, vel congue ante commodo porttitor.' }];
let nextId = 1;

router.get('/notes', async (ctx, next) => {
  console.log('get');
  console.log(ctx.request.body);
  ctx.response.body = notes;
});



router.post('/notes', async (ctx, next) => {
  console.log('post');
  console.log(ctx.request.body);
  notes.push({ ...ctx.request.body, id: nextId++ });
  console.log(notes)
  ctx.response.status = 204;
});

router.delete('/notes/:id', async (ctx, next) => {
  console.log('delete');
  console.log(ctx.params.id);
  const noteId = Number(ctx.params.id);
  const index = notes.findIndex(o => o.id === noteId);
  if (index !== -1) {
    notes.splice(index, 1);
  }
  ctx.response.status = 204;
});

//Задача 9.2 из React Router

let posts = [];
let postRouteId = 1;

setInterval(() => {
  //posts.length = 0;
  console.log('-------');
  //posts.push('ok');
}, 60000)



router.get('/posts', async (ctx, next) => {
  console.log('give me posts');
  console.log(posts)
  ctx.response.body = posts;
});

router.post('/posts', async (ctx, next) => {
  console.log('I am giving you post')
  const { id, content } = ctx.request.body;
  if (id !== 0) {
    posts = posts.map(o => o.id !== id ? o : { ...o, content: content });
    ctx.response.status = 204;
    return;
  }

  posts.push({ ...ctx.request.body, id: postRouteId++, created: Date.now() });
  console.log(posts)
  ctx.response.status = 204;
});

router.delete('/posts/:id', async (ctx, next) => {
  console.log('delete post')
  const postId = Number(ctx.params.id);
  const index = posts.findIndex(o => o.id === postId);
  if (index !== -1) {
    posts.splice(index, 1);
  }
  ctx.response.status = 204;
});

//Задача 11.1 из RxJS 

router.get('/messages/unread', async (ctx, next) => {
  console.log(ctx.request.method);
  const respData = {
    "status": "ok",
    "timestamp": new Date().getTime(),
    "messages": [
      {
        "id": uuid.v4(),
        "from": faker.internet.email(),
        "subject": `Hello from ${faker.fake("{{name.lastName}}, {{name.firstName}} {{name.suffix}}")}`,
        "body": faker.lorem.text(),
        "received": new Date().getTime()
      },
      {
        "id": uuid.v4(),
        "from": faker.internet.email(),
        "subject": `Hello from ${faker.fake("{{name.lastName}}, {{name.firstName}} {{name.suffix}}")}`,
        "body": faker.lorem.text(),
        "received": new Date().getTime()
      }
    ]
  }
  ctx.response.body = respData;
});

//Задача 11.2 из RxJS

router.get('/posts/latest', async (ctx, next) => {
  const responsePosts = await fetch('https://jsonplaceholder.typicode.com/posts');
  const resultPosts = await responsePosts.json();
  const arrPosts = resultPosts.filter((item, index) => {
    if (index < 10) return item;
  });
  ctx.response.body = { posts: arrPosts };
});

router.get('/posts/1/comments/latest', async (ctx, next) => {
  const id = ctx.request.path.match(/[0-9]+/)[0];
  const responseComments = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`);
  const resultComments = await responseComments.json();
  const arrComments = resultComments.filter((item, index) => {
    if (index < 3) return item;
  });
  ctx.response.body = { comments: arrComments };
});

router.get('/posts/2/comments/latest', async (ctx, next) => {
  const id = ctx.request.path.match(/[0-9]+/)[0];
  const responseComments = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`);
  const resultComments = await responseComments.json();
  const arrComments = resultComments.filter((item, index) => {
    if (index < 3) return item;
  });
  ctx.response.body = { comments: arrComments };
});

router.get('/posts/3/comments/latest', async (ctx, next) => {
  const id = ctx.request.path.match(/[0-9]+/)[0];
  const responseComments = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`);
  const resultComments = await responseComments.json();
  const arrComments = resultComments.filter((item, index) => {
    if (index < 3) return item;
  });
  ctx.response.body = { comments: arrComments };
});

router.get('/posts/4/comments/latest', async (ctx, next) => {
  const id = ctx.request.path.match(/[0-9]+/)[0];
  const responseComments = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`);
  const resultComments = await responseComments.json();
  const arrComments = resultComments.filter((item, index) => {
    if (index < 3) return item;
  });
  ctx.response.body = { comments: arrComments };
});

router.get('/posts/5/comments/latest', async (ctx, next) => {
  const id = ctx.request.path.match(/[0-9]+/)[0];
  const responseComments = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`);
  const resultComments = await responseComments.json();
  const arrComments = resultComments.filter((item, index) => {
    if (index < 3) return item;
  });
  ctx.response.body = { comments: arrComments };
});

router.get('/posts/6/comments/latest', async (ctx, next) => {
  const id = ctx.request.path.match(/[0-9]+/)[0];
  const responseComments = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`);
  const resultComments = await responseComments.json();
  const arrComments = resultComments.filter((item, index) => {
    if (index < 3) return item;
  });
  ctx.response.body = { comments: arrComments };
});

router.get('/posts/7/comments/latest', async (ctx, next) => {
  const id = ctx.request.path.match(/[0-9]+/)[0];
  const responseComments = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`);
  const resultComments = await responseComments.json();
  const arrComments = resultComments.filter((item, index) => {
    if (index < 3) return item;
  });
  ctx.response.body = { comments: arrComments };
});

router.get('/posts/8/comments/latest', async (ctx, next) => {
  const id = ctx.request.path.match(/[0-9]+/)[0];
  const responseComments = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`);
  const resultComments = await responseComments.json();
  const arrComments = resultComments.filter((item, index) => {
    if (index < 3) return item;
  });
  ctx.response.body = { comments: arrComments };
});

router.get('/posts/9/comments/latest', async (ctx, next) => {
  const id = ctx.request.path.match(/[0-9]+/)[0];
  const responseComments = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`);
  const resultComments = await responseComments.json();
  const arrComments = resultComments.filter((item, index) => {
    if (index < 3) return item;
  });
  ctx.response.body = { comments: arrComments };
});

router.get('/posts/10/comments/latest', async (ctx, next) => {
  const id = ctx.request.path.match(/[0-9]+/)[0];
  const responseComments = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`);
  const resultComments = await responseComments.json();
  const arrComments = resultComments.filter((item, index) => {
    if (index < 3) return item;
  });
  ctx.response.body = { comments: arrComments };
});

router.get('/api/check-email', async (ctx, next) => {
  const { email } = ctx.request.query;

  ctx.response.body = {
    available: email.includes('@') && !email.startsWith('admin')
  }
});




//задача 12.2 из AHJ WORKERS
// const slow = require('koa-slow');
// app.use(slow({
//   delay: 5000
// }));
const news = [
  {
    name: faker.fake("{{name.firstName}}"),
    description: faker.lorem.text(),
    genre: faker.music.genre()
  },
  {
    name: faker.fake("{{name.firstName}}"),
    description: faker.lorem.text(),
    genre: faker.music.genre()
  },
  {
    name: faker.fake("{{name.firstName}}"),
    description: faker.lorem.text(),
    genre: faker.music.genre()
  }
]

router.get('/news', async (ctx, next) => {

  ctx.response.body = news;
});


//Задача 11.1 из RA REDUX-THUNK

let thunkId = 1;
const thunkServices = [
    { id: thunkId++, name: 'Замена стекла', price: 21000, content: 'Стекло оригинал от Apple'},
    { id: thunkId++, name: 'Замена дисплея', price: 25000, content: 'Дисплей оригинал от Foxconn'},
    { id: thunkId++, name: 'Замена аккумулятора', price: 4000, content: 'Новый на 4000 mAh'},
    { id: thunkId++, name: 'Замена микрофона', price: 2500, content: 'Оригинальный от Apple'},
];


function fortune(ctx, body = null, status = 200) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() > 0.25) {
                ctx.response.status = status;
                ctx.response.body = body;
                resolve();
                return;
            }

            reject(new Error('Something bad happened'));
        }, 3 * 1000);
    })
}

router.get('/ra11/api/services', async (ctx, next) => {
    const body = thunkServices.map(o => ({id: o.id, name: o.name, price: o.price}))
    return fortune(ctx, body);
});
router.get('/ra11/api/services/:id', async (ctx, next) => {
    const id = Number(ctx.params.id);
    const index = thunkServices.findIndex(o => o.id === id);
    if (index === -1) {
        const status = 404;
        return fortune(ctx, null, status);
    }
    const body = thunkServices[index];
    return fortune(ctx, body);
});
router.post('/ra11/api/services', async (ctx, next) => {
    const id = ctx.request.body.id;
    console.log(id);
    if (id !== 0) {
        const index = thunkServices.findIndex(o => o.id === id);
        if (index === -1) {
            const status = 404;
            return fortune(ctx, null, status);
        }
        thunkServices[index] = ctx.request.body;
        return fortune(ctx, null, 204);
    }
    
    thunkServices.push({ ...ctx.request.body, id: thunkId++ });
    const status = 204;
    return fortune(ctx, null, status);
});
router.delete('/ra11/api/services/:id', async (ctx, next) => {
    const id = Number(ctx.params.id);
    const index = thunkServices.findIndex(o => o.id === id);
    if (index === -1) {
        const status = 404;
        return fortune(ctx, null, status);
    }
    thunkServices.splice(index, 1);
    const status = 204;
    return fortune(ctx, null, status);
});



//Задача 11.1 из RA REDUX-OBSERVABLE

const skills = [
  { id: nextId++, name: "React" },
  { id: nextId++, name: "Redux" },
  { id: nextId++, name: "Redux Thunk" },
  { id: nextId++, name: "RxJS" },
  { id: nextId++, name: "Redux Observable" },
  { id: nextId++, name: "Redux Saga" },
];

let isEven = true;
router.get('/api/search', async (ctx, next) => {
  if (Math.random() > 0.75) {
      ctx.response.status = 500;
      return;
  }

  const { q } = ctx.request.query;
  console.log(q);

  return new Promise((resolve, reject) => {
    setTimeout(() => {

      const response = skills.filter(o => o.name.toLowerCase().startsWith(q.toLowerCase()))
      ctx.response.body = response;
      resolve();
    }, isEven ? 1 * 1000 : 5 * 1000);
    isEven = !isEven;
  });
});

//Задача 11.2 из RA REDUX-OBSERVABLE

const services = [
  { id: nextId++, name: "React" },
  { id: nextId++, name: "Redux" },
  { id: nextId++, name: "Redux Thunk" },
  { id: nextId++, name: "RxJS" },
  { id: nextId++, name: "Redux Observable" },
  { id: nextId++, name: "Redux Saga" },
];

const servicesDescription = services.map((service) => {
  return { id: service.id, description: faker.lorem.paragraphs(), title: service.name }
});

router.get('/api/search/services', async (ctx, next) => {
  if (Math.random() > 0.75) {
    ctx.response.status = 500;
    return;
  }

  ctx.response.body = services;

});

router.get('/api/search/services/:id', async (ctx, next) => {
  const x = Math.random()
  console.log(x)
  if (x > 0.75) {
    ctx.response.status = 500;
    return;
  }
  const id = ctx.params.id;

  const resp = servicesDescription.filter((item) => {
    if (item.id == id) return item; //id типа string, по этому делаю не глубокое сравнение
  });

  ctx.response.body = resp[0];
});

// Задача 11.3 из RA REDUX-OBSERVABLE

const newsRA = JSON.parse(fs.readFileSync('./news.json')); 
const limit = 5;

function fortune(ctx, body = null, status = 200) {
  return new Promise((resolve, reject) => {
      setTimeout(() => {
          if (Math.random() > 0.3) {
              ctx.response.status = status;
              ctx.response.body = body;
              resolve();
              return;
          }

          reject(new Error('Something bad happened'));
      }, 3 * 1000);
  })
}

router.get('/api/ra/news', async (ctx, next) => {
  const {lastSeenId} = ctx.request.query;
  console.log(lastSeenId);
  if (lastSeenId === undefined) {
      return fortune(ctx, newsRA.slice(0, limit)); 
  }

  const id = Number(lastSeenId);
  if (Number.isNaN(id)) {
      const status = 400;
      return fortune(ctx, null, status);
  }

  const index = newsRA.findIndex(o => o.id === id);
  if (index === -1) {
      const status = 404;
      return fortune(ctx, null, status);
  }

  const body = newsRA.slice(index + 1, index + 1 + limit);
  return fortune(ctx, body);
});


app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback()).listen(port);


/*

const http = require('http');
const Koa = require('koa');
const Router = require('koa-router');
const cors = require('koa2-cors');
const koaBody = require('koa-body');

const app = new Koa();
app.use(cors());
app.use(koaBody({ json: true }));

let nextId = 1;
const services = [
    { id: nextId++, name: 'Замена стекла', price: 21000, content: 'Стекло оригинал от Apple'},
    { id: nextId++, name: 'Замена дисплея', price: 25000, content: 'Дисплей оригинал от Foxconn'},
    { id: nextId++, name: 'Замена аккумулятора', price: 4000, content: 'Новый на 4000 mAh'},
    { id: nextId++, name: 'Замена микрофона', price: 2500, content: 'Оригинальный от Apple'},
];

const router = new Router();

function fortune(ctx, body = null, status = 200) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() > 0.25) {
                ctx.response.status = status;
                ctx.response.body = body;
                resolve();
                return;
            }

            reject(new Error('Something bad happened'));
        }, 3 * 1000);
    })
}

router.get('/api/services', async (ctx, next) => {
    const body = services.map(o => ({id: o.id, name: o.name, price: o.price}))
    return fortune(ctx, body);
});
router.get('/api/services/:id', async (ctx, next) => {
    const id = Number(ctx.params.id);
    const index = services.findIndex(o => o.id === id);
    if (index === -1) {
        const status = 404;
        return fortune(ctx, null, status);
    }
    const body = services[index];
    return fortune(ctx, body);
});
router.post('/api/services', async (ctx, next) => {
    const id = ctx.request.body.id;
    console.log(id)
    if (id !== 0) {
        const index = services.findIndex(o => o.id === id);
        if (index === -1) {
            const status = 404;
            return fortune(ctx, null, status);
        }
        services[index] = ctx.request.body;
        return fortune(ctx, null, 204);
    }
    
    services.push({ ...ctx.request.body, id: nextId++ });
    const status = 204;
    return fortune(ctx, null, status);
});
router.delete('/api/services/:id', async (ctx, next) => {
    const id = Number(ctx.params.id);
    const index = services.findIndex(o => o.id === id);
    if (index === -1) {
        const status = 404;
        return fortune(ctx, null, status);
    }
    services.splice(index, 1);
    const status = 204;
    return fortune(ctx, null, status);
});

app.use(router.routes());
app.use(router.allowedMethods());

const port = process.env.PORT || 8080;
const server = http.createServer(app.callback());
server.listen(port);


{
  "name": "backend",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "prestart": "npm install",
    "start": "forever server.js",
    "server": "nodemon server.js",
    "watch": "forever -w server.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "forever": "^1.0.0",
    "koa": "^2.7.0",
    "koa-body": "^4.1.0",
    "koa-router": "^7.4.0",
    "koa2-cors": "^2.0.6",
    "nanoid": "^2.0.3"
  },
  "devDependencies": {
    "nodemon": "^2.0.15"
  }
}





*/
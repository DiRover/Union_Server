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


const RandomTextGenerator=require("random-text-generator");

const faker = require('faker');
faker.locale = "fi";
/*
app.use(cors());
app.use(koaBody({json: true}));*/

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
    ctx.response.set({...headers});
    try {
      return await next();
    } catch (e) {
      e.headers = {...e.headers, ...headers};
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

const notes = [{id: 9999, content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam luctus sagittis magna, sit amet rhoncus nunc commodo eget. Aenean vitae ipsum quis lacus volutpat interdum in vel est.'},
 {id: 99999, content: 'Nulla placerat purus in erat pellentesque, ornare pretium nunc auctor. Ut molestie volutpat nibh, vel congue ante commodo porttitor.'}];
let nextId = 1;

router.get('/notes', async (ctx, next) => {
    console.log('get');
    console.log(ctx.request.body);
    ctx.response.body = notes;
});



router.post('/notes', async(ctx, next) => {
    console.log('post');
    console.log(ctx.request.body);
    notes.push({...ctx.request.body, id: nextId++});
    console.log(notes)
    ctx.response.status = 204;
});

router.delete('/notes/:id', async(ctx, next) => {
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

router.post('/posts', async(ctx, next) => {
    console.log('I am giving you post')
    const {id, content} = ctx.request.body;
    if (id !== 0) {
        posts = posts.map(o => o.id !== id ? o : {...o, content: content});
        ctx.response.status = 204;
        return;
    }

    posts.push({...ctx.request.body, id: postRouteId++, created: Date.now()});
    console.log(posts)
    ctx.response.status = 204;
});

router.delete('/posts/:id', async(ctx, next) => {
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
  ctx.response.body = {posts: arrPosts};
});

router.get('/posts/1/comments/latest', async (ctx, next) => {
  const id = ctx.request.path.match(/[0-9]+/)[0];
  const responseComments = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`);
  const resultComments = await responseComments.json();
  const arrComments = resultComments.filter((item, index) => {
    if (index < 3) return item;
  });
  ctx.response.body = {comments: arrComments};
});

router.get('/posts/2/comments/latest', async (ctx, next) => {
  const id = ctx.request.path.match(/[0-9]+/)[0];
  const responseComments = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`);
  const resultComments = await responseComments.json();
  const arrComments = resultComments.filter((item, index) => {
    if (index < 3) return item;
  });
  ctx.response.body = {comments: arrComments};
});

router.get('/posts/3/comments/latest', async (ctx, next) => {
  const id = ctx.request.path.match(/[0-9]+/)[0];
  const responseComments = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`);
  const resultComments = await responseComments.json();
  const arrComments = resultComments.filter((item, index) => {
    if (index < 3) return item;
  });
  ctx.response.body = {comments: arrComments};
});

router.get('/posts/4/comments/latest', async (ctx, next) => {
  const id = ctx.request.path.match(/[0-9]+/)[0];
  const responseComments = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`);
  const resultComments = await responseComments.json();
  const arrComments = resultComments.filter((item, index) => {
    if (index < 3) return item;
  });
  ctx.response.body = {comments: arrComments};
});

router.get('/posts/5/comments/latest', async (ctx, next) => {
  const id = ctx.request.path.match(/[0-9]+/)[0];
  const responseComments = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`);
  const resultComments = await responseComments.json();
  const arrComments = resultComments.filter((item, index) => {
    if (index < 3) return item;
  });
  ctx.response.body = {comments: arrComments};
});

router.get('/posts/6/comments/latest', async (ctx, next) => {
  const id = ctx.request.path.match(/[0-9]+/)[0];
  const responseComments = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`);
  const resultComments = await responseComments.json();
  const arrComments = resultComments.filter((item, index) => {
    if (index < 3) return item;
  });
  ctx.response.body = {comments: arrComments};
});

router.get('/posts/7/comments/latest', async (ctx, next) => {
  const id = ctx.request.path.match(/[0-9]+/)[0];
  const responseComments = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`);
  const resultComments = await responseComments.json();
  const arrComments = resultComments.filter((item, index) => {
    if (index < 3) return item;
  });
  ctx.response.body = {comments: arrComments};
});

router.get('/posts/8/comments/latest', async (ctx, next) => {
  const id = ctx.request.path.match(/[0-9]+/)[0];
  const responseComments = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`);
  const resultComments = await responseComments.json();
  const arrComments = resultComments.filter((item, index) => {
    if (index < 3) return item;
  });
  ctx.response.body = {comments: arrComments};
});

router.get('/posts/9/comments/latest', async (ctx, next) => {
  const id = ctx.request.path.match(/[0-9]+/)[0];
  const responseComments = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`);
  const resultComments = await responseComments.json();
  const arrComments = resultComments.filter((item, index) => {
    if (index < 3) return item;
  });
  ctx.response.body = {comments: arrComments};
});

router.get('/posts/10/comments/latest', async (ctx, next) => {
  const id = ctx.request.path.match(/[0-9]+/)[0];
  const responseComments = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}/comments`);
  const resultComments = await responseComments.json();
  const arrComments = resultComments.filter((item, index) => {
    if (index < 3) return item;
  });
  ctx.response.body = {comments: arrComments};
});

router.get('/api/check-email', async (ctx, next) => {
  const { email } = ctx.request.query;

  ctx.response.body = {
    available: email.includes('@') && !email.startsWith('admin')
  }
});




//задача 12.2 из AHJ WORKERS
const slow = require('koa-slow');
app.use(slow({
  delay: 5000
}));
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
    //if (Math.random() > 0.75) {
    //    ctx.response.status = 500;
    //    return;
    //}

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

app.use(router.routes()).use(router.allowedMethods());

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback()).listen(port);

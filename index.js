import express from 'express';
import multer from 'multer';
import cors from 'cors';

import 'dotenv/config';
// validation
import { registerValidation, loginValidation } from './validations/auth.js';
import { postCreateValidation } from './validations/post.js';
// middleware
import checkAuth from './middleware/checkAuth.js';
import handleErrors from './middleware/handleErrors.js';
// controllers
import { login, register, getMe } from './controllers/UserController.js'
import { create, getAll, getOne, remove, update } from './controllers/PostController.js';

const PORT = process.env.PORT || 3001;

const app = express();

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors())
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
    res.send('Hello worfsdfsddsfld1');
});

app.post('/auth/login', loginValidation, handleErrors, login);
app.post('/auth/register', registerValidation, handleErrors, register);
app.get('/auth/me', checkAuth, getMe)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})

app.get('/posts', getAll)
app.get('/posts/:id', getOne)
app.post('/posts', postCreateValidation, handleErrors, checkAuth, create)
app.delete('/posts/:id', checkAuth, remove)
app.patch('/posts/:id', postCreateValidation, handleErrors, checkAuth, update)

app.listen(PORT, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('server OK')
});

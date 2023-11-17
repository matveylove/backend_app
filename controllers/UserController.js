import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';

// prisma-client
import { prisma } from '../prisma/prismaClient.js';
// request
import { getUserByEmail } from '../request/getUserByEmail.js';

export const register = async (req, res) => {
    try {
        const { email, name, password, avatarUrl = '', age = null } = req.body;

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);



        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                avatarUrl,
                age: Number(age),
                name,
            }
        });

        //  Получение последнего зарегестрированного 
        let lastUser = getUserByEmail(email);

        // Создание токена
        const token = jwt.sign(
            {
                id: lastUser.id
            },
            'secret123',
            {
                expiresIn: '30d',
            }
        )

        res.json({
            ...user,
            token
        })
    } catch (err) {
        console.log(err);

        res.status(500).json({
            message: `Не удалось зарегестрироваться`
        })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {

        const user = await prisma.user.findFirst({
            where: {
                email
            }
        })

        if (!user) {
            return res.status(404).json({
                message: 'Неверный логин или пароль'
            })
        }

        const isValidPassword = await bcrypt.compare(password, user.passwordHash);

        if (!isValidPassword) {
            return res.status(400).json({
                message: 'Неверный логин или пароль'
            })
        }

        const token = jwt.sign({ id: user.id }, 'secret123', { expiresIn: '30d' });
        console.log(token)
        res.json({
            ...user,
            token
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось войти в систему'
        })
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                id: req.userId
            }
        });

        console.log(user)
        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            })
        }

        res.send(user)

    } catch (err) {

    }
}
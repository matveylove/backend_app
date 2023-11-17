import { prisma } from "../prisma/prismaClient.js"

export const getAll = async (req, res) => {
    try {

        const posts = await prisma.post.findMany({
            include: {
                author: true
            }
        });
        res.json(posts);
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не получить посты'
        })
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        const posts = await prisma.post.update({
            where: {
                id: postId
            },
            data: {
                viewsCount: {
                    increment: 1
                }
            }
        });

        res.json(posts);
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не получить посты'
        })
    }
}

export const remove = async (req, res) => {

    try {
        const postId = req.params.id;

        const posts = await prisma.post.delete({
            where: {
                id: postId
            }
        });

        res.json({ message: true });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не получилось удалить статью'
        })
    }
}

export const create = async (req, res) => {
    const { title, content, tags, imgUrl = '' } = req.body;
    try {

        const user = await prisma.post.create({
            data: {
                title,
                content,
                tags,
                imgUrl,
                userId: req.userId
            }
        })

        res.json(user);

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось создать пост'
        })
    }
}

export const update = async (req, res) => {
    const { title, content, tags, imgUrl } = req.body;
    console.log(title, content, tags, imgUrl)

    try {
        const postId = req.params.id;
        console.log(postId)

        const post = await prisma.post.update({
            where: {
                id: postId,
            },
            data: {
                title,
                content,
                tags,
                imgUrl,
                userId: req.userId
            }
        })

        res.json({
            message: true
        })
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: 'Не удалось обновить статью'
        })
    }
}
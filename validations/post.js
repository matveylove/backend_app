import { body } from 'express-validator';

export const postCreateValidation = [
    body('title', 'Введите заголовок статьи').isLength({ min: 2 }).isString(),
    body('content', 'Введите текст статьи').isLength({ min: 10 }).isString(),
    body('tags', 'Неверный формат тэгов (укажите массив)').optional().isString(),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
]


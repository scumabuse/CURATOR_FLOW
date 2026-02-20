# CuratorFlow AI

Платформа автоматизации работы куратора колледжа с Vision AI проверкой скриншотов.

## Быстрый старт

### 1. Клонирование репозитория

```bash
git clone https://github.com/your-username/curatorflow.git
cd curatorflow
```

### 2. Установка зависимостей

```bash
npm install
```

### 3. Настройка окружения

Скопируйте файл окружения и заполните переменные:

```bash
cp .env.example .env.local
```

Откройте `.env.local` и вставьте ваш Gemini API ключ (для Vision AI):

```
GEMINI_API_KEY="your-api-key"
```

### 4. Инициализация базы данных

```bash
npx prisma db push
```

### 5. Загрузка демо-данных (опционально)

```bash
npm run db:seed
```

### 6. Запуск

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000)

---

## Демо аккаунты

| Роль     | Email              | Пароль |
|----------|--------------------|--------|
| Куратор  | curator@demo.com   | 123456 |
| Студент  | student@demo.com   | 123456 |

---

## Структура проекта

```
curatorflow/
├── app/
│   ├── page.tsx                # Лендинг
│   ├── layout.tsx              # Корневой layout
│   ├── globals.css             # Глобальные стили
│   ├── auth/
│   │   ├── login/page.tsx      # Вход
│   │   └── register/page.tsx   # Регистрация
│   ├── curator/
│   │   ├── page.tsx            # Дашборд куратора
│   │   ├── groups/page.tsx     # Управление группами
│   │   ├── tasks/page.tsx      # Задания и проверка
│   │   └── analytics/page.tsx  # Аналитика
│   ├── student/
│   │   ├── page.tsx            # Задания студента
│   │   └── history/page.tsx    # История сдач
│   └── api/
│       ├── auth/               # Авторизация (login / register)
│       ├── groups/             # CRUD групп + присоединение
│       ├── tasks/              # CRUD заданий
│       ├── submissions/        # Сдача и проверка работ
│       └── vision/             # Vision AI верификация
├── components/
│   └── Sidebar.tsx             # Боковое меню (SVG-иконки)
├── lib/
│   └── db.ts                   # Prisma клиент
├── prisma/
│   ├── schema.prisma           # Схема БД (SQLite)
│   └── seed.ts                 # Сид демо-данных
├── .env.example                # Пример переменных окружения
├── .gitignore                  # Исключения из Git
├── package.json                # Зависимости
└── tsconfig.json               # TypeScript конфигурация
```

---

## Как работает Vision AI

1. Студент загружает скриншот выполненного задания
2. Gemini Vision API анализирует скриншот:
   - Распознаёт имя студента
   - Проверяет результат теста
   - Определяет подлинность (нет ли признаков фейка)
3. При высокой уверенности — автоматически одобряет
4. При сомнениях — отправляет на ручную проверку куратору

---

## Стек технологий

| Технология      | Назначение                    |
|-----------------|-------------------------------|
| Next.js 16      | Фронтенд + API               |
| SQLite + Prisma | База данных                   |
| Vanilla CSS     | Стили (dark theme)            |
| Recharts        | Графики и диаграммы           |
| Gemini API      | Vision AI проверка скриншотов |

---

## Переменные окружения

| Переменная     | Описание                           | Обязательно |
|----------------|------------------------------------|-------------|
| DATABASE_URL   | Путь к SQLite базе данных          | Да          |
| GEMINI_API_KEY | API ключ для Gemini Vision AI      | Нет*        |

\* Без ключа Vision AI проверка не работает, но остальной функционал доступен.

---

## Лицензия

MIT

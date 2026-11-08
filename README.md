# Календарь Аркана — Docker

Распакуйте архив и откройте терминал в папке с Dockerfile.
Требуется установленный и запущенный Docker с поддержкой Linux-контейнеров.

Запуск со сборкой:

    docker compose up -d --build

Откройте http://localhost:8080

Остановка:

    docker compose down

Сборка отдельно:

    docker build -t arcana-calendar:latest .

Сохранение готового образа для переноса:

    docker save -o arcana-calendar.tar arcana-calendar:latest

На другом компьютере:

    docker load -i arcana-calendar.tar
    docker run -d --name arcana -p 8080:80 --restart unless-stopped arcana-calendar:latest

Данные приложения сохраняются в localStorage браузера. Для переноса данных используйте экспорт/импорт в приложении. При смене адреса или порта браузер использует отдельное хранилище.

Исходные файлы приложения сохранены без изменений. Образ не собран и запуск контейнера не проверен: Docker отсутствует в среде подготовки.

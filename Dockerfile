# Используем образ с SDK для сборки проекта
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /app

# Копируем все файлы проекта в контейнер
COPY . .

# Восстанавливаем зависимости
RUN dotnet restore "WebTesterOfBookStore/WebTesterOfBookStore.csproj"

# Собираем проект в режиме Release
RUN dotnet publish "WebTesterOfBookStore/WebTesterOfBookStore.csproj" -c Release -o out

# Создаём финальный образ, используя минимальный образ ASP.NET
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final

WORKDIR /app

# Копируем собранный проект из build
COPY --from=build /app/out .

# Устанавливаем команду для старта приложения
ENTRYPOINT ["dotnet", "WebTesterOfBookStore.dll"]

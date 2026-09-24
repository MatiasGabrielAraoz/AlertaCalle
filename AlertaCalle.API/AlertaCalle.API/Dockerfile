FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["AlertaCalle.API.csproj", "./"]
RUN dotnet restore "AlertaCalle.API.csproj"
COPY . .
RUN dotnet publish "AlertaCalle.API.csproj" -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "AlertaCalle.API.dll"]
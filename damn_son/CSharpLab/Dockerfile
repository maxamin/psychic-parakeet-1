# Stage 1
FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build
WORKDIR /build
COPY . .
RUN dotnet restore src/CSharpApiLab/CSharpApiLab.csproj
RUN dotnet publish src/CSharpApiLab/CSharpApiLab.csproj -c Release -o /app

# Stage 2
FROM mcr.microsoft.com/dotnet/core/aspnet:3.1 AS final
WORKDIR /app
COPY --from=build /app .
ENTRYPOINT ["dotnet", "CSharpApiLab.dll"]
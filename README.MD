# Prueba para desarrolladores front

Este repositorio es una API que se utiliza como complemento en la evaluación técnica de los candidatos a **_Frontend Developer_** que postulan a Xepelin.

Las funcionalidades que proporciona son:

- Gestión de usuarios (registrar y autenticar).
- Gestión de películas favoritas para usuarios registrados.

> Esta API fue desarrollada de la forma más simple posible, pues el foco principal es evaluar la forma en la que el postulante consume esta información más que entregar una solución robusta.

> Si en el uso de la API te encuentras con un error no controlado, notifícalo inmediatamente al encargado del proceso para que gestione su corrección. Por ningún motivo pierdas el foco de la evaluación corrigiéndolo, nosotros nos encargaremos de ello.

## Consideraciones

- Todos los endpoints simulan una tasa de falla del 10% de los requests recibidos. La respuesta entregada es genérica y es la que sigue:

##### Status code

`500`

##### Body

```json
{
  "message": "CONTROLLED ERROR",
  "errorCode": "CONTROLLED_ERROR"
}
```

- Todos los enpoints simulan un delay en la respuesta que va entre los 0 y 5 segundos incluídos.

## Cómo ejecutar

```bash
npm install
npm start
```

## **POST** /register

Permite registrar un usuario en el storage y en caso de ser exitoso retornará la información del usuairo y el token correspondiente para que en la aplicación quede logeado inmediatamente.

### Curl request:

```bash
curl --location --request POST 'http://localhost:3000/register' \
--header 'Content-Type: application/json;charset=UTF-8' \
--data-raw '{
    "name": "Juan Pérez",
    "email": "juan.perez@mail.cl",
    "password": "Ju4nP3r3z"
}'
```

### _Responses_

#### 201

```json
{
    "id": 1,
    "name": "Juan Pérez"
    "email": "juan.perez@mail.cl",
    "token": <<USER_TOKEN>>
}
```

#### 409

```json
{
  "errorCode": "USER_ALREADY_REGISTER",
  "message": "User is already registered"
}
```

#### 422

```json
{
    "errorCode": "INVALID_BODY",
    "message": <<ERROR_DESCRIPTION>>
}
```

## **POST** /login

Permite autenticar un usuario y obtener un token para acceder a funcionalidades de usuarios registrados.

### _Curl request:_

```bash
curl --location --request POST 'http://localhost:3000/login' \
--header 'Content-Type: application/json;charset=UTF-8' \
--data-raw '{
    "email": "juan.perez@mail.cl",
    "password": "Ju4nP3r3z"
}'
```

### _Responses_

#### 200

```json
{
  "id": 1,
  "name": "Juan Pérez"
  "email": "juan.perez@mail.cl",
  "token": <<USER_TOKEN>>
}
```

#### 401

```json
{
  "message": "Invalid credentials",
  "errorCode": "LOGIN_ERROR_INVALID_CREDENTIALS"
}
```

#### 422

```json
{
    "errorCode": "INVALID_BODY",
    "message": <<ERROR_DESCRIPTION>>
}
```

## **GET** /users/:userId/favorites

Permite consultar los favoritos de un usuario en particular (una vez autenticado)

### _Curl request:_

```
curl --location --request GET 'http://localhost:3000/users/1/favorites' \
--header 'Content-Type: application/json;charset=UTF-8'
```

### _Responses_

#### 200

```
{
 [
    {
      "id": 1,
      "userId": 1,
      "movieId": 1
    },
  ]
}
```

## **POST** /users/:userId/favorites

Permite agregar una peliícula a favoritos del usuario (una vez autenticado)

### _Curl request:_

```
curl --location --request POST 'http://localhost:3000/users/1/favorites' \
--header 'Content-Type: application/json;charset=UTF-8' \
--data-raw '{
    "movieId": 2
}'
```

### _Responses_

#### 200

```
[
  {
    "id": 2,
    "userId": 1,
    "movieId": 2
  }
]
```

#### 409 (favorito ya existe)

```
{
    "errorCode": "FAVORITE_ALREADY_REGISTER",
    "message": "Favorite is already registered to user"
}
```

#### 422 (sin "movieId" en el request)

```
{
    "errorCode": "INVALID_BODY",
    "message": "movieId is required"
}
```

## **DELETE** /users/:userId/favorites/:favoriteId

Permite eliminar una peliícula de favoritos del usuario (una vez autenticado)

### _Curl request:_

```
curl --location --request DELETE 'http://localhost:3000/users/1/favorites/1' \
--header 'Content-Type: application/json;charset=UTF-8'
```

### _Responses_

#### 200

```
{}
```

#### 404 (favorito ya existe)

```
{
    "errorCode": "ERROR_FAVORITE_NOT_FOUND",
    "message": "favorite not found for this user"
}
```

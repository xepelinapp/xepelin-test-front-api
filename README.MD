# Prueba para desarrolladores front

Este repositoria es una API que se utiliza como complemento en la evaluación técnica de los candidatos a **_Frontend Developer_** que postulan a Xepelin

Para la gestión de usuarios permite registrar y autenticar usuarios.
Además complementa las funcionalidades proporcionadas por The Movie DB, permitiendo que los usuarios registrados puedan gestionar sus películar favoritas.

> Esta API fue desarrollada de la forma más simple posible, pues el foco principal es evaluar la forma en la que el postulante consume esta información más que entregar una solución robusta.

## Consideraciones

- Todos los endpoints simulan una tasa de falla del 10% de los requests recibidos.
- Todos los enpoints simulan un delay en la respuesta que va entre los 0 y 5 segundos incluídos.

## Cómo ejecutar

```
npm install
npm start
```

## **POST** /register

Permite registrar un usuario en el storage y en caso de ser exitoso entonces retornará el token correspondiente para que en la aplicación quede logeado inmediatamente.

### Curl request:

```
curl --location --request POST 'http://localhost:3000/register' \
--header 'Content-Type: application/json;charset=UTF-8' \
--data-raw '{
    "name": "Juan Pérez",
    "email": "juan.perez@mail.cl",
    "password": "Ju4nP3r3z"
}'
```

### _Responses_

#### 202

```
{
    "id": 1,
    "name": "Juan Pérez"
    "email": "juan.perez@mail.cl",
    "token": <<USER_TOKEN>>
}
```

#### 409 (usuario ya existe)

```
{
    "errorCode": "USER_ALREADY_REGISTER",
    "message": "User is already registered"
}
```

#### 422 (sin "name" en el request)

```
{
    "errorCode": "INVALID_BODY",
    "message": "name is required"
}
```

#### 422 (sin "email" en el request)

```
{
    "errorCode": "INVALID_BODY",
    "message": "email is required"
}
```

#### 422 (sin "password" en el request)

```
{
    "errorCode": "INVALID_BODY",
    "message": "password is required
}
```

## **POST** /login

Permite autenticar un usuario y obtener un token para acceder a funcionalidades
para usuarios registrados.

### _Curl request:_

```
curl --location --request POST 'http://localhost:3000/login' \
--header 'Content-Type: application/json;charset=UTF-8' \
--data-raw '{
    "email": "juan.perez@mail.cl",
    "password": "Ju4nP3r3z"
}'
```

### _Responses_

#### 202

```
{
  "token": <<USER_TOKEN>>
}
```

##### 401

```
{
  "message": "Invalid credentials",
  "errorCode": "LOGIN_ERROR_INVALID_CREDENTIALS"
}
```

### **GET** /users/:userId/favorites

Permite consultar los favoritos de un usuario en particular (una vez autenticado)

#### _Curl request:_

```
curl --location --request GET 'http://localhost:3000/users/1/favorites' \
--header 'Content-Type: application/json;charset=UTF-8'
```

#### _Responses_

#### 202

```
{
 [
    {
      "id": 1,
      "userId": 1,
      "name": "John Wick",
      "body": "some description"
    },
  ]
}
```

### **POST** /users/:userId/favorites

Permite agregar una peliícula a favoritos del usuario (una vez autenticado)

#### _Curl request:_

```
curl --location --request POST 'http://localhost:3000/users/1/favorites' \
--header 'Content-Type: application/json;charset=UTF-8' \
--data-raw '{
    "movieId": 2
}'
```

#### _Responses_

#### 200

```
{
      "id": 2,
      "userId": 1,
      "name": "John Wick 2",
      "body": "some description"
}
```

#### 409 (favorito ya existe)

```
{
    "errorCode": "FAVORITE_ALREADY_REGISTER",
    "message": "Davorite is already registered to user"
}
```

#### 422 (sin "movieId" en el request)

```
{
    "errorCode": "INVALID_BODY",
    "message": "movieId is required"
}
```

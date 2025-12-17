PE-2.2 – Calculator

Este proyecto implementa un servidor Fastify con un MCP Tool llamado Calculator, el cual permite ejecutar operaciones aritméticas básicas: suma, resta, multiplicación y división.


El servidor estará activo en:

http://localhost:3000


Swagger UI:

http://localhost:3000/docs

Ejemplo de uso (Thunder Client)
Endpoint:
POST /tools/calculator

Body:
{
  "operation": "add",
  "a": 10,
  "b": 3
}

📸 Capturas de funcionamiento
Operación ADD
![IMAGEN DE CAPTURA ADD](./captures/add.png) 

Operación SUBTRACT
![IMAGEN DE CAPTURA SUBTRACT](./captures/subtract.png) 

Operación MULTIPLY
![IMAGEN DE CAPTURA MULTIPLY](./captures/multiply.png) 

Operación DIVIDE
![IMAGEN DE CAPTURA ADD](./captures/divide.png) 

Operación DIVIDE

Error: División para 0
![IMAGEN DE CAPTURA ADD](./captures/divide0.png) 

Servidor MCP – Vista general
![IMAGEN DE CAPTURA ADD](./captures/SERVERMCP.png) 

Swagger UI funcionando
![IMAGEN DE CAPTURA ADD](./captures/SERVERMCP1.png)




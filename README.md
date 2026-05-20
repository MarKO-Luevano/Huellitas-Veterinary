# Huellitas Veterinary 🐾

## Prerrequisitos para correr el proyecto
Antes de clonar e instalar, asegúrate de tener instalado:
* **Node.js** (Versión LTS recomendada, v24.13.1)
* **Java JDK** (Java version "21.0.10" LTS)
* **MariaDB** (Version 10.11.4-MariaDB)

## Pasos para instalación rápida

### 1. Clonar el repositorio
```bash
git clone [https://github.com/MarKO-Luevano/Huellitas-Veterinary.git](https://github.com/MarKO-Luevano/Huellitas-Veterinary.git)
cd Huellitas-Veterinary

cd backend/backend
# Configura tus credenciales de base de datos en application.properties primero
./mvnw spring-boot:run

cd ../../frontend
npm install
npm run dev

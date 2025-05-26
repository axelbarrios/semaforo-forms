# Evaluación Matrimonial (v2.0.0)

Esta aplicación web proporciona un formulario interactivo para evaluar la relación matrimonial, con formularios separados para esposos y esposas. La aplicación está construida con React, TypeScript y Tailwind CSS, y utiliza animaciones de Framer Motion para una experiencia de usuario moderna y atractiva.

## Versiones
- **v1.0.0**: Versión inicial funcional con un idioma (Español)
- **v2.0.0**: Soporte multilingüe (Español y Portugués)

## Características

- Soporte multilingüe (Español y Portugués)
- Formularios idénticos para esposos y esposas
- Evaluación de 5 factores clave en la relación matrimonial:
  - Consenso
  - Satisfacción
  - Cohesión
  - Expresión de afecto
  - Conexión sexual
- Animaciones y transiciones suaves
- Diseño responsivo para dispositivos móviles y de escritorio
- Integración con Google Sheets para almacenar y analizar respuestas
- Cálculo automático de puntuaciones por factor
- Visualización de resultados al finalizar

## Configuración de Google Sheets

Para configurar la integración con Google Sheets:

1. Cree una nueva hoja de cálculo en Google Sheets
2. Vaya a Extensiones > Apps Script
3. Copie el código de `googleSheetsScript.js` en el editor de Apps Script
4. Reemplace `'SU_ID_DE_HOJA_DE_CALCULO'` con el ID de su hoja de cálculo (se encuentra en la URL)
5. Guarde y despliegue como aplicación web
   - Ejecutar como: Su cuenta
   - Quién tiene acceso: Cualquier persona, incluso anónimos
6. Copie la URL de la aplicación web y actualice la función `submitToGoogleSheets` en `src/utils.ts`

## Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa de la versión de producción
npm run preview
```

## Estructura del Proyecto

- `src/components/`: Componentes React reutilizables
- `src/types.ts`: Definiciones de tipos TypeScript
- `src/questions.ts`: Lista completa de preguntas del cuestionario en español
- `src/questions_pt.ts`: Lista completa de preguntas del cuestionario en portugués
- `src/translations.ts`: Traducciones para la interfaz de usuario
- `src/utils.ts`: Funciones de utilidad para cálculos y envío de datos
- `src/App.tsx`: Componente principal de la aplicación
- `src/googleSheetsScript.js`: Código para Google Apps Script

## Personalización

Puede personalizar la apariencia de la aplicación modificando:

- `tailwind.config.js`: Colores, fuentes y animaciones
- `src/index.css`: Estilos CSS personalizados
- Componentes individuales para cambiar el diseño o comportamiento

## Licencia

Este proyecto está disponible como código abierto bajo la licencia MIT.
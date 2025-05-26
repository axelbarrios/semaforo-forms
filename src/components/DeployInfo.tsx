import React from 'react';
import { ExternalLink } from 'lucide-react';

const DeployInfo: React.FC = () => {
  return (
    <div className="bg-[#2d2d2d] p-6 rounded-lg shadow-md mb-8 text-white">
      <h2 className="text-xl font-semibold mb-4 text-center">Información de Despliegue</h2>
      
      <div className="space-y-4">
        <p>
          Esta aplicación puede ser desplegada fácilmente en Netlify para su uso en producción. 
          Siga estos pasos para configurar su propio despliegue:
        </p>
        
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            <span className="font-medium">Cree una cuenta en Netlify</span> si aún no tiene una en{' '}
            <a 
              href="https://app.netlify.com/signup" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-indigo-300 hover:text-indigo-200 inline-flex items-center"
            >
              app.netlify.com <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </li>
          <li>
            <span className="font-medium">Conecte su repositorio de GitHub</span> donde tiene alojado este código
          </li>
          <li>
            <span className="font-medium">Configure las variables de entorno</span> para la integración con Google Sheets:
            <ul className="list-disc pl-5 mt-1 text-sm">
              <li>VITE_GOOGLE_SCRIPT_URL_PRODUCTION: URL del script de producción</li>
              <li>VITE_GOOGLE_SCRIPT_URL_TESTING: URL del script de prueba</li>
              <li>VITE_ENVIRONMENT: "production" o "testing" según el entorno</li>
            </ul>
          </li>
          <li>
            <span className="font-medium">Despliegue la aplicación</span> utilizando la configuración predeterminada de Netlify
          </li>
        </ol>
        
        <div className="bg-[#1f1f1f] p-4 rounded-lg border border-gray-700 mt-4">
          <h3 className="text-lg font-medium text-indigo-300 mb-2">Configuración de Google Sheets</h3>
          <p className="text-sm text-gray-300 mb-2">
            Asegúrese de que su script de Google Apps Script esté configurado correctamente:
          </p>
          <ul className="list-disc pl-5 text-sm text-gray-300">
            <li>Publique su script como aplicación web (Implementar → Nueva implementación → Aplicación web)</li>
            <li>Configure los permisos para que cualquier persona pueda acceder, incluso de forma anónima</li>
            <li>Copie la URL generada y configúrela como variable de entorno en Netlify</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DeployInfo;
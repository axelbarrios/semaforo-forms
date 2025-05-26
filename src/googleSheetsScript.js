// Este código debe copiarse en Google Apps Script para la integración con Google Sheets PORTUGUES
// Cree un nuevo proyecto en https://script.google.com/ y pegue este código

// ID de la hoja de cálculo (reemplazar con su ID)
const SPREADSHEET_ID = '1N_RnbCBav1Of_P_4Jo_mGpaYNeHhA9LB9wlVtCvkk4Q';
// ID de la carpeta de Google Drive donde se guardarán los PDFs
const FOLDER_ID = '1B3bTlfys7uc9CSJfjEnGFa1C_tHCmfwk'; // Reemplazar con el ID de carpeta real
// ID de la plantilla de Google Docs
const TEMPLATE_DOC_ID = '1-VyvW9dlB7aqpsc4G5aAAZ_QaTRE2TZplZBCx2TrNRU'; // Reemplazar con el ID de la plantilla

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Informes REM Portugues')
    .addItem('Procesar Informes por Fecha Portugues', 'showDateRangeDialogPT')
    .addItem('Generar Informe de Pareja Portugues', 'showCoupleReportDialog')
    .addToUi();
}


function convertToLowerCase() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var range = sheet.getActiveRange();
  var values = range.getValues();

  for (var i = 0; i < values.length; i++) {
    for (var j = 0; j < values[i].length; j++) {
      if (typeof values[i][j] === "string") {
        values[i][j] = values[i][j].toLowerCase();
      }
    }
  }

  range.setValues(values);
}

function convertToTitleCase() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var range = sheet.getActiveRange();
  var values = range.getValues();

  for (var i = 0; i < values.length; i++) {
    for (var j = 0; j < values[i].length; j++) {
      if (typeof values[i][j] === "string") {
        values[i][j] = values[i][j]
          .toLowerCase()
          .replace(/\b\w/g, function (char) {
            return char.toUpperCase();
          });
      }
    }
  }

  range.setValues(values);
}

function showDateRangeDialog() {
  const ui = SpreadsheetApp.getUi();
  const html = HtmlService.createHtmlOutput(`
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 20px;
      }
      .form-group {
        margin-bottom: 15px;
      }
      label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
      }
      input {
        width: 100%;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
      }
      .btn {
        background-color: #4285f4;
        color: white;
        padding: 10px 15px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      .btn:hover {
        background-color: #3367d6;
      }
      .checkbox-group {
        margin-top: 15px;
      }
      .checkbox-label {
        display: flex;
        align-items: center;
      }
      .checkbox-label input {
        width: auto;
        margin-right: 10px;
      }
    </style>
    <h2>Procesar Informes por Rango de Fechas</h2>
    <div class="form-group">
      <label for="startDate">Fecha Inicial:</label>
      <input type="date" id="startDate" required>
    </div>
    <div class="form-group">
      <label for="endDate">Fecha Final:</label>
      <input type="date" id="endDate" required>
    </div>
    <div class="checkbox-group">
      <label class="checkbox-label">
        <input type="checkbox" id="regenerate">
        Regenerar informes (si ya existen)
      </label>
    </div>
    <button class="btn" onclick="processReports()">Procesar</button>
    
    <script>
      function processReports() {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        const regenerate = document.getElementById('regenerate').checked;
        
        if (!startDate || !endDate) {
          alert('Por favor seleccione ambas fechas');
          return;
        }
        
        google.script.run
          .withSuccessHandler(function(result) {
            alert(result.message);
          })
          .withFailureHandler(function(error) {
            alert('Error: ' + error);
          })
          .processReportsByDateRange(startDate, endDate, regenerate);
      }
    </script>
  `)
  .setWidth(400)
  .setHeight(350);
  
  ui.showModalDialog(html, 'Procesar Informes');
}

function showCoupleReportDialog() {
  const ui = SpreadsheetApp.getUi();
  const html = HtmlService.createHtmlOutput(`
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 20px;
      }
      .form-group {
        margin-bottom: 15px;
      }
      label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
      }
      input {
        width: 100%;
        padding: 8px;
        border: 1px solid #ddd;
        border-radius: 4px;
      }
      .btn {
        background-color: #4285f4;
        color: white;
        padding: 10px 15px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      .btn:hover {
        background-color: #3367d6;
      }
      .checkbox-group {
        margin-top: 15px;
      }
      .checkbox-label {
        display: flex;
        align-items: center;
      }
      .checkbox-label input {
        width: auto;
        margin-right: 10px;
      }
    </style>
    <h2>Generar Informe de Pareja</h2>
    <div class="form-group">
      <label for="email1">Email de Esposo/a:</label>
      <input type="email" id="email1" placeholder="Ingrese el email del esposo/a" required>
    </div>
    <div class="form-group">
      <label for="email2">Email de Cónyuge:</label>
      <input type="email" id="email2" placeholder="Ingrese el email del cónyuge" required>
    </div>
    <div class="checkbox-group">
      <label class="checkbox-label">
        <input type="checkbox" id="regenerate">
        Regenerar informe (si ya existe)
      </label>
    </div>
    <button class="btn" onclick="generateCoupleReport()">Generar Informe</button>
    
    <script>
      function generateCoupleReport() {
        const email1 = document.getElementById('email1').value;
        const email2 = document.getElementById('email2').value;
        const regenerate = document.getElementById('regenerate').checked;
        
        if (!email1 || !email2) {
          alert('Por favor ingrese ambos emails');
          return;
        }
        
        google.script.run
          .withSuccessHandler(function(result) {
            alert(result.message);
          })
          .withFailureHandler(function(error) {
            alert('Error: ' + error);
          })
          .generateCoupleReportByEmail(email1, email2, regenerate);
      }
    </script>
  `)
  .setWidth(400)
  .setHeight(350);
  
  ui.showModalDialog(html, 'Generar Informe de Pareja');
}

function doGet(e) {
  // Configurar encabezados CORS para permitir acceso desde cualquier origen
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  
  // Configurar encabezados para evitar el mensaje "Una página incorporada en URL dice:"
  output.setContent(JSON.stringify({
    status: "success",
    message: "Servicio de Evaluación Matrimonial REM activo",
    version: "2.0.0"
  }));
  
  // Agregar encabezados específicos para evitar que se muestre como "página incorporada"
  output.addHeader("X-Content-Type-Options", "nosniff");
  output.addHeader("Access-Control-Allow-Origin", "*");
  output.addHeader("Access-Control-Allow-Methods", "GET, POST");
  output.addHeader("Access-Control-Allow-Headers", "Content-Type");
  
  return output;
}

function doPost(e) {
  try {
    // Obtener los datos del formulario
    const data = JSON.parse(e.postData.contents);
    
    // Abrir la hoja de cálculo
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    // Seleccionar la hoja donde se guardarán los datos basado en el idioma y el tipo de cónyuge
    let sheetName;
    if (data.language === 'es') {
      sheetName = data.spouse === 'husband' ? 'Esposos' : 'Esposas';
    } else {
      sheetName = data.spouse === 'husband' ? 'Esposos-portugues' : 'Esposas-portugues';
    }
    
    let sheet = spreadsheet.getSheetByName(sheetName) || spreadsheet.insertSheet(sheetName);
    
    // Si es la primera entrada, crear encabezados
    if (sheet.getLastRow() === 0) {
      const headers = [
        'Timestamp', 'Fecha', 'Nombre', 'Email', 'Edad', 'Ocupación u Oficio', 'Religión', 'Educación',
        'País', 'Ciudad', 'Estado Civil', 'Tiempo en Pareja',
        'Matrimonios Anteriores', 'Número de Niños', 
        data.spouse === 'husband' ? 'Email de Esposa' : 'Email de Esposo',
        // Añadir todas las preguntas como encabezados
        ...Array.from({ length: 75 }, (_, i) => `Pregunta ${i + 1}`),
        // Añadir factores como encabezados
        'CONSENSO', 'SATISFACCION', 'COHESION', 'EXPRESION DE AFECTO', 'CONEXION SEXUAL', 'TOTAL',
        'PDF_Generado', 'ID_PDF'
      ];
      sheet.appendRow(headers);
      
      // Aplicar formato a los encabezados
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground('#f3f3f3');
      headerRange.setFontWeight('bold');
      
      // Aplicar formato condicional a las columnas de factores
      applyConditionalFormatting(sheet);
    }
    
    // Crear timestamp actual en formato DD-MM-YYYY HH:MM:SS (Hora de Guatemala)
    // Usar la función de Utilities para formatear la fecha en la zona horaria de Guatemala
    const timestamp = Utilities.formatDate(new Date(), "America/Guatemala", "dd-MM-yyyy HH:mm:ss");
    
    // Preparar los datos para insertar
    const personalInfo = data.personalInfo;
    const rowData = [
      timestamp, // Añadir timestamp formateado como primera columna
      personalInfo.date || new Date().toLocaleString(),
      personalInfo.name,
      data.email,
      personalInfo.age,
      personalInfo.ocupacion,
      personalInfo.religion,
      personalInfo.education,
      personalInfo.pais,
      personalInfo.ciudad,
      personalInfo.maritalStatus,
      personalInfo.timeAsCouple,
      personalInfo.previousMarriages,
      personalInfo.numberOfChildren,
      personalInfo.spouseEmail || '' // Usar spouseEmail si existe, sino usar cadena vacía
    ];
    
    // Lista de preguntas con puntuación invertida
    const invertedQuestions = [1, 2, 3, 4, 6, 7, 10, 19, 21, 30, 31, 33, 45, 49, 50, 52, 63, 65, 66, 68, 75];
    
    // Añadir respuestas en orden
    for (let i = 1; i <= 75; i++) {
      rowData.push(data.answers[i] || '');
    }
    
    // Calcular y añadir puntuaciones por factor
    const factorScores = calculateFactorScores(data.answers, invertedQuestions);
    rowData.push(
      factorScores.CONSENSO.score,
      factorScores.SATISFACCION.score,
      factorScores.COHESION.score,
      factorScores['EXPRESION DE AFECTO'].score,
      factorScores['CONEXION SEXUAL'].score,
      Object.values(factorScores).reduce((sum, factor) => sum + factor.score, 0),
      'No', // PDF_Generado
      '' // ID_PDF
    );
    
    // Insertar los datos
    sheet.appendRow(rowData);
    
    // Configurar la respuesta con encabezados CORS
    const output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);
    output.setContent(JSON.stringify({ success: true }));
    
    // Agregar encabezados CORS
    output.addHeader("Access-Control-Allow-Origin", "*");
    output.addHeader("Access-Control-Allow-Methods", "GET, POST");
    output.addHeader("Access-Control-Allow-Headers", "Content-Type");
    
    return output;
      
  } catch (error) {
    // Configurar la respuesta de error con encabezados CORS
    const output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);
    output.setContent(JSON.stringify({ 
      success: false, 
      error: error.toString() 
    }));
    
    // Agregar encabezados CORS
    output.addHeader("Access-Control-Allow-Origin", "*");
    output.addHeader("Access-Control-Allow-Methods", "GET, POST");
    output.addHeader("Access-Control-Allow-Headers", "Content-Type");
    
    return output;
  }
}

// Función para aplicar formato condicional a las columnas de factores
function applyConditionalFormatting(sheet) {
  // Obtener el número de columnas en la hoja
  const lastColumn = sheet.getLastColumn();
  
  // Las columnas de factores son las últimas 6 columnas (5 factores + total)
  const factorColumns = [
    lastColumn - 7, // CONSENSO
    lastColumn - 6, // SATISFACCION
    lastColumn - 5, // COHESION
    lastColumn - 4, // EXPRESION DE AFECTO
    lastColumn - 3, // CONEXION SEXUAL
    lastColumn - 2  // TOTAL
  ];
  
  // Aplicar formato condicional a cada columna de factor
  factorColumns.forEach(column => {
    // Crear reglas de formato condicional
    const range = sheet.getRange(2, column, 1000, 1); // Desde la fila 2 hasta 1000 filas
    
    // Regla para valores mayores a 50 (verde)
    const greenRule = SpreadsheetApp.newConditionalFormatRule()
      .whenNumberGreaterThan(50)
      .setBackground('#b7e1cd') // Verde claro
      .setRanges([range])
      .build();
    
    // Regla para valores entre 30 y 50 (amarillo)
    const yellowRule = SpreadsheetApp.newConditionalFormatRule()
      .whenNumberBetween(30, 50)
      .setBackground('#fce8b2') // Amarillo claro
      .setRanges([range])
      .build();
    
    // Regla para valores menores a 30 (rojo)
    const redRule = SpreadsheetApp.newConditionalFormatRule()
      .whenNumberLessThan(30)
      .setBackground('#f4c7c3') // Rojo claro
      .setRanges([range])
      .build();
    
    // Aplicar las reglas
    const rules = sheet.getConditionalFormatRules();
    rules.push(greenRule, yellowRule, redRule);
    sheet.setConditionalFormatRules(rules);
  });
  
  // Aplicar formato condicional a la columna PDF_Generado
  const pdfGeneratedColumn = lastColumn - 1;
  const pdfGeneratedRange = sheet.getRange(2, pdfGeneratedColumn, 1000, 1);
  
  // Regla para "Sí" (verde)
  const pdfGeneratedYesRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("Sí")
    .setBackground('#b7e1cd') // Verde claro
    .setRanges([pdfGeneratedRange])
    .build();
  
  // Regla para "No" (amarillo)
  const pdfGeneratedNoRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("No")
    .setBackground('#fce8b2') // Amarillo claro
    .setRanges([pdfGeneratedRange])
    .build();
  
  // Aplicar las reglas
  const pdfRules = sheet.getConditionalFormatRules();
  pdfRules.push(pdfGeneratedYesRule, pdfGeneratedNoRule);
  sheet.setConditionalFormatRules(pdfRules);
}

// Función para calcular puntuaciones por factor
function calculateFactorScores(answers, invertedQuestions) {
  // Definir las preguntas por factor
  const factorDefinitions = {
    'CONSENSO': {
      questions: Array.from({ length: 15 }, (_, i) => i + 1)
    },
    'SATISFACCION': {
      questions: Array.from({ length: 15 }, (_, i) => i + 16)
    },
    'COHESION': {
      questions: Array.from({ length: 15 }, (_, i) => i + 31)
    },
    'EXPRESION DE AFECTO': {
      questions: Array.from({ length: 15 }, (_, i) => i + 46)
    },
    'CONEXION SEXUAL': {
      questions: Array.from({ length: 15 }, (_, i) => i + 61)
    }
  };
  
  // Calcular puntuaciones
  const scores = {};
  
  for (const [factor, definition] of Object.entries(factorDefinitions)) {
    let factorScore = 0;
    let count = 0;
    
    for (const questionId of definition.questions) {
      const answer = answers[questionId];
      
      if (answer) {
        // No necesitamos invertir el valor aquí porque ya se invirtió en la interfaz de usuario
        factorScore += parseInt(answer);
        count++;
      }
    }
    
    scores[factor] = {
      score: factorScore,
      count: count,
      maxPossible: count * 4
    };
  }
  
  return scores;
}

// Función para procesar informes por rango de fechas
function processReportsByDateRange(startDate, endDate, regenerate = false) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    // Definir las hojas que contienen datos de esposos y esposas
    const husbandSheets = ['Esposos', 'Esposos-portugues'];
    const wifeSheets = ['Esposas', 'Esposas-portugues'];
    
    let processedCount = 0;
    let errorCount = 0;
    let debugInfo = [];
    let processedPairs = new Set(); // Para rastrear las parejas ya procesadas
    
    // Zona horaria local (Guatemala/Central America)
    const timeZone = "America/Guatemala";
    
    // Convertir fechas de string a objetos Date en la zona horaria local
    // Formato de entrada: YYYY-MM-DD
    const startDateParts = startDate.split('-');
    const endDateParts = endDate.split('-');
    
    // Crear fechas en formato local
    const startDateLocal = new Date(
      parseInt(startDateParts[0]), 
      parseInt(startDateParts[1]) - 1, 
      parseInt(startDateParts[2]), 
      0, 0, 0
    );
    
    const endDateLocal = new Date(
      parseInt(endDateParts[0]), 
      parseInt(endDateParts[1]) - 1, 
      parseInt(endDateParts[2]), 
      23, 59, 59
    );
    
    // Formatear las fechas para depuración
    const startDateFormatted = Utilities.formatDate(startDateLocal, timeZone, "yyyy-MM-dd HH:mm:ss");
    const endDateFormatted = Utilities.formatDate(endDateLocal, timeZone, "yyyy-MM-dd HH:mm:ss");
    
    // Registrar información de depuración
    debugInfo.push(`Rango de fechas (formato local): ${startDateFormatted} a ${endDateFormatted}`);
    
    // Recopilar todas las entradas de esposos en el rango de fechas
    let husbandEntries = [];
    
    // Procesar cada hoja de esposos para recopilar entradas
    husbandSheets.forEach(sheetName => {
      const sheet = spreadsheet.getSheetByName(sheetName);
      if (!sheet) {
        debugInfo.push(`Hoja ${sheetName} no encontrada`);
        return; // Saltar si la hoja no existe
      }
      
      const data = sheet.getDataRange().getValues();
      if (data.length <= 1) {
        debugInfo.push(`Hoja ${sheetName} solo tiene encabezados o está vacía`);
        return; // Saltar si solo hay encabezados
      }
      
      // Obtener índices de columnas importantes
      const headers = data[0];
      const dateColIndex = headers.indexOf('Fecha');
      const nameColIndex = headers.indexOf('Nombre');
      const emailColIndex = headers.indexOf('Email');
      const spouseEmailColIndex = headers.indexOf('Email de Esposa');
      const paisColIndex = headers.indexOf('País');
      const ciudadColIndex = headers.indexOf('Ciudad');
      const pdfGeneratedColIndex = headers.indexOf('PDF_Generado');
      
      // Verificar que se encontraron todas las columnas necesarias
      if (dateColIndex === -1 || emailColIndex === -1 || 
          spouseEmailColIndex === -1 || pdfGeneratedColIndex === -1) {
        debugInfo.push(`Hoja ${sheetName}: No se encontraron todas las columnas necesarias`);
        return;
      }
      
      // Procesar cada fila (excepto encabezados)
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        
        // Verificar si la fecha está en el rango
        let rowDate;
        try {
          // Obtener la fecha de la fila
          const dateValue = row[dateColIndex];
          
          // Convertir a fecha según el formato
          if (dateValue instanceof Date) {
            // Si ya es un objeto Date
            rowDate = dateValue;
          } else if (typeof dateValue === 'string') {
            // Si es una cadena, intentar varios formatos
            if (dateValue.includes('-')) {
              // Formato YYYY-MM-DD o DD-MM-YYYY
              const parts = dateValue.split('-');
              if (parts.length === 3) {
                if (parts[0].length === 4) {
                  // YYYY-MM-DD
                  rowDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
                } else {
                  // DD-MM-YYYY
                  rowDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
                }
              }
            } else if (dateValue.includes('/')) {
              // Formato DD/MM/YYYY o MM/DD/YYYY
              const parts = dateValue.split('/');
              if (parts.length === 3) {
                if (parseInt(parts[0]) > 12) {
                  // DD/MM/YYYY (día > 12)
                  rowDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
                } else {
                  // Asumir MM/DD/YYYY por defecto
                  rowDate = new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
                }
              }
            } else {
              // Intentar con formato estándar de JS
              rowDate = new Date(dateValue);
            }
          } else {
            // Si no es ni Date ni string, intentar convertir
            rowDate = new Date(dateValue);
          }
          
          // Si la fecha no es válida, registrar y continuar
          if (isNaN(rowDate.getTime())) {
            debugInfo.push(`Fila ${i+1}: Fecha inválida "${dateValue}"`);
            continue;
          }
        } catch (e) {
          debugInfo.push(`Error al procesar fecha en fila ${i+1}: ${e.toString()}`);
          continue;
        }
        
        // Formatear la fecha para comparación en la misma zona horaria
        const rowDateFormatted = Utilities.formatDate(rowDate, timeZone, "yyyy-MM-dd");
        const startDateLocalFormatted = Utilities.formatDate(startDateLocal, timeZone, "yyyy-MM-dd");
        const endDateLocalFormatted = Utilities.formatDate(endDateLocal, timeZone, "yyyy-MM-dd");
        
        // Comparar solo las fechas (sin hora) usando strings formateados
        const inDateRange = rowDateFormatted >= startDateLocalFormatted && rowDateFormatted <= endDateLocalFormatted;
        
        if (inDateRange && (regenerate || row[pdfGeneratedColIndex] === 'No')) {
          // Añadir a la lista de entradas con información de la hoja y fila
          husbandEntries.push({
            sheetName: sheetName,
            rowIndex: i,
            data: row,
            name: row[nameColIndex] || '',
            email: row[emailColIndex] || '',
            spouseEmail: row[spouseEmailColIndex] || '',
            pais: row[paisColIndex] || '',
            ciudad: row[ciudadColIndex] || '',
            date: rowDateFormatted
          });
        }
      }
    });
    
    // Recopilar todas las entradas de esposas en el rango de fechas
    let wifeEntries = [];
    
    // Procesar cada hoja de esposas para recopilar entradas
    wifeSheets.forEach(sheetName => {
      const sheet = spreadsheet.getSheetByName(sheetName);
      if (!sheet) {
        debugInfo.push(`Hoja ${sheetName} no encontrada`);
        return; // Saltar si la hoja no existe
      }
      
      const data = sheet.getDataRange().getValues();
      if (data.length <= 1) {
        debugInfo.push(`Hoja ${sheetName} solo tiene encabezados o está vacía`);
        return; // Saltar si solo hay encabezados
      }
      
      // Obtener índices de columnas importantes
      const headers = data[0];
      const dateColIndex = headers.indexOf('Fecha');
      const nameColIndex = headers.indexOf('Nombre');
      const emailColIndex = headers.indexOf('Email');
      const spouseEmailColIndex = headers.indexOf('Email de Esposo');
      const paisColIndex = headers.indexOf('País');
      const ciudadColIndex = headers.indexOf('Ciudad');
      const pdfGeneratedColIndex = headers.indexOf('PDF_Generado');
      
      // Verificar que se encontraron todas las columnas necesarias
      if (dateColIndex === -1 || emailColIndex === -1 || 
          spouseEmailColIndex === -1 || pdfGeneratedColIndex === -1) {
        debugInfo.push(`Hoja ${sheetName}: No se encontraron todas las columnas necesarias`);
        return;
      }
      
      // Procesar cada fila (excepto encabezados)
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        
        // Verificar si la fecha está en el rango
        let rowDate;
        try {
          // Obtener la fecha de la fila
          const dateValue = row[dateColIndex];
          
          // Convertir a fecha según el formato
          if (dateValue instanceof Date) {
            // Si ya es un objeto Date
            rowDate = dateValue;
          } else if (typeof dateValue === 'string') {
            // Si es una cadena, intentar varios formatos
            if (dateValue.includes('-')) {
              // Formato YYYY-MM-DD o DD-MM-YYYY
              const parts = dateValue.split('-');
              if (parts.length === 3) {
                if (parts[0].length === 4) {
                  // YYYY-MM-DD
                  rowDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
                } else {
                  // DD-MM-YYYY
                  rowDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
                }
              }
            } else if (dateValue.includes('/')) {
              // Formato DD/MM/YYYY o MM/DD/YYYY
              const parts = dateValue.split('/');
              if (parts.length === 3) {
                if (parseInt(parts[0]) > 12) {
                  // DD/MM/YYYY (día > 12)
                  rowDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
                } else {
                  // Asumir MM/DD/YYYY por defecto
                  rowDate = new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
                }
              }
            } else {
              // Intentar con formato estándar de JS
              rowDate = new Date(dateValue);
            }
          } else {
            // Si no es ni Date ni string, intentar convertir
            rowDate = new Date(dateValue);
          }
          
          // Si la fecha no es válida, registrar y continuar
          if (isNaN(rowDate.getTime())) {
            debugInfo.push(`Fila ${i+1}: Fecha inválida "${dateValue}"`);
            continue;
          }
        } catch (e) {
          debugInfo.push(`Error al procesar fecha en fila ${i+1}: ${e.toString()}`);
          continue;
        }
        
        // Formatear la fecha para comparación en la misma zona horaria
        const rowDateFormatted = Utilities.formatDate(rowDate, timeZone, "yyyy-MM-dd");
        const startDateLocalFormatted = Utilities.formatDate(startDateLocal, timeZone, "yyyy-MM-dd");
        const endDateLocalFormatted = Utilities.formatDate(endDateLocal, timeZone, "yyyy-MM-dd");
        
        // Comparar solo las fechas (sin hora) usando strings formateados
        const inDateRange = rowDateFormatted >= startDateLocalFormatted && rowDateFormatted <= endDateLocalFormatted;
        
        if (inDateRange && (regenerate || row[pdfGeneratedColIndex] === 'No')) {
          // Añadir a la lista de entradas con información de la hoja y fila
          wifeEntries.push({
            sheetName: sheetName,
            rowIndex: i,
            data: row,
            name: row[nameColIndex] || '',
            email: row[emailColIndex] || '',
            spouseEmail: row[spouseEmailColIndex] || '',
            pais: row[paisColIndex] || '',
            ciudad: row[ciudadColIndex] || '',
            date: rowDateFormatted
          });
        }
      }
    });
    
    // Registrar información de depuración
    debugInfo.push(`Total de entradas de esposos en rango de fechas: ${husbandEntries.length}`);
    debugInfo.push(`Total de entradas de esposas en rango de fechas: ${wifeEntries.length}`);
    
    // Emparejar esposos y esposas basados en sus correos electrónicos
    for (const husband of husbandEntries) {
      // Si este esposo ya fue procesado como parte de una pareja, continuar
      if (processedPairs.has(husband.email)) {
        continue;
      }
      
      // Buscar la esposa correspondiente
      const wife = wifeEntries.find(w => 
        (w.email === husband.spouseEmail && w.spouseEmail === husband.email) ||
        (husband.spouseEmail === w.email)
      );
      
      if (wife) {
        // Marcar ambos como procesados
        processedPairs.add(husband.email);
        processedPairs.add(wife.email);
        
        try {
          // Obtener las hojas y filas para actualizar
          const husbandSheet = spreadsheet.getSheetByName(husband.sheetName);
          const wifeSheet = spreadsheet.getSheetByName(wife.sheetName);
          
          const husbandHeaders = husbandSheet.getDataRange().getValues()[0];
          const wifeHeaders = wifeSheet.getDataRange().getValues()[0];
          
          const husbandPdfGeneratedColIndex = husbandHeaders.indexOf('PDF_Generado');
          const husbandPdfIdColIndex = husbandHeaders.indexOf('ID_PDF');
          
          const wifePdfGeneratedColIndex = wifeHeaders.indexOf('PDF_Generado');
          const wifePdfIdColIndex = wifeHeaders.indexOf('ID_PDF');
          
          // Obtener índices de factores para el esposo
          const husbandFactorIndices = {
            'CONSENSO': husbandHeaders.indexOf('CONSENSO'),
            'SATISFACCION': husbandHeaders.indexOf('SATISFACCION'),
            'COHESION': husbandHeaders.indexOf('COHESION'),
            'EXPRESION DE AFECTO': husbandHeaders.indexOf('EXPRESION DE AFECTO'),
            'CONEXION SEXUAL': husbandHeaders.indexOf('CONEXION SEXUAL'),
            'TOTAL': husbandHeaders.indexOf('TOTAL')
          };
          
          // Obtener índices de factores para la esposa
          const wifeFactorIndices = {
            'CONSENSO': wifeHeaders.indexOf('CONSENSO'),
            'SATISFACCION': wifeHeaders.indexOf('SATISFACCION'),
            'COHESION': wifeHeaders.indexOf('COHESION'),
            'EXPRESION DE AFECTO': wifeHeaders.indexOf('EXPRESION DE AFECTO'),
            'CONEXION SEXUAL': wifeHeaders.indexOf('CONEXION SEXUAL'),
            'TOTAL': wifeHeaders.indexOf('TOTAL')
          };
          
          // Determinar si es portugués basado en el nombre de la hoja
          const isPortuguese = husband.sheetName.includes('portugues') || wife.sheetName.includes('portugues');
          
          // Generar el nombre del archivo según la estructura solicitada
          const fileName = `Informe Matrimonial - ${husband.name} - ${wife.name} - ${husband.pais} - ${husband.ciudad} - ${husband.date}`;
          
          // Generar el informe PDF
          const pdfId = generateCoupleReport(husband.data, wife.data, husbandFactorIndices, wifeFactorIndices, isPortuguese, fileName);
          
          // Actualizar ambas filas con la información del PDF generado
          husbandSheet.getRange(husband.rowIndex + 1, husbandPdfGeneratedColIndex + 1).setValue('Sí');
          husbandSheet.getRange(husband.rowIndex + 1, husbandPdfIdColIndex + 1).setValue(pdfId);
          
          wifeSheet.getRange(wife.rowIndex + 1, wifePdfGeneratedColIndex + 1).setValue('Sí');
          wifeSheet.getRange(wife.rowIndex + 1, wifePdfIdColIndex + 1).setValue(pdfId);
          
          debugInfo.push(`Informe generado para pareja: ${husband.name} (${husband.email}) y ${wife.name} (${wife.email})`);
          processedCount++;
        } catch (e) {
          debugInfo.push(`Error al generar PDF para pareja ${husband.name} (${husband.email}) y ${wife.name} (${wife.email}): ${e.toString()}`);
          errorCount++;
        }
      } else {
        debugInfo.push(`No se encontró pareja para ${husband.name} (${husband.email}), email de esposa: ${husband.spouseEmail}`);
      }
    }
    
    // Registrar información de depuración en el log
    Logger.log(debugInfo.join('\n'));
    
    return {
      success: true,
      message: `Procesamiento completado. ${processedCount} informes de pareja generados. ${errorCount} errores.`,
      debug: debugInfo.join('\n')
    };
    
  } catch (error) {
    Logger.log('Error en processReportsByDateRange: ' + error.toString());
    return {
      success: false,
      message: 'Error al procesar informes: ' + error.toString()
    };
  }
}

// Función para generar informe de pareja por email
function generateCoupleReportByEmail(email1, email2, regenerate = false) {
  try {
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const husbandSheets = ['Esposos', 'Esposos-portugues'];
    const wifeSheets = ['Esposas', 'Esposas-portugues'];
    
    let husbandData = null;
    let wifeData = null;
    let husbandSheet = null;
    let wifeSheet = null;
    let husbandRow = -1;
    let wifeRow = -1;
    
    // Buscar el primer email en las hojas de esposos
    for (const sheetName of husbandSheets) {
      const sheet = spreadsheet.getSheetByName(sheetName);
      if (!sheet) continue;
      
      const data = sheet.getDataRange().getValues();
      if (data.length <= 1) continue;
      
      const headers = data[0];
      const emailColIndex = headers.indexOf('Email');
      
      // Buscar email1
      for (let i = 1; i < data.length; i++) {
        if (data[i][emailColIndex] === email1) {
          husbandData = data[i];
          husbandSheet = sheet;
          husbandRow = i;
          break;
        }
      }
      
      if (husbandData) break;
    }
    
    // Si no se encontró en las hojas de esposos, buscar en las hojas de esposas
    if (!husbandData) {
      for (const sheetName of wifeSheets) {
        const sheet = spreadsheet.getSheetByName(sheetName);
        if (!sheet) continue;
        
        const data = sheet.getDataRange().getValues();
        if (data.length <= 1) continue;
        
        const headers = data[0];
        const emailColIndex = headers.indexOf('Email');
        
        // Buscar email1
        for (let i = 1; i < data.length; i++) {
          if (data[i][emailColIndex] === email1) {
            wifeData = data[i];
            wifeSheet = sheet;
            wifeRow = i;
            break;
          }
        }
        
        if (wifeData) break;
      }
    }
    
    // Buscar el segundo email en las hojas de esposas si el primero era un esposo
    if (husbandData) {
      for (const sheetName of wifeSheets) {
        const sheet = spreadsheet.getSheetByName(sheetName);
        if (!sheet) continue;
        
        const data = sheet.getDataRange().getValues();
        if (data.length <= 1) continue;
        
        const headers = data[0];
        const emailColIndex = headers.indexOf('Email');
        
        // Buscar email2
        for (let i = 1; i < data.length; i++) {
          if (data[i][emailColIndex] === email2) {
            wifeData = data[i];
            wifeSheet = sheet;
            wifeRow = i;
            break;
          }
        }
        
        if (wifeData) break;
      }
    } 
    // Buscar el segundo email en las hojas de esposos si el primero era una esposa
    else if (wifeData) {
      for (const sheetName of husbandSheets) {
        const sheet = spreadsheet.getSheetByName(sheetName);
        if (!sheet) continue;
        
        const data = sheet.getDataRange().getValues();
        if (data.length <= 1) continue;
        
        const headers = data[0];
        const emailColIndex = headers.indexOf('Email');
        
        // Buscar email2
        for (let i = 1; i < data.length; i++) {
          if (data[i][emailColIndex] === email2) {
            husbandData = data[i];
            husbandSheet = sheet;
            husbandRow = i;
            break;
          }
        }
        
        if (husbandData) break;
      }
    }
    
    // Verificar si se encontraron ambos emails
    if (!husbandData) {
      return {
        success: false,
        message: `No se encontró un esposo con el email: ${husbandData ? email2 : email1}`
      };
    }
    
    if (!wifeData) {
      return {
        success: false,
        message: `No se encontró una esposa con el email: ${wifeData ? email1 : email2}`
      };
    }
    
    // Verificar si ya se generó un informe y si se debe regenerar
    const husbandHeaders = husbandSheet.getDataRange().getValues()[0];
    const husbandPdfGeneratedColIndex = husbandHeaders.indexOf('PDF_Generado');
    const husbandPdfIdColIndex = husbandHeaders.indexOf('ID_PDF');
    
    if (husbandData[husbandPdfGeneratedColIndex] === 'Sí' && !regenerate) {
      return {
        success: false,
        message: `Ya existe un informe generado para esta pareja. Marque la opción "Regenerar informe" si desea crear uno nuevo.`
      };
    }
    
    // Obtener índices de factores para el esposo
    const husbandFactorIndices = {
      'CONSENSO': husbandHeaders.indexOf('CONSENSO'),
      'SATISFACCION': husbandHeaders.indexOf('SATISFACCION'),
      'COHESION': husbandHeaders.indexOf('COHESION'),
      'EXPRESION DE AFECTO': husbandHeaders.indexOf('EXPRESION DE AFECTO'),
      'CONEXION SEXUAL': husbandHeaders.indexOf('CONEXION SEXUAL'),
      'TOTAL': husbandHeaders.indexOf('TOTAL')
    };
    
    // Obtener índices de factores para la esposa
    const wifeHeaders = wifeSheet.getDataRange().getValues()[0];
    const wifePdfGeneratedColIndex = wifeHeaders.indexOf('PDF_Generado');
    const wifePdfIdColIndex = wifeHeaders.indexOf('ID_PDF');
    
    const wifeFactorIndices = {
      'CONSENSO': wifeHeaders.indexOf('CONSENSO'),
      'SATISFACCION': wifeHeaders.indexOf('SATISFACCION'),
      'COHESION': wifeHeaders.indexOf('COHESION'),
      'EXPRESION DE AFECTO': wifeHeaders.indexOf('EXPRESION DE AFECTO'),
      'CONEXION SEXUAL': wifeHeaders.indexOf('CONEXION SEXUAL'),
      'TOTAL': wifeHeaders.indexOf('TOTAL')
    };
    
    // Obtener datos adicionales para el nombre del archivo
    const nameColIndex = husbandHeaders.indexOf('Nombre');
    const paisColIndex = husbandHeaders.indexOf('País');
    //const ciudadColIndex = husbandHeaders.indexOf('Ciudad');
    const dateColIndex = husbandHeaders.indexOf('Fecha');
    
    const wifeNameColIndex = wifeHeaders.indexOf('Nombre');
    
    const husbandName = husbandData[nameColIndex] || '';
    const wifeName = wifeData[wifeNameColIndex] || '';
    const pais = husbandData[paisColIndex] || '';
    //const ciudad = husbandData[ciudadColIndex] || '';
    const date = husbandData[dateColIndex] || new Date().toISOString().split('T')[0];
    
    // Formatear la fecha para el nombre del archivo
    let formattedDate = '';
    if (date instanceof Date) {
      formattedDate = Utilities.formatDate(date, "America/Guatemala", "yyyy-MM-dd");
    } else {
      formattedDate = date.toString().replace(/\//g, '-');
    }
    
    // Generar el nombre del archivo según la estructura solicitada
    const fileName = `Informe Matrimonial - ${husbandName} - ${wifeName} - ${pais} - ${formattedDate}`;
    
    // Determinar si es portugués basado en el nombre de la hoja
    const isPortuguese = husbandSheet.getName().includes('portugues') || wifeSheet.getName().includes('portugues');
    
    // Generar el informe PDF
    const pdfId = generateCoupleReport(husbandData, wifeData, husbandFactorIndices, wifeFactorIndices, isPortuguese, fileName);
    
    // Actualizar ambas filas con la información del PDF generado
    husbandSheet.getRange(husbandRow + 1, husbandPdfGeneratedColIndex + 1).setValue('Sí');
    husbandSheet.getRange(husbandRow + 1, husbandPdfIdColIndex + 1).setValue(pdfId);
    
    wifeSheet.getRange(wifeRow + 1, wifePdfGeneratedColIndex + 1).setValue('Sí');
    wifeSheet.getRange(wifeRow + 1, wifePdfIdColIndex + 1).setValue(pdfId);
    
    // Obtener URL del PDF
    const pdfUrl = DriveApp.getFileById(pdfId).getUrl ();
    
    return {
      success: true,
      message: `Informe generado exitosamente para la pareja ${husbandName} y ${wifeName}.\nPuede acceder al PDF en: ${pdfUrl}`
    };
    
  } catch (error) {
    Logger.log('Error en generateCoupleReportByEmail: ' + error.toString());
    return {
      success: false,
      message: 'Error al generar informe: ' + error.toString()
    };
  }
}

// Función para generar un informe PDF para una pareja
function generateCoupleReport(husbandData, wifeData, husbandFactorIndices, wifeFactorIndices, isPortuguese, fileName) {
  try {
    // Abrir la plantilla de documento
    const templateDoc = DriveApp.getFileById(TEMPLATE_DOC_ID);
    
    // Crear una copia de la plantilla
    const folder = DriveApp.getFolderById(FOLDER_ID);
    const templateDocCopy = templateDoc.makeCopy(fileName, folder);
    const docId = templateDocCopy.getId();
    
    // Abrir el documento copiado para edición
    const doc = DocumentApp.openById(docId);
    const body = doc.getBody();
    
    // Preparar los datos para reemplazar en la plantilla
    const replacements = {};
    
    // Obtener índices de columnas importantes para el esposo
    const husbandHeaders = ['Nombre', 'Fecha', 'Email', 'País', 'Ciudad'];
    const husbandIndices = husbandHeaders.map(header => {
      const index = husbandFactorIndices[header] || -1;
      return index;
    });
    
    // Obtener índices de columnas importantes para la esposa
    const wifeHeaders = ['Nombre', 'Email'];
    const wifeIndices = wifeHeaders.map(header => {
      const index = wifeFactorIndices[header] || -1;
      return index;
    });
    
    // Datos personales del esposo
    const husbandNameIndex = 2; // Índice de la columna 'Nombre'
    const husbandDateIndex = 1; // Índice de la columna 'Fecha'
    const husbandEmailIndex = 3; // Índice de la columna 'Email'
    const husbandPaisIndex = 8; // Índice de la columna 'País'
    const husbandCiudadIndex = 9; // Índice de la columna 'Ciudad'
    
    // Nuevos marcadores para el esposo
    replacements['{{nombre esposo}}'] = husbandData[husbandNameIndex] || '';
    replacements['{{fecha}}'] = husbandData[husbandDateIndex] || '';
    replacements['{{email esposo}}'] = husbandData[husbandEmailIndex] || '';
    replacements['{{pais}}'] = husbandData[husbandPaisIndex] || '';
    replacements['{{ciudad}}'] = husbandData[husbandCiudadIndex] || '';
    
    // Factores del esposo
    const consensoEsposo = husbandData[husbandFactorIndices['CONSENSO']] || 0;
    const satisfaccionEsposo = husbandData[husbandFactorIndices['SATISFACCION']] || 0;
    const cohesionEsposo = husbandData[husbandFactorIndices['COHESION']] || 0;
    const expresionAfectoEsposo = husbandData[husbandFactorIndices['EXPRESION DE AFECTO']] || 0;
    const conexionSexualEsposo = husbandData[husbandFactorIndices['CONEXION SEXUAL']] || 0;
    const totalEsposo = husbandData[husbandFactorIndices['TOTAL']] || 0;
    
    replacements['{{consenso esposo}}'] = consensoEsposo;
    replacements['{{satisfaccion esposo}}'] = satisfaccionEsposo;
    replacements['{{cohesion esposo}}'] = cohesionEsposo;
    replacements['{{expresion_afecto esposo}}'] = expresionAfectoEsposo;
    replacements['{{conexion_sexual esposo}}'] = conexionSexualEsposo;
    replacements['{{total esposo}}'] = totalEsposo;
    
    // Datos personales de la esposa
    const wifeNameIndex = 2; // Índice de la columna 'Nombre'
    const wifeEmailIndex = 3; // Índice de la columna 'Email'
    
    // Nuevos marcadores para la esposa
    replacements['{{nombre_esposa}}'] = wifeData[wifeNameIndex] || '';
    replacements['{{email_esposa}}'] = wifeData[wifeEmailIndex] || '';
    
    // Factores de la esposa
    const consensoEsposa = wifeData[wifeFactorIndices['CONSENSO']] || 0;
    const satisfaccionEsposa = wifeData[wifeFactorIndices['SATISFACCION']] || 0;
    const cohesionEsposa = wifeData[wifeFactorIndices['COHESION']] || 0;
    const expresionAfectoEsposa = wifeData[wifeFactorIndices['EXPRESION DE AFECTO']] || 0;
    const conexionSexualEsposa = wifeData[wifeFactorIndices['CONEXION SEXUAL']] || 0;
    const totalEsposa = wifeData[wifeFactorIndices['TOTAL']] || 0;
    
    replacements['{{consenso_esposa}}'] = consensoEsposa;
    replacements['{{satisfaccion_esposa}}'] = satisfaccionEsposa;
    replacements['{{cohesion_esposa}}'] = cohesionEsposa;
    replacements['{{expresion_afecto_esposa}}'] = expresionAfectoEsposa;
    replacements['{{conexion_sexual_esposa}}'] = conexionSexualEsposa;
    replacements['{{total_esposa}}'] = totalEsposa;
    
   // Textos para CONSENSO esposo
    if (consensoEsposo > 50) {
      replacements['{{titulo consenso esposo}}'] = 'Nível Ótimo (verde) +50';
      replacements['{{texto consenso esposo}}'] = 'Em relação ao consenso no relacionamento, seus resultados indicam que você concorda e se sente satisfeito na maneira como lida com as questões que são importantes dentro de seu relacionamento, como a tomada de decisões conjuntas, a comunicação aberta e eficaz, o respeito mútuo e a capacidade de resolver conflitos de forma construtiva. Vocês trabalham juntos para manter um relacionamento saudável e equilibrado, no qual se sintam valorizados e ouvidos.';
    } else if (consensoEsposo >= 30 && consensoEsposo <= 50) {
      replacements['{{titulo consenso esposo}}'] = 'Nível de alerta (amarelo) entre 30 e 50';
      replacements['{{texto consenso esposo}}'] = 'Em relação ao consenso dentro da relação, seus resultados indicam que é necessário prestar mais atenção à forma como as decisões estão sendo tomadas e como estão resolvendo seus conflitos, a fim de melhorar seu relacionamento, verificando que ambos se sintam ouvidos, compreendidos e respeitados. Lembre-se que sempre haverá oportunidades de melhoria em todos os relacionamentos.';
    } else {
      replacements['{{titulo consenso esposo}}'] = 'Nível ruim (vermelho) -30';
      replacements['{{texto consenso esposo}}'] = 'Em relação ao consenso na relação, seus resultados indicam que existem algumas discrepâncias significativas, como a falta de concordância na forma como questões importantes na relação são tratadas, conflitos persistentes, manifestando-se em comunicação deficiente, falta de compromisso ou respeito mútuo, dificuldade em resolver conflitos de forma construtiva. Você não está trabalhando efetivamente para manter um relacionamento saudável e satisfatório, o que pode levar a tensões, frustrações e problemas mais sérios se você não trabalhar nessa área imediatamente.';
    }
    
    // Textos para CONSENSO esposa
    if (consensoEsposa > 50) {
      replacements['{{titulo consenso esposa}}'] = 'Nível Ótimo (verde) +50';
      replacements['{{texto consenso esposa}}'] = 'Em relação ao consenso no relacionamento, seus resultados indicam que você concorda e se sente satisfeito na maneira como lida com as questões que são importantes dentro de seu relacionamento, como a tomada de decisões conjuntas, a comunicação aberta e eficaz, o respeito mútuo e a capacidade de resolver conflitos de forma construtiva. Vocês trabalham juntos para manter um relacionamento saudável e equilibrado, no qual se sintam valorizados e ouvidos.';
    } else if (consensoEsposa >= 30 && consensoEsposa <= 50) {
      replacements['{{titulo consenso esposa}}'] = 'Nível de alerta (amarelo) entre 30 e 50';
      replacements['{{texto consenso esposa}}'] = 'Em relação ao consenso dentro da relação, seus resultados indicam que é necessário prestar mais atenção à forma como as decisões estão sendo tomadas e como estão resolvendo seus conflitos, a fim de melhorar seu relacionamento, verificando que ambos se sintam ouvidos, compreendidos e respeitados. Lembre-se que sempre haverá oportunidades de melhoria em todos os relacionamentos.';
    } else {
      replacements['{{titulo consenso esposa}}'] = 'Nivel deficiente (rojo) -30';
      replacements['{{texto consenso esposa}}'] = 'En cuanto al consenso en la relación de pareja, tus resultados indican que, existen algunas discrepancias significativas, como la falta de acuerdo en la manera en la que se manejan los asuntos importantes de la relación, conflictos persistentes, manifestándose en una comunicación deficiente, falta de compromiso o respeto mutuo, dificultad para resolver conflictos de manera constructiva. No se está trabajando de manera efectiva para lograr mantener una relación saludable y satisfactoria, lo que puede llevar a tensiones, frustraciones y problemas más graves si no se trabaja en esta área inmediatamente.';
    }
    
    // Textos para SATISFACCION esposo
    if (satisfaccionEsposo > 50) {
      replacements['{{titulo satisfaccion esposo}}'] = 'Nível ótimo (verde) +50';
      replacements['{{texto satisfaccion esposo}}'] = 'Em relação ao  fator satisfação  no relacionamento, seus resultados indicam que você se sente feliz e satisfeito em termos da dinâmica e qualidade de seu relacionamento, com boa comunicação, confiança e segurança e comprometido em trabalhar em equipe. Isso implica que você se sinta valorizado, respeitado, apoiado e amado, com uma conexão profunda com seu parceiro.';
    } else if (satisfaccionEsposo >= 30 && satisfaccionEsposo <= 50) {
      replacements['{{titulo satisfaccion esposo}}'] = 'Nível de alerta (amarelo) entre 30 e 50';
      replacements['{{texto satisfaccion esposo}}'] = 'Quanto ao fator satisfação  no relacionamento, seus resultados indicam que você deve prestar mais atenção à comunicação como casal, trabalhar a confiança, o apoio e o comprometimento, garantindo o crescimento pessoal e espiritual na relação, e o respeito mútuo, reconhecendo o valor das opiniões, desejos e limites do casal.';
    } else {
      replacements['{{titulo satisfaccion esposo}}'] = 'Nível ruim (vermelho) -30';
      replacements['{{texto satisfaccion esposo}}'] = 'Quanto ao fator satisfação no casal, seus resultados indicam que você não se sente feliz ou satisfeito com a dinâmica do relacionamento, manifestando-se em comunicação deficiente, falta de apoio emocional, conflitos frequentes e não resolvidos, diferenças em termos de valores ou objetivos, causando a este um desconforto geral dentro da relação.';
    }
    
    // Textos para SATISFACCION esposa
    if (satisfaccionEsposa > 50) {
      replacements['{{titulo satisfaccion esposa}}'] = 'Nível ótimo (verde) +50';
      replacements['{{texto satisfaccion esposa}}'] = 'Em relação ao  fator satisfação  no relacionamento, seus resultados indicam que você se sente feliz e satisfeito em termos da dinâmica e qualidade de seu relacionamento, com boa comunicação, confiança e segurança e comprometido em trabalhar em equipe. Isso implica que você se sinta valorizado, respeitado, apoiado e amado, com uma conexão profunda com seu parceiro.';
    } else if (satisfaccionEsposa >= 30 && satisfaccionEsposa <= 50) {
      replacements['{{titulo satisfaccion esposa}}'] = 'Nível de alerta (amarelo) entre 30 e 50';
      replacements['{{texto satisfaccion esposa}}'] = 'Quanto ao fator satisfação  no relacionamento, seus resultados indicam que você deve prestar mais atenção à comunicação como casal, trabalhar a confiança, o apoio e o comprometimento, garantindo o crescimento pessoal e espiritual na relação, e o respeito mútuo, reconhecendo o valor das opiniões, desejos e limites do casal.';
    } else {
      replacements['{{titulo satisfaccion esposa}}'] = 'Nível ruim (vermelho) -30';
      replacements['{{texto satisfaccion esposa}}'] = 'Quanto ao fator satisfação no casal, seus resultados indicam que você não se sente feliz ou satisfeito com a dinâmica do relacionamento, manifestando-se em comunicação deficiente, falta de apoio emocional, conflitos frequentes e não resolvidos, diferenças em termos de valores ou objetivos, causando a este um desconforto geral dentro da relação.';
    }
    
    // Textos para COHESION esposo
    if (cohesionEsposo > 50) {
      replacements['{{titulo cohesion esposo}}'] = 'Nível ótimo (verde) + 50';
      replacements['{{texto cohesion esposo}}'] = 'Em relação ao fator   coesão na relação do casal, seus resultados indicam que há um forte senso de união, conexão e proximidade com seu parceiro, onde há confiança, apoio incondicional, comunicação efetiva, compatibilidade, resolução construtiva de conflitos, onde há perdão e reconciliação, conseguindo com isso, ter uma unidade com propósito que contribui para ter um relacionamento sólido.';
    } else if (cohesionEsposo >= 30 && cohesionEsposo <= 50) {
      replacements['{{titulo cohesion esposo}}'] = 'Nível de alerta (amarelo) entre 30 e 50';
      replacements['{{texto cohesion esposo}}'] = 'Em relação ao  fator coesão  na relação, seus resultados indicam que você deve trabalhar a comunicação como casal para que ela seja aberta e honesta, em estar comprometido em melhorar seu relacionamento, oferecendo apoio e onde o perdão e a reconciliação tenham lugar, trabalhando em conjunto com seu parceiro em metas e objetivos comuns.';
    } else {
      replacements['{{titulo cohesion esposo}}'] = 'Nível ruim (vermelho) -30';
      replacements['{{texto cohesion esposo}}'] = 'Em relação ao fator  coesão  na relação, seus resultados indicam que há falta de conexão, proximidade e união com seu parceiro, tendo como indicador a falta de boa comunicação, confiança, apoio mútuo, respeito, onde o perdão e a reconciliação não têm lugar, levando-os a ter frequentes conflitos não resolvidos.';
    }
    
    // Textos para COHESION esposa
    if (cohesionEsposa > 50) {
      replacements['{{titulo cohesion esposa}}'] = 'Nível ótimo (verde) + 50';
      replacements['{{texto cohesion esposa}}'] = 'Em relação ao fator   coesão na relação do casal, seus resultados indicam que há um forte senso de união, conexão e proximidade com seu parceiro, onde há confiança, apoio incondicional, comunicação efetiva, compatibilidade, resolução construtiva de conflitos, onde há perdão e reconciliação, conseguindo com isso, ter uma unidade com propósito que contribui para ter um relacionamento sólido.';
    } else if (cohesionEsposa >= 30 && cohesionEsposa <= 50) {
      replacements['{{titulo cohesion esposa}}'] = 'Nível de alerta (amarelo) entre 30 e 50';
      replacements['{{texto cohesion esposa}}'] = 'Em relação ao  fator coesão  na relação, seus resultados indicam que você deve trabalhar a comunicação como casal para que ela seja aberta e honesta, em estar comprometido em melhorar seu relacionamento, oferecendo apoio e onde o perdão e a reconciliação tenham lugar, trabalhando em conjunto com seu parceiro em metas e objetivos comuns.';
    } else {
      replacements['{{titulo cohesion esposa}}'] = 'Nível ruim (vermelho) -30';
      replacements['{{texto cohesion esposa}}'] = 'Em relação ao fator  coesão  na relação, seus resultados indicam que há falta de conexão, proximidade e união com seu parceiro, tendo como indicador a falta de boa comunicação, confiança, apoio mútuo, respeito, onde o perdão e a reconciliação não têm lugar, levando-os a ter frequentes conflitos não resolvidos.';
    }
    
    // Textos para EXPRESION DE AFECTO esposo
    if (expresionAfectoEsposo > 50) {
      replacements['{{titulo expresion_afecto esposo}}'] = 'Nível ótimo (verde) + 50';
      replacements['{{texto expresion_afecto esposo}}'] = 'Em relação ao fator expressão de afeto, seus resultados indicam que há uma boa comunicação verbal e não verbal em seu relacionamento, expressa com palavras e demonstrações de afeto e serviço, onde ocorrem presentes e detalhes em relação ao seu parceiro, há interesse em ouvir seu parceiro e onde a gratidão pode ser facilmente expressa.';
    } else if (expresionAfectoEsposo >= 30 && expresionAfectoEsposo <= 50) {
      replacements['{{titulo expresion_afecto esposo}}'] = 'Nível de alerta (amarelo) entre 30 e 50';
      replacements['{{texto expresion_afecto esposo}}'] = 'Em relação ao fator expressão de afeto, seus resultados indicam que você deve prestar mais atenção à forma como está se comunicando com seu parceiro, seja verbalmente ou não verbalmente, trabalhando a gratidão e as expressões de afeto para com seu parceiro, você deve tentar demonstrar maior interesse em ouvir ativamente, tudo isso a fim de fortalecer o vínculo afetivo e alcançar um relacionamento amoroso,  satisfatória e duradoura.';
    } else {
      replacements['{{titulo expresion_afecto esposo}}'] = 'Nível ruim (vermelho) -30';
      replacements['{{texto expresion_afecto esposo}}'] = 'Em relação ao fator expressão de afeto, seus resultados indicam que, em sua relação com seu parceiro, há uma considerável falta de demonstrações de afeto, ternura e apreço, destacando-se a falta de gestos afetuosos, falta de atenção e cuidado, expressões de gratidão, falta de detalhes, escuta defeituosa, sem atos de serviço, causando um desligamento,  uma distância emocional e física.';
    }
    
    // Textos para EXPRESION DE AFECTO esposa
    if (expresionAfectoEsposa > 50) {
      replacements['{{titulo expresion_afecto esposa}}'] = 'Nível ótimo (verde) + 50';
      replacements['{{texto expresion_afecto esposa}}'] = 'Em relação ao fator expressão de afeto, seus resultados indicam que há uma boa comunicação verbal e não verbal em seu relacionamento, expressa com palavras e demonstrações de afeto e serviço, onde ocorrem presentes e detalhes em relação ao seu parceiro, há interesse em ouvir seu parceiro e onde a gratidão pode ser facilmente expressa.';
    } else if (expresionAfectoEsposa >= 30 && expresionAfectoEsposa <= 50) {
      replacements['{{titulo expresion_afecto esposa}}'] = 'Nível de alerta (amarelo) entre 30 e 50';
      replacements['{{texto expresion_afecto esposa}}'] = 'Em relação ao fator expressão de afeto, seus resultados indicam que você deve prestar mais atenção à forma como está se comunicando com seu parceiro, seja verbalmente ou não verbalmente, trabalhando a gratidão e as expressões de afeto para com seu parceiro, você deve tentar demonstrar maior interesse em ouvir ativamente, tudo isso a fim de fortalecer o vínculo afetivo e alcançar um relacionamento amoroso,  satisfatória e duradoura.';
    } else {
      replacements['{{titulo expresion_afecto esposa}}'] = 'Nível ruim (vermelho) -30';
      replacements['{{texto expresion_afecto esposa}}'] = 'Em relação ao fator expressão de afeto, seus resultados indicam que, em sua relação com seu parceiro, há uma considerável falta de demonstrações de afeto, ternura e apreço, destacando-se a falta de gestos afetuosos, falta de atenção e cuidado, expressões de gratidão, falta de detalhes, escuta defeituosa, sem atos de serviço, causando um desligamento,  uma distância emocional e física.';
    }
    
    // Textos para CONEXION SEXUAL esposo
    if (conexionSexualEsposo > 50) {
      replacements['{{titulo conexion_sexual esposo}}'] = 'Nível ótimo (verde) +50';
      replacements['{{texto conexion_sexual esposo}}'] = 'Quanto ao  fator conexão sexual  no relacionamento, seus resultados indicam que você vivencia uma intimidade sexual satisfatória e gratificante, que vai além da atividade sexual em si, envolvendo uma série de aspectos que contribuem para uma conexão sexual saudável e plena, onde há respeito, boa comunicação, confiança e o compromisso de manter essa satisfação e conexão sexual ao longo do tempo.';
    } else if (conexionSexualEsposo >= 30 && conexionSexualEsposo <= 50) {
      replacements['{{titulo conexion_sexual esposo}}'] = 'Nível de alerta (amarelo) entre 30 e 50';
      replacements['{{texto conexion_sexual esposo}}'] = 'Em relação ao fator conexão sexual no relacionamento, seus resultados indicam que você deve prestar maior atenção e cuidado em termos da expressão física e emocional do amor para com seu parceiro, buscando uma comunicação aberta e honesta, onde você possa expressar as coisas que gosta e as que não gosta, sem medo de ser criticado.  respeitar os limites e desejos do seu parceiro na esfera sexual, esforçando-se para ter uma vontade de manter essa conexão sexual e satisfação ao longo do tempo.';
    } else {
      replacements['{{titulo conexion_sexual esposo}}'] = 'Nível ruim (vermelho) - 30';
      replacements['{{texto conexion_sexual esposo}}'] = 'Em relação ao  fator conexão sexual  no relacionamento, seus resultados indicam que você está vivenciando dificuldades, insatisfação ou desarmonia em sua vida sexual, tendo como indicadores, falta de desejo sexual, monotonia, problemas de comunicação onde você fala honestamente sobre necessidades sexuais, limites e desejos, desconexão física e emocional com seu parceiro.';
    }
    
    // Textos para CONEXION SEXUAL esposa
    if (conexionSexualEsposa > 50) {
      replacements['{{titulo conexion_sexual esposa}}'] = 'Nível ótimo (verde) +50';
      replacements['{{texto conexion_sexual esposa}}'] = 'Quanto ao  fator conexão sexual  no relacionamento, seus resultados indicam que você vivencia uma intimidade sexual satisfatória e gratificante, que vai além da atividade sexual em si, envolvendo uma série de aspectos que contribuem para uma conexão sexual saudável e plena, onde há respeito, boa comunicação, confiança e o compromisso de manter essa satisfação e conexão sexual ao longo do tempo.';
    } else if (conexionSexualEsposa >= 30 && conexionSexualEsposa <= 50) {
      replacements['{{titulo conexion_sexual esposa}}'] = 'Nível de alerta (amarelo) entre 30 e 50';
      replacements['{{texto conexion_sexual esposa}}'] = 'Em relação ao fator conexão sexual no relacionamento, seus resultados indicam que você deve prestar maior atenção e cuidado em termos da expressão física e emocional do amor para com seu parceiro, buscando uma comunicação aberta e honesta, onde você possa expressar as coisas que gosta e as que não gosta, sem medo de ser criticado.  respeitar os limites e desejos do seu parceiro na esfera sexual, esforçando-se para ter uma vontade de manter essa conexão sexual e satisfação ao longo do tempo.';
    } else {
      replacements['{{titulo conexion_sexual esposa}}'] = 'Nível ruim (vermelho) - 30';
      replacements['{{texto conexion_sexual esposa}}'] = 'Em relação ao  fator conexão sexual  no relacionamento, seus resultados indicam que você está vivenciando dificuldades, insatisfação ou desarmonia em sua vida sexual, tendo como indicadores, falta de desejo sexual, monotonia, problemas de comunicação onde você fala honestamente sobre necessidades sexuais, limites e desejos, desconexão física e emocional com seu parceiro.';
    }
    
    // Reemplazar todos los marcadores en el documento
    for (const [marker, value] of Object.entries(replacements)) {
      body.replaceText(marker, value.toString());
    }
    
    // Aplicar colores a las palabras clave
    aplicarColorTexto(body, "(verde)", "#008000");  // Verde
    aplicarColorTexto(body, "(amarelo)", "#FFD700"); // Amarillo (dorado)
    aplicarColorTexto(body, "(rojo)", "#FF0000");   // Rojo
  
    // Guardar y cerrar el documento
    doc.saveAndClose();
    
    // Convertir el documento a PDF
    const blob = templateDocCopy.getAs('application/pdf');
    
    // Guardar el PDF en la carpeta especificada
    const pdfFile = folder.createFile(blob);
    pdfFile.setName(fileName + '.pdf');
    
    // Eliminar el documento temporal
    templateDocCopy.setTrashed(true);
    
    // Devolver el ID del archivo PDF
    return pdfFile.getId();
  } catch (error) {
    Logger.log('Error en generateCoupleReport: ' + error.toString());
    throw new Error('Error al generar el informe PDF: ' + error.toString());
  }
}

/**
 * Aplica color a todas las apariciones de una palabra en un documento.
 */
function aplicarColorTexto(body, palabra, color) {
  var textElement = body.editAsText();
  var textoCompleto = textElement.getText();
  var posicion = 0;

  while ((posicion = textoCompleto.indexOf(palabra, posicion)) !== -1) {
    textElement.setForegroundColor(posicion, posicion + palabra.length, color);
    posicion += palabra.length; // Avanza en el texto para evitar bucles infinitos
  }
}

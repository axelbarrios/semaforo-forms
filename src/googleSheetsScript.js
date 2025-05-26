/* // --- Funciones Web App (POST/GET) ---

/**
 * Handles HTTP POST requests to add data to the sheet and then calculate sums.
 * @param {GoogleAppsScript.Events.DoPost} e The event parameter.
 */
function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Get the appropriate sheet based on spouse type (Esposos or Esposas)
    // Ensure data.sheetName is provided and valid.
    if (!data.sheetName) {
      throw new Error("sheetName not provided in POST data");
    }
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(data.sheetName);
    
    if (!sheet) {
      throw new Error(`Sheet ${data.sheetName} not found`);
    }

    // Prepare row data in the correct order
    const rowData = [
      new Date(),                                   // Fecha
      data.personalInfo.name,                       // Nombre
      data.email,                                   // Email
      data.personalInfo.age,                        // Edad
      data.personalInfo.ocupacion,                  // Ocupación
      data.personalInfo.religion,                   // Religión
      data.personalInfo.education,                  // Educación
      languageMap[data.language] || data.language,  // Idioma
      data.personalInfo.pais,                       // País
      data.personalInfo.ciudad,                     // Ciudad
      data.personalInfo.maritalStatus,              // Estado Civil
      data.personalInfo.timeAsCouple,               // Tiempo como pareja
      data.personalInfo.previousMarriages,          // Matrimonios anteriores
      data.personalInfo.numberOfChildren,           // Número de hijos
      data.personalInfo.spouseEmail,                // Email del cónyuge
    ];

    // Add answers (questions 1-75)
    // Ensure data.answers is an object or array that can be indexed from 1 to 75
    if (!data.answers) {
        throw new Error("Answers not provided in POST data");
    }
    for (let i = 1; i <= 75; i++) {
      rowData.push(data.answers[i] || ''); // Use empty string if an answer is missing
    }

    // Append the row to the appropriate sheet
    sheet.appendRow(rowData);
    
    // After appending data, call calcularSumatorias for the updated sheet
    try {
      console.log(`Intentando calcular sumatorias para la hoja: ${sheet.getName()} después de doPost.`);
      calcularSumatorias(sheet, false); // isManualRun = false
    } catch (calcError) {
      console.error(`Error durante calcularSumatorias llamado desde doPost para la hoja ${sheet.getName()}: ${calcError.toString()}`);
      // Continue to return success for data saving, but log the calculation error.
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Data saved successfully. Sum calculations attempted.'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error(`Error en doPost: ${error.toString()}`);
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handles HTTP GET requests.
 * @param {GoogleAppsScript.Events.DoGet} e The event parameter.
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    error: 'GET method not supported. Please use POST.'
  })).setMimeType(ContentService.MimeType.JSON);
}

// --- Lógica de Cálculo de Sumatorias ---

/**
 * Calcula la suma de los valores en rangos de columnas especificados
 * y coloca los resultados en las columnas "CONSENSO", "SATISFACCION", "COHESION",
 * "EXPRESION DE AFECTO", "CONEXION SEXUAL" y "TOTAL".
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet La hoja en la que operar.
 * @param {boolean} isManualRun Indica si la ejecución es manual (para mostrar UI alerts).
 */
function calcularSumatorias(sheet, isManualRun = false) {
  // Obtener todos los datos de la hoja
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();

  // Si no hay datos o solo encabezados, salir.
  if (values.length <= 1) {
    const message = `Hoja '${sheet.getName()}': No hay datos para procesar (después de la fila de encabezados).`;
    if (isManualRun) {
      SpreadsheetApp.getUi().alert("Información", message, SpreadsheetApp.getUi().ButtonSet.OK);
    } else {
      console.log(message);
    }
    return;
  }

  // Obtener la fila de encabezados (primera fila)
  const headers = values[0];

  // Inicializar índices de columnas
  let pregunta1Col = -1, pregunta15Col = -1, consensoCol = -1;
  let pregunta16Col = -1, pregunta30Col = -1, satisfaccionCol = -1;
  let pregunta31Col = -1, pregunta45Col = -1, cohesionCol = -1;
  let pregunta46Col = -1, pregunta60Col = -1, expresionAfectoCol = -1;
  let pregunta61Col = -1, pregunta75Col = -1, conexionSexualCol = -1;
  let totalCol = -1;

  // Recorrer los encabezados para encontrar los índices de todas las columnas
  for (let i = 0; i < headers.length; i++) {
    const headerText = headers[i].toString().toLowerCase().trim();
    switch (headerText) {
      case "pregunta 1": pregunta1Col = i; break;
      case "pregunta 15": pregunta15Col = i; break;
      case "consenso": consensoCol = i; break;
      case "pregunta 16": pregunta16Col = i; break;
      case "pregunta 30": pregunta30Col = i; break;
      case "satisfaccion": satisfaccionCol = i; break;
      case "pregunta 31": pregunta31Col = i; break;
      case "pregunta 45": pregunta45Col = i; break;
      case "cohesion": cohesionCol = i; break;
      case "pregunta 46": pregunta46Col = i; break;
      case "pregunta 60": pregunta60Col = i; break;
      case "expresion de afecto": expresionAfectoCol = i; break;
      case "pregunta 61": pregunta61Col = i; break;
      case "pregunta 75": pregunta75Col = i; break;
      case "conexion sexual": conexionSexualCol = i; break;
      case "total": totalCol = i; break;
    }
  }

  // --- Funciones de validación de columnas ---
  function checkColumn(colIndex, name, group) {
    if (colIndex === -1) {
      const message = `Error ${group} en hoja '${sheet.getName()}': No se encontró la columna '${name}'. Verifica el nombre o créala si no existe.`;
      if (isManualRun) {
        SpreadsheetApp.getUi().alert("Error de Configuración", message, SpreadsheetApp.getUi().ButtonSet.OK);
      } else {
        console.error(message);
      }
      return false;
    }
    return true;
  }

  function checkOrder(startCol, endCol, startName, endName, group) {
    if (startCol > endCol) {
      const message = `Error ${group} en hoja '${sheet.getName()}': La columna '${startName}' aparece después de '${endName}'. Verifica el orden.`;
      if (isManualRun) {
        SpreadsheetApp.getUi().alert("Error de Configuración", message, SpreadsheetApp.getUi().ButtonSet.OK);
      } else {
        console.error(message);
      }
      return false;
    }
    return true;
  }

  // Validaciones
  if (!checkColumn(pregunta1Col, "pregunta 1", "Consenso") || !checkColumn(pregunta15Col, "pregunta 15", "Consenso") || !checkColumn(consensoCol, "CONSENSO", "Consenso") || !checkOrder(pregunta1Col, pregunta15Col, "pregunta 1", "pregunta 15", "Consenso")) return;
  if (!checkColumn(pregunta16Col, "pregunta 16", "Satisfacción") || !checkColumn(pregunta30Col, "pregunta 30", "Satisfacción") || !checkColumn(satisfaccionCol, "SATISFACCION", "Satisfacción") || !checkOrder(pregunta16Col, pregunta30Col, "pregunta 16", "pregunta 30", "Satisfacción")) return;
  if (!checkColumn(pregunta31Col, "pregunta 31", "Cohesión") || !checkColumn(pregunta45Col, "pregunta 45", "Cohesión") || !checkColumn(cohesionCol, "COHESION", "Cohesión") || !checkOrder(pregunta31Col, pregunta45Col, "pregunta 31", "pregunta 45", "Cohesión")) return;
  if (!checkColumn(pregunta46Col, "pregunta 46", "Expresión de Afecto") || !checkColumn(pregunta60Col, "pregunta 60", "Expresión de Afecto") || !checkColumn(expresionAfectoCol, "EXPRESION DE AFECTO", "Expresión de Afecto") || !checkOrder(pregunta46Col, pregunta60Col, "pregunta 46", "pregunta 60", "Expresión de Afecto")) return;
  if (!checkColumn(pregunta61Col, "pregunta 61", "Conexión Sexual") || !checkColumn(pregunta75Col, "pregunta 75", "Conexión Sexual") || !checkColumn(conexionSexualCol, "CONEXION SEXUAL", "Conexión Sexual") || !checkOrder(pregunta61Col, pregunta75Col, "pregunta 61", "pregunta 75", "Conexión Sexual")) return;
  if (!checkColumn(totalCol, "TOTAL", "Total")) return;

  const resultadosConsenso = [], resultadosSatisfaccion = [], resultadosCohesion = [];
  const resultadosExpresionAfecto = [], resultadosConexionSexual = [], resultadosTotal = [];

  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    function sumarRango(start, end) {
      let suma = 0;
      for (let col = start; col <= end; col++) {
        const valorCelda = parseFloat(row[col]);
        if (!isNaN(valorCelda)) suma += valorCelda;
      }
      return suma;
    }

    const sumaConsensoFila = sumarRango(pregunta1Col, pregunta15Col);
    const sumaSatisfaccionFila = sumarRango(pregunta16Col, pregunta30Col);
    const sumaCohesionFila = sumarRango(pregunta31Col, pregunta45Col);
    const sumaExpresionAfectoFila = sumarRango(pregunta46Col, pregunta60Col);
    const sumaConexionSexualFila = sumarRango(pregunta61Col, pregunta75Col);

    resultadosConsenso.push([sumaConsensoFila]);
    resultadosSatisfaccion.push([sumaSatisfaccionFila]);
    resultadosCohesion.push([sumaCohesionFila]);
    resultadosExpresionAfecto.push([sumaExpresionAfectoFila]);
    resultadosConexionSexual.push([sumaConexionSexualFila]);
    resultadosTotal.push([sumaConsensoFila + sumaSatisfaccionFila + sumaCohesionFila + sumaExpresionAfectoFila + sumaConexionSexualFila]);
  }

  let calculosRealizados = 0;
  let mensajeExitoParcial = "";

  function escribirResultados(colIndex, resultados, nombreColumna) {
    if (resultados.length > 0) {
      sheet.getRange(2, colIndex + 1, resultados.length, 1).setValues(resultados);
      calculosRealizados++;
      return `${nombreColumna} actualizada. `;
    }
    return "";
  }

  mensajeExitoParcial += escribirResultados(consensoCol, resultadosConsenso, "Consenso");
  mensajeExitoParcial += escribirResultados(satisfaccionCol, resultadosSatisfaccion, "Satisfacción");
  mensajeExitoParcial += escribirResultados(cohesionCol, resultadosCohesion, "Cohesión");
  mensajeExitoParcial += escribirResultados(expresionAfectoCol, resultadosExpresionAfecto, "Expresión de Afecto");
  mensajeExitoParcial += escribirResultados(conexionSexualCol, resultadosConexionSexual, "Conexión Sexual");
  mensajeExitoParcial += escribirResultados(totalCol, resultadosTotal, "Total");

  if (calculosRealizados > 0) {
    const finalMessage = `Cálculos completados en hoja '${sheet.getName()}': ${mensajeExitoParcial.trim()}`;
    if (isManualRun) {
      SpreadsheetApp.getUi().alert("Éxito", finalMessage, SpreadsheetApp.getUi().ButtonSet.OK);
    } else {
      console.log(finalMessage);
    }
  } else if (values.length > 1 && calculosRealizados === 0) { // Hay datos pero no se pudo escribir nada (raro si las validaciones pasaron)
     const message = `Advertencia en hoja '${sheet.getName()}': Aunque hay datos, no se actualizaron columnas de sumatoria. Revise la configuración y los logs.`;
     if (isManualRun) {
       SpreadsheetApp.getUi().alert("Advertencia", message, SpreadsheetApp.getUi().ButtonSet.OK);
     } else {
       console.warn(message);
     }
  }
  // El caso de values.length <= 1 ya se maneja al inicio.
}

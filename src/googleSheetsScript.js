function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Get the appropriate sheet based on spouse type (Esposos or Esposas)
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(data.sheetName);
    
    if (!sheet) {
      throw new Error(`Sheet ${data.sheetName} not found`);
    }

    // Get headers from the first row
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    // Prepare row data in the correct order
    const rowData = [
      new Date(),                      // Fecha
      data.personalInfo.name,          // Nombre
      data.email,                      // Email
      data.personalInfo.age,           // Edad
      data.personalInfo.ocupacion,     // Ocupación
      data.personalInfo.religion,      // Religión
      data.personalInfo.education,     // Educación
      data.language,                   // Idioma
      data.personalInfo.pais,          // País
      data.personalInfo.ciudad,        // Ciudad
      data.personalInfo.maritalStatus, // Estado Civil
      data.personalInfo.timeAsCouple,  // Tiempo como pareja
      data.personalInfo.previousMarriages, // Matrimonios anteriores
      data.personalInfo.numberOfChildren,  // Número de hijos
      data.personalInfo.spouseEmail,   // Email del cónyuge
      // Add answers data
      ...Object.entries(data.answers)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([_, value]) => value),
      // Add factor totals
      data.CONSENSO,                   // CONSENSO total
      data.SATISFACCION,              // SATISFACCION total
      data.COHESION,                  // COHESION total
      data['EXPRESION DE AFECTO'],    // EXPRESION DE AFECTO total
      data['CONEXION SEXUAL'],        // CONEXION SEXUAL total
      data.TOTAL                      // TOTAL general
    ];

    // Append the row to the appropriate sheet
    sheet.appendRow(rowData);
    
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: 'Data saved successfully'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  // Verify if a sheet ID was provided
  if (!e.parameter.id) {
    return ContentService.createTextOutput(JSON.stringify({
      error: 'Se requiere un ID de hoja de cálculo'
    })).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    // Open the spreadsheet
    const spreadsheet = SpreadsheetApp.openById(e.parameter.id);
    const sheets = spreadsheet.getSheets();
    
    // Get the sheets for husbands and wives
    const espososSheet = spreadsheet.getSheetByName('Esposos') || sheets[0];
    const esposasSheet = spreadsheet.getSheetByName('Esposas') || sheets[1];
    
    // Function to convert sheet data to array of objects
    function sheetToObjects(sheet) {
      const data = sheet.getDataRange().getValues();
      const headers = data[0];
      return data.slice(1).map(row => {
        const obj = {};
        headers.forEach((header, i) => {
          obj[header] = row[i];
        });
        return obj;
      });
    }
    const invertedQuestions = [1, 2, 3, 4, 6, 7, 10, 19, 21, 30, 31, 33, 45, 49, 50, 52, 63, 65, 66, 68, 75];
    
    
    for (let i = 1; i <= 75; i++) {
      rowData.push(data.answers[i] || '');
    }
    
   
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
    
    
    sheet.appendRow(rowData);
    // Prepare the response
    const response = {
      metadata: {
        title: spreadsheet.getName(),
        url: spreadsheet.getUrl(),
        lastUpdated: new Date().toISOString(),
        sheets: {
          esposos: {
            columns: espososSheet.getRange(1, 1, 1, espososSheet.getLastColumn()).getValues()[0],
            rowCount: espososSheet.getLastRow() - 1
          },
          esposas: {
            columns: esposasSheet.getRange(1, 1, 1, esposasSheet.getLastColumn()).getValues()[0],
            rowCount: esposasSheet.getLastRow() - 1
          }
        }
      },
      data: {
        esposos: sheetToObjects(espososSheet),
        esposas: sheetToObjects(esposasSheet)
      }
    };
    
    // Return the response as JSON
    return ContentService.createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      error: 'Error al procesar la hoja: ' + error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}


function applyConditionalFormatting(sheet) {
 
  const lastColumn = sheet.getLastColumn();
  
  
  const factorColumns = [
    lastColumn - 7, // CONSENSO
    lastColumn - 6, // SATISFACCION
    lastColumn - 5, // COHESION
    lastColumn - 4, // EXPRESION DE AFECTO
    lastColumn - 3, // CONEXION SEXUAL
    lastColumn - 2  // TOTAL
  ];
  
  
  factorColumns.forEach(column => {
   
    const range = sheet.getRange(2, column, 1000, 1); // Desde la fila 2 hasta 1000 filas
    
   
    const greenRule = SpreadsheetApp.newConditionalFormatRule()
      .whenNumberGreaterThan(50)
      .setBackground('#b7e1cd') 
      .setRanges([range])
      .build();
    
  
    const yellowRule = SpreadsheetApp.newConditionalFormatRule()
      .whenNumberBetween(30, 50)
      .setBackground('#fce8b2') 
      .setRanges([range])
      .build();
    
    
    const redRule = SpreadsheetApp.newConditionalFormatRule()
      .whenNumberLessThan(30)
      .setBackground('#f4c7c3') 
      .setRanges([range])
      .build();
    
    
    const rules = sheet.getConditionalFormatRules();
    rules.push(greenRule, yellowRule, redRule);
    sheet.setConditionalFormatRules(rules);
  });
  
  
  const pdfGeneratedColumn = lastColumn - 1;
  const pdfGeneratedRange = sheet.getRange(2, pdfGeneratedColumn, 1000, 1);
  
  
  const pdfGeneratedYesRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("Sí")
    .setBackground('#b7e1cd') // Verde claro
    .setRanges([pdfGeneratedRange])
    .build();
  
 
  const pdfGeneratedNoRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("No")
    .setBackground('#fce8b2') // Amarillo claro
    .setRanges([pdfGeneratedRange])
    .build();
  
  
  const pdfRules = sheet.getConditionalFormatRules();
  pdfRules.push(pdfGeneratedYesRule, pdfGeneratedNoRule);
  sheet.setConditionalFormatRules(pdfRules);
}


function calculateFactorScores(answers, invertedQuestions) {
  
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
  
  
  const scores = {};
  
  for (const [factor, definition] of Object.entries(factorDefinitions)) {
    let factorScore = 0;
    let count = 0;
    
    for (const questionId of definition.questions) {
      const answer = answers[questionId];
      
      if (answer) {
        
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


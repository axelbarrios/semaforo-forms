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
    ];

    // Add answers (questions 1-75)
    for (let i = 1; i <= 75; i++) {
      rowData.push(data.answers[i] || '');
    }

    // Calculate factor scores with inverted questions
    const factorScores = calculateFactorScores(data.answers);
    
    // Add factor totals
    rowData.push(
      factorScores.CONSENSO.score,           // CONSENSO total
      factorScores.SATISFACCION.score,       // SATISFACCION total
      factorScores.COHESION.score,           // COHESION total
      factorScores['EXPRESION DE AFECTO'].score, // EXPRESION DE AFECTO total
      factorScores['CONEXION SEXUAL'].score, // CONEXION SEXUAL total
      Object.values(factorScores).reduce((total, factor) => total + factor.score, 0), // TOTAL general
      'No',                           // PDF_Generado
      ''                              // ID_PDF
    );

    // Append the row to the appropriate sheet
    sheet.appendRow(rowData);
    
    // Apply conditional formatting
    applyConditionalFormatting(sheet);
    
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
  
  // Define the columns for factor scores
  const factorColumns = [
    lastColumn - 7, // CONSENSO
    lastColumn - 6, // SATISFACCION
    lastColumn - 5, // COHESION
    lastColumn - 4, // EXPRESION DE AFECTO
    lastColumn - 3, // CONEXION SEXUAL
    lastColumn - 2  // TOTAL
  ];
  
  // Apply formatting rules for each factor column
  factorColumns.forEach(column => {
    const range = sheet.getRange(2, column, sheet.getMaxRows() - 1, 1);
    
    // Clear existing rules for this range
    const rules = sheet.getConditionalFormatRules();
    const newRules = rules.filter(rule => {
      const ranges = rule.getRanges();
      return !ranges.some(r => r.getA1Notation() === range.getA1Notation());
    });
    sheet.setConditionalFormatRules(newRules);
    
    // Add new rules
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
    
    // Apply the new rules
    const updatedRules = sheet.getConditionalFormatRules();
    updatedRules.push(greenRule, yellowRule, redRule);
    sheet.setConditionalFormatRules(updatedRules);
  });
  
  // Format PDF Generated column
  const pdfGeneratedColumn = lastColumn - 1;
  const pdfRange = sheet.getRange(2, pdfGeneratedColumn, sheet.getMaxRows() - 1, 1);
  
  // Clear existing rules for PDF column
  const pdfRules = sheet.getConditionalFormatRules();
  const newPdfRules = pdfRules.filter(rule => {
    const ranges = rule.getRanges();
    return !ranges.some(r => r.getA1Notation() === pdfRange.getA1Notation());
  });
  sheet.setConditionalFormatRules(newPdfRules);
  
  // Add new PDF column rules
  const pdfYesRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("Sí")
    .setBackground('#b7e1cd')
    .setRanges([pdfRange])
    .build();
  
  const pdfNoRule = SpreadsheetApp.newConditionalFormatRule()
    .whenTextEqualTo("No")
    .setBackground('#fce8b2')
    .setRanges([pdfRange])
    .build();
  
  // Apply the PDF rules
  const finalRules = sheet.getConditionalFormatRules();
  finalRules.push(pdfYesRule, pdfNoRule);
  sheet.setConditionalFormatRules(finalRules);
}

function calculateFactorScores(answers) {
  // Lista de preguntas con puntuación invertida
  const invertedQuestions = [1, 2, 3, 4, 6, 7, 10, 19, 21, 30, 31, 33, 45, 49, 50, 52, 63, 65, 66, 68, 75];
  
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
        // Check if the question should be scored in reverse
        const isInverted = invertedQuestions.includes(questionId);
        const adjustedValue = isInverted ? 5 - parseInt(answer) : parseInt(answer);
        
        factorScore += adjustedValue;
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
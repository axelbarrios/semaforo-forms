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

    // Add default values for PDF columns
    rowData.push(
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
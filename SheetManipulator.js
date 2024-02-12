const google = require('googleapis');


class SheetManipulator {

  /***
   * Initiate the values for the authentication.
   * @param {string} sheetId - The sheet id that you can get from the URL.
   * @param {string} sheetRange - The sheet cell or column interval. Defines the region that the values are gonna be obtained.
   * @constructor
  */
  constructor(sheetId, sheetRange) {
    this.sheetId = sheetId;
    this.sheetRange = sheetRange;
    this.maximumClasses = 60;
    this.spreadsheetvalues = [];
  }


  /**
   * Retrieve the data, calling the connection method.
   * @returns {Array<Array|boolean|string>} 
   */
  async getSpreadsheet() {
    const googleAuth = new google.Auth.GoogleAuth({
      keyFile: process.env.FILE,
      scopes: 'https://www.googleapis.com/auth/spreadsheets',
    })

    const getService = new google.sheets_v4.Sheets().spreadsheets;

    try {
      const getRows = await getService.values.get({
        auth: googleAuth,
        spreadsheetId: this.sheetId,
        range: this.sheetRange
      });

      this.spreadsheetvalues = getRows.data.values
      return [this.spreadsheetvalues, true];

    } catch (e) {
      // Show the error message 
      try {
        return [e.response.data.error.message, false];
      } catch (e) {
        return ["Verify if the range and sheet ID have been passed!", false]
      }
    }
  }

  /**
   * Change the array, replacing the array key, for a more readable form.
   * @returns {Array<Array>} 
   */
  changeArray() {
    const getGoogleArray = this.spreadsheetvalues;
    const getColumns = getGoogleArray.shift();
    const newArray = [{}]

    getGoogleArray.forEach(element => {
      newArray.push({
        matricula: element[0],
        aluno: element[1],
        faltas: element[2],
        p1: parseInt(element[3]),
        p2: parseInt(element[4]),
        p3: parseInt(element[5]),
        situacao: '',
        naf: 0,
        media: 0
      });
    });

    const deleteEmptyObject = newArray.shift();
    this.spreadsheetvalues = newArray;
    return newArray;
  }

  /**
   * Calculates the average value from the 3 semesters, changing the student situation.
   * @returns {Array<Array>} 
   */
  calcAverage() {
    const getChangedArray = this.spreadsheetvalues;

    getChangedArray.forEach(element => {
      element.media = Math.round((element.p1 + element.p2 + element.p3) / 3);

      if (element.media < 50) {
        element.situacao = 'Reprovado por Nota'
      } else if (element.media >= 70) {
        element.situacao = 'Aprovado'
      } else {
        element.situacao = 'Exame Final'
      }

    })

    this.spreadsheetvalues = getChangedArray
    return this.spreadsheetvalues;
  }

  /**
   * Checks the student absence, making a new change in the situation and then,
   * searches for the students that do not have the necessary grade and calculates that.
   * @returns {Array<Array>} 
   */
  checkAbsencesNaf() {
    const getChangedArray = this.spreadsheetvalues;
    const percent = (25 / 100) * this.maximumClasses;

    getChangedArray.forEach(element => {
      if (element.faltas > percent) {
        element.situacao = "Reprovado por Falta";
      }

      if (element.situacao == 'Exame Final') {
        const minimumGrade = 100 - element.media;
        element.naf = minimumGrade;
      }
    });

    this.spreadsheetvalues = getChangedArray;
    return this.spreadsheetvalues;
  }

}

module.exports = { SheetManipulator };
const express = require('express');
const { SheetManipulator } = require('./SheetManipulator.js');
const app = express();
const port = 3000;

const spreadsheetId = "11noy7IP6xjwcCidWczdvB1iNOw2_3TRlDmGbET35JXk";
const sheetRange = "3:28";
const sheetRangeInsert = "G4:H27"
const sheetRangeToClear = "G4:H27";

app.get('/', async (req, res) => {
  const getSheetClass = new SheetManipulator(spreadsheetId, sheetRange);
  const [getSpreadSheet, checkSucess] = await getSheetClass.getSpreadsheet();

  if (checkSucess) {
    getSheetClass.changeArray();
    getSheetClass.calcAverage();
    res.send(getSheetClass.checkAbsencesNaf());

  }else{
    res.send(getSpreadSheet);
  }
});

app.get('/insert', async (req, res) => {
  const getSheetClass = new SheetManipulator(spreadsheetId, sheetRange);
  const [getSpreadSheet, checkSucess] = await getSheetClass.getSpreadsheet();

  if (checkSucess) {
    getSheetClass.changeArray();
    getSheetClass.calcAverage();
    getSheetClass.checkAbsencesNaf();
    const checkInsert = await getSheetClass.insertRowsInSpreadsheet(sheetRangeInsert)
    res.send(checkInsert);
  }else{
    res.send(getSpreadSheet);
  }
});

app.get('/clear', async (req, res) => {
  const getSheetClass = new SheetManipulator(spreadsheetId, sheetRange);
  const [getSpreadSheet, checkSucess] = await getSheetClass.getSpreadsheet();

  if (checkSucess) {
    const clearRows = await getSheetClass.clearInsertedValues(sheetRangeToClear)
    res.send(clearRows);

  }else{
    res.send(getSpreadSheet);
  }
});

app.listen(port);

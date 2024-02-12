const express = require('express');
const { SheetManipulator } = require('./SheetManipulator.js');
const app = express();
const port = 3000;

const spreadsheetId = "11noy7IP6xjwcCidWczdvB1iNOw2_3TRlDmGbET35JXk";
const sheetRange = "3:27";

app.get('/', async (req, res) => {
  const getSheetClass = new SheetManipulator(spreadsheetId, sheetRange);
  const [getSpreadSheet, checkSucess] = await getSheetClass.getSpreadsheet();

  if (checkSucess) {
    getSheetClass.changeArray();
    getSheetClass.calcAverage();
    getSheetClass.checkAbsencesNaf();
    res.send(getSheetClass.spreadsheetvalues);

  }else{
    res.send(getSpreadSheet);
  }

});

app.listen(port);

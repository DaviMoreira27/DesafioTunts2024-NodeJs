const { SheetManipulator } = require('../SheetManipulator.js');

const spreadsheetId = '11noy7IP6xjwcCidWczdvB1iNOw2_3TRlDmGbET35JXk';
const spreadsheetRange = '3:27';

test('check spreadsheet return from google API', async () => {
    const getSheetClass = new SheetManipulator(spreadsheetId, spreadsheetRange);
    const checkGoogle = await getSheetClass.getSpreadsheet();
    expect(checkGoogle[1]).toBe(true);
});

test('should calculate average and update situacao', () => {
    const getSheetClass = new SheetManipulator(spreadsheetId, spreadsheetRange);
    getSheetClass.spreadsheetvalues = [{ p1: 60, p2: 70, p3: 80 }];
    const result = getSheetClass.calcAverage();
    expect(result[0].media).toBe(70);
    expect(result[0].situacao).toBe('Aprovado');
});


describe('checkAbsencesNaf', () => {
    test('should check absences and update situacao', () => {
        const getSheetClass = new SheetManipulator(spreadsheetId, spreadsheetRange);

        getSheetClass.spreadsheetvalues = [{ faltas: 16, situacao: '' }];
        const resultSituation = getSheetClass.checkAbsencesNaf();

        expect(resultSituation[0].situacao).toBe('Reprovado por Falta');
    });


    test('check average and update situation', () => {
        const getSheetClassNaf = new SheetManipulator(spreadsheetId, spreadsheetRange);
        getSheetClassNaf.spreadsheetvalues = [{ faltas: 12, situacao: 'Exame Final', media: 63 }]
        const resultNaf = getSheetClassNaf.checkAbsencesNaf();
        expect(resultNaf[0].naf).toBe(37);
    })
})

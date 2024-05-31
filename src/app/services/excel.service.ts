// src/app/services/excel.service.ts
import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  constructor() {}

  exportToExcel(data: any[], fileName: string | undefined): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

    // Aplica estilos diretamente às células
    const headerCellStyle = {
      font: { bold: true },
      fill: { fgColor: { rgb: 'FF0000FF' } }, // Cor azul
    };

    // Aplica o estilo ao cabeçalho das colunas (A1 a D1 neste exemplo)
    XLSX.utils.sheet_add_json(worksheet, [{ A: "Empresa", B: "Data", C: "Tipo de Documento", D: "Qtd. de Páginas" }], { header: ["A", "B", "C", "D"], skipHeader: true });
    worksheet['!cols'] = [
      { wch: 25 }, // Largura maior para a primeira célula (A)
      { wch: 20 }, // Largura padrão para as demais células (B, C, D)
      { wch: 20 },
      { wch: 20 }
    ];

    // Define o estilo para o cabeçalho das colunas
    for (let i = 0; i < Object.keys(worksheet).length; i++) {
      const cellRef = XLSX.utils.encode_cell({ r: 0, c: i });
      if (!worksheet[cellRef]) continue;
      worksheet[cellRef].s = headerCellStyle;
    }

    // Aplica o estilo às células principais (A2 em diante)
    const mainCellStyle = {
      fill: { fgColor: { rgb: 'FFFF0000' } }, // Cor vermelha
    };

    const rangeRef = worksheet['!ref'];
    if (rangeRef) {
      const range = XLSX.utils.decode_range(rangeRef);
      for (let rowNum = 1; rowNum <= range.e.r; rowNum++) {
        for (let colNum = range.s.c; colNum <= range.e.c; colNum++) {
          const cellRef = XLSX.utils.encode_cell({ r: rowNum, c: colNum });
          if (!worksheet[cellRef]) continue;
          worksheet[cellRef].s = mainCellStyle;
        }
      }
    }

    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Salva o arquivo Excel
    const sanitizedFileName = fileName ?? 'exported_data';
    XLSX.writeFile(workbook, `${sanitizedFileName}_export_${new Date().getTime()}.xlsx`);
  }
}

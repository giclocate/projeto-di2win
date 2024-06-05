import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  constructor() {}

  exportToExcel(data: any[], selectedEmpresa: string): void {
    // Cria uma nova planilha do Excel
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();

    // Cria uma nova folha na planilha
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([]);

    // Adiciona o nome da empresa e a data atual ao título do arquivo
    const currentDate = new Date().toLocaleDateString().split('/').join('-');
    const sanitizedFileName = `${selectedEmpresa}_${currentDate}`;

    // Aplica o estilo ao cabeçalho das colunas
    const headerCellStyle = {
      font: { bold: true },
      fill: { fgColor: { rgb: 'FF0000FF' } }, // Cor azul
    };

    // Insere o nome da empresa em uma célula específica (por exemplo, A1)
    worksheet['B1'] = { t: 's', v: `Empresa: ${selectedEmpresa}`, s: headerCellStyle };

    // Adiciona os cabeçalhos das colunas apenas uma vez
    const columnHeaders = ['Data', 'Tipo de Documento', 'Qtd. de Páginas'];
    XLSX.utils.sheet_add_aoa(worksheet, [columnHeaders], { origin: 'A3' });

    // Adiciona os dados
    const dataArray = data.map(item => [item.dataID, item.tipoDocumento, item.qtdPag]);
    XLSX.utils.sheet_add_aoa(worksheet, dataArray, { origin: 'A5' });

    // Aplica o estilo ao cabeçalho das colunas
    for (let i = 0; i < 3; i++) {
      const cellRef = XLSX.utils.encode_cell({ r: 1, c: i });
      if (!worksheet[cellRef]) continue;
      worksheet[cellRef].s = headerCellStyle;
    }

    // Define a largura das colunas com base no conteúdo
    const columnWidths = this.calculateColumnWidths(dataArray);
    worksheet['!cols'] = columnWidths;

    // Adiciona a folha à planilha
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Salva o arquivo Excel
    XLSX.writeFile(workbook, `${sanitizedFileName}.xlsx`);
  }

  // Função para calcular a largura ideal das colunas com base no conteúdo dos dados
  private calculateColumnWidths(data: any[]): any[] {
    const columnWidths = [];
    for (let i = 0; i < data[0].length; i++) {
      const columnWidth = { wch: 10 }; // Largura inicial das colunas
      for (const row of data) {
        const cellValue = row[i] ? row[i].toString() : '';
        if (cellValue.length > columnWidth.wch) {
          columnWidth.wch = cellValue.length;
        }
      }
      columnWidths.push(columnWidth);
    }
    return columnWidths;
  }
}
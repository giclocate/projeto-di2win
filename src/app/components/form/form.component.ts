import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';

import {provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';

import { DatePipe } from '@angular/common';



export interface UserData {
  empresaID: string;
  dataID: string;
  tipoDocumento: string;
  qtdPag: string;
}

const QTD_PAG: string[] = [
  '16',
  '100',
  '54',
  '321',
  '1230',
  '243',
  '321',
  '28',
];

const tipoDocumento: string[] = [
  'CNH',
  'CPF',
  'Contrato ',
  'Certidão de Nascimento',
  'Certidão de Casamento',
  'Certidão de Óbito',
  'Carteira de Trabalho',
  'Comprovante de Residência',
  'Passaporte',
  'RG',
  'Carteira de Identidade Profissional',
  'Título de Eleitor',
  'Carteira de Estudante',
  'Certificado de Reservista',
  'Cartão de Crédito ',
  'Cartão de Débito'
];

const EMPRESA: string[] = [
  'CyberTech',
  'NovaWave Industries',
  'Quantum Innovations',
  'SkyLabs Corporation',
  'NebulaTech Solutions',
  'Phoenix Innovate',
  'HorizonTech Enterprises',
  'FusionWorks Inc.',
  'PrimeTech Solutions',
  'Apex Global Technologies'
];

@Component({
  selector: 'app-form',
  styleUrls: ['form.component.scss'],
  templateUrl: 'form.component.html',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatPaginatorModule, MatTableModule, MatDatepickerModule],
  providers: [provideNativeDateAdapter(), DatePipe]
})
export class FormComponent implements AfterViewInit {
  displayedColumns: string[] = ['empresaID', 'dataID', 'tipoDocumento', 'qtdPag'];
  dataSource: MatTableDataSource<UserData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private datePipe: DatePipe) {
    const users = Array.from({ length: 100 }, (_, k) => createNewUser(k + 1, datePipe));
    this.dataSource = new MatTableDataSource(users);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}

function createNewUser(id: number, datePipe: DatePipe): UserData {
  const name = tipoDocumento[Math.round(Math.random() * (tipoDocumento.length - 1))];
  const empresa = EMPRESA[Math.round(Math.random() * (EMPRESA.length - 1))];
  const randomDate = getRandomDate();
  const formattedDate = datePipe.transform(randomDate, 'dd/MM/yyyy') || '';

  return {
    empresaID: empresa,
    dataID: formattedDate,
    tipoDocumento: name,
    qtdPag: QTD_PAG[Math.round(Math.random() * (QTD_PAG.length - 1))],
  };
}

function getRandomDate(): Date {
  const start = new Date(2024, 0, 1);
  const end = new Date();
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
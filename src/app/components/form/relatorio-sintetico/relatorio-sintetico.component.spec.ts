import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioSinteticoComponent } from './relatorio-sintetico.component';

describe('RelatorioSinteticoComponent', () => {
  let component: RelatorioSinteticoComponent;
  let fixture: ComponentFixture<RelatorioSinteticoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RelatorioSinteticoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RelatorioSinteticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

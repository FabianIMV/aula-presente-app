import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { BarcodePage } from './barcode.page';
import { SharedService } from 'src/app/services/shared.service';
import { of } from 'rxjs';

describe('BarcodePage', () => {
  let component: BarcodePage;
  let fixture: ComponentFixture<BarcodePage>;
  let sharedServiceSpy: jasmine.SpyObj<SharedService>;

  beforeEach(async(() => {
    const spy = jasmine.createSpyObj('SharedService', ['getCurso']);

    TestBed.configureTestingModule({
      declarations: [BarcodePage],
      providers: [
        { provide: SharedService, useValue: spy }
      ],
    }).compileComponents();

    sharedServiceSpy = TestBed.inject(SharedService) as jasmine.SpyObj<SharedService>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarcodePage);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate QR code', () => {
    const cursoMock = {
      nombre: 'Curso de prueba',
      codigo: '123',
      descripcion: 'Descripción de prueba'
    };

    const expectedUrl = 'https://api.qrserver.com/v1/create-qr-code/?data=' + encodeURIComponent(JSON.stringify(cursoMock)) + '&size=400x600';

    sharedServiceSpy.getCurso.and.returnValue(of(cursoMock));
    spyOn(component, 'generateQRCode');

    component.ngOnInit();

    expect(component.item).toEqual(cursoMock);
    expect(component.generateQRCode).toHaveBeenCalledWith(expectedUrl);
    expect(component.qrCodeUrl).toBe(expectedUrl);
  });
});

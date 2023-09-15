
import { Curso } from 'src/app/models';
import { SharedService } from 'src/app/services/shared.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-barcode',
  templateUrl: './barcode.page.html',
  styleUrls: ['./barcode.page.scss'],
})
export class BarcodePage implements OnInit {
  
  item: Curso = {
    codigo: '',
    nombre: '',
    descripcion: '',
    horario: [],
    cantidad_alumnos: 0,
    asistencias_alumnos: []
  }

  constructor(
    private data: SharedService,
  ) { }


  qrCodeUrl = ''

  ngOnInit() {

    this.data.getCurso().subscribe(res => {
      if(res){
        const { nombre, codigo, descripcion, cantidad_alumnos } = res
        const itemJson = JSON.stringify({nombre, codigo, descripcion, cantidad_alumnos})

        const urlEncodedText = encodeURIComponent(itemJson);

        this.generateQRCode(urlEncodedText)
      }
    })
  }

  generateQRCode(data: string) {
    const width = 400;
    const height = 600;
    
    this.qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${data}&size=${width}x${height}`

  }

}
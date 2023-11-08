import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/services/firestore.service';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  logForm!: FormGroup

  
  
  hidePassword: boolean = true;

  rol: string = 'profesor'
  rolp: string = 'estudiante'

  constructor(
    private formBuilder: FormBuilder,
    private authServices: AuthenticationService,
    private router: Router,
    private firestore: FirestoreService
  ) { }

  ngOnInit() {
    this.logForm = this.formBuilder.group({
      email: ['',
      [
        Validators.required,
        Validators.email,
        Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
      ]
      ],
      password: ['', 
      [
        Validators.required,
        Validators.pattern("(^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$)")
      ]
      ]
    })
  }


  async login(){

    if(this.logForm?.valid) {
      try {
        const user = await this.authServices.loginUser(this.logForm.value.email, this.logForm.value.password).then(async res => {

          if (this.rolp === 'estudiante') {
            Swal.fire({
              text: 'Correcto inicio de sesion',
              icon: 'success',
              heightAuto: false,
              position: 'bottom',
              timer: 1000
            })
            .then(() => {
              this.router.navigate(['/home']);
            })
          } else {
            Swal.fire({
              text: 'Usuario no encontrado',
              icon: 'error',
              timer: 1000,
              heightAuto: false
            })
          }
        })

        if (this.rolp === 'profesor') {
          Swal.fire({
            text: 'Correcto inicio de sesion',
            icon: 'success',
            heightAuto: false,
            position: 'bottom',
            timer: 1000
          })
          .then(() => {
            this.router.navigate(['/home-profesor']);
          })
        } else {
          Swal.fire({
            text: 'Usuario no encontrado',
            icon: 'error',
            timer: 1000,
            heightAuto: false
          })
        }

      } catch(error) {
        Swal.fire({
          text: 'Usuario no encontrado',
          icon: 'error',
          timer: 1000,
          heightAuto: false
        })
      }
    } else {

      Swal.fire({
        text: 'Debes ingresar datos para ingresar',
        icon: 'error',
        timer: 1500,
        heightAuto: false
      })
    }
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  loginProfe(){
    this.rol = this.rol === 'estudiante' ? 'profesor' : 'estudiante';
    this.rolp = this.rolp === 'profesor' ? 'estudiante' : 'profesor'
  }

}

import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})

export class RegisterComponent implements OnInit {

  user = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    lastname: new FormControl('', [Validators.required]),
    firstname: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.minLength(6)]),
  })

  hide = true;
  loading = false;

  error = false;
  errorValue = "";


  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
  }

  canSubmit() {
    const email = this.user.get("email");
    const lastname = this.user.get("lastname");
    const firstname = this.user.get("firstname");
    const password = this.user.get("password");
    if ( email == null || lastname == null || firstname == null || password == null)
      return false;
    else return email.valid && lastname.valid && firstname.valid && password.valid && password.value.length >= 6;
  }

  onSubmit() {
    const email = this.user.get("email");
    const lastname = this.user.get("lastname");
    const firstname = this.user.get("firstname");
    const password = this.user.get("password");
    if ( email == null || lastname == null || firstname == null || password == null)
      return console.log("PROBLEM");

    this.loading = true;
    this.authService.register(email.value, lastname.value, firstname.value, password.value).subscribe({
      next: (value) => this.router.navigate(["/login"]),
      error: (error) => {
        this.loading = false;
        this.error = true;
        if ( error.status == 409 )
          this.errorValue = "Un compte existe déjà avec cette adresse mail !"
        else if ( error.status == 400 )
          this.errorValue = "Le mot de passe doit faire au minimum 6 charactères !"
        else if ( error.status == 500 )
          this.errorValue = "Erreur lors de la création du compte."
        else this.errorValue = "Erreur de communication avec le serveur."
      }
    })
  }
}

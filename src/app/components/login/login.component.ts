import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('')
  })

  hide = true;
  loading = false;

  error = false;
  errorValue = "";

  constructor(private authService: AuthService, private router: Router) {
    authService.user$.subscribe({
      next: (value) => {
        if (value)
          router.navigate(["/home"]);
      }
    })
  }

  ngOnInit() {
  }

  canSubmit(){
    const email = this.user.get("email");
    const password = this.user.get("password");
    if ( email == null || password == null)
      return false;
    else return email.valid && password.valid && password.value.length >= 3;
  }

  onSubmit() {
    const email = this.user.get("email");
    const password = this.user.get("password");
    if ( email == null || password == null)
      return console.log("PROBLEM");

    this.loading = true;
    this.authService.login(email.value, password.value).subscribe({
      next: (value) => this.router.navigate(["/home"]),
      error: (error) => {
        this.loading = false;
        this.error = true;
        if ( error.status == 401 )
          this.errorValue = "Mauvais mot de passe !"
        else if ( error.status == 404 )
          this.errorValue = "Le compte n'existe pas !"
        else if ( error.status == 500 )
          this.errorValue = "Erreur lors de la connexion."
        else this.errorValue = "Erreur de communication avec le serveur."
      }
    })
  }

}

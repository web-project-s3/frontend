import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-register-employee',
  templateUrl: './register-employee.component.html',
  styleUrls: ['./register-employee.component.scss']
})
export class RegisterEmployeeComponent implements OnInit {

  loading = false;
  code = "";

  error = false;
  errorValue = "";

  constructor(private api: ApiService) { }


  ngOnInit(): void {
  }

  canSubmit() {
    return this.code.length > 4;
  }

  onSubmit() {
    this.loading = true;
    this.api.employUser(this.code).subscribe({
      next: (value) => this.loading = false,
      error: (error) => {
        this.error = true;
        this.loading = false;
        if ( error.status == 404 )
          this.errorValue = "Le restaurant ou la plage n'existe pas !"
        else if ( error.status == 500 )
          this.errorValue = "Erreur lors de l'enregistrement."
        else this.errorValue = "Erreur de communication avec le serveur."
      }
    })
  }

}

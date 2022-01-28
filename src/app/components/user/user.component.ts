import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Beach } from 'src/app/core/models/beach';
import { Restaurant } from 'src/app/core/models/restaurant';
import { User } from 'src/app/core/models/user';
import { ApiService } from 'src/app/core/services/api.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  public user: User | null = null;
  public error = false;
  public errorValue = "";

  public loading = false;

  public firstname = "";
  public lastname = "";
  public email = "";
  public isAdmin = false;
  public worksFor: Restaurant | Beach | null = null;

  constructor(private router: Router, private route: ActivatedRoute, private api: ApiService, public auth: AuthService) {
    route.paramMap.subscribe({
      next: (value) => {
        const idString = value.get("id");
        if ( !idString || isNaN(parseInt(idString)))
          router.navigate(["/home"]);

        else
        {
          const id = parseInt(idString);

          this.api.getUserId(id).subscribe({
            next: this.onUserLoad.bind(this),
            error:(error) =>  {
              console.log(error.message);
              this.router.navigate(["/home"]);
            }
          })
        }
      }
  })}

  ngOnInit(): void {
  }

  onUserLoad(user: User) {
    this.user = user;
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.email = user.email;
    this.isAdmin = user.isAdmin;

    if ( user.beachEmployee )
      this.worksFor = user.beachEmployee;
    else if ( user.restaurantEmployee )
      this.worksFor = user.restaurantEmployee;
  }

  canSubmit() {
    return this.firstname.length >= 2 && this.lastname.length >= 2
  }

  onSubmit() {
    const success = (value: User) => {
      this.user!.firstname = value.firstname;
      this.user!.lastname = value.lastname;
      this.user!.email = value.email;
      this.user!.isAdmin = value.isAdmin;
      this.loading = false;
      this.error =  false;
      if (this.user?.id == this.auth._user.getValue()?.id)
        this.auth.reloadUser();
    }

    const error = (error: any) => {
      this.loading = false;
      this.error = true;
      if ( error.status == 400 )
        this.errorValue = "Il manque des champs !"
      else if ( error.status == 404 )
        this.errorValue = "Impossible de trouver l'utilisateur !"
      else if ( error.status == 409 )
        this.errorValue = "L'email correspond à un autre utilisateur !"
      else if ( error.status == 500 )
        this.errorValue = "Erreur lors de l'édition de l'utilisateur"
      else this.errorValue = "Erreur de communication avec le serveur."
    }

    this.loading = true;

    if ( !this.auth.isAdmin() )
      this.api.patchUser(this.user!.id, this.firstname, this.lastname).subscribe({
        next: success,
        error: error
      })

    else
      this.api.putUser(this.user!.id, this.firstname, this.lastname, this.email, this.isAdmin ).subscribe({
        next: success,
        error: error
      })
  }

  onSubmitDetach() {
    this.loading = true;
    debugger;
    this.api.removeEmployer(this.user!.id).subscribe({
      next: (value) => {
        this.onUserLoad(value);
        this.loading = false;
        this.error = false;
        this.worksFor = null;
        if (this.user?.id == this.auth._user.getValue()?.id)
          this.auth.reloadUser();
      },
      error: (error) => {
        this.loading = false;
        this.error = true;
        if ( error.status == 500 )
          this.errorValue = "Erreur lors du détachement"
        else this.errorValue = "Erreur de communication avec le serveur."
      }
    })
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Restaurant } from 'src/app/core/models/restaurant';
import { ApiService } from 'src/app/core/services/api.service';
import { TreeNode } from 'primeng/api';
import { Beach } from 'src/app/core/models/beach';
import { AuthService } from 'src/app/core/services/auth.service';


@Component({
  selector: 'app-beach-edit',
  templateUrl: './beach-edit.component.html',
  styleUrls: ['./beach-edit.component.scss']
})
export class BeachEditComponent implements OnInit {

  partners: Restaurant[] = [];
  beach: Beach | null = null;

  employeesNode: TreeNode[] = [];
  cols = [
    { field: 'Nom', header: 'Prénom' },
    { field: 'lastname', header: 'Nom' },
  ];

  hide = true;
  loading = false;
  beachLoading = false;

  error = false;
  restaurantError = false;
  errorValue = "";
  restaurantErrorValue = "";

  name = "";
  code = "";
  restaurantCode = "";

  canChangeCode = false;

  constructor(private router: Router, private route: ActivatedRoute, private api: ApiService, public auth: AuthService) {
    route.paramMap.subscribe({
      next: (value) => {
        const idString = value.get("id");
        if ( !idString || isNaN(parseInt(idString)))
          router.navigate(["/home"]);

        else
        {
          const id = parseInt(idString);

          this.api.getBeachId(id).subscribe({
            next: this.onBeachLoad.bind(this),
            error:(error) =>  {
              console.log(error.message);
              this.router.navigate(["/home"]);
            }
          })
        }
      }
    })

    auth.user$.subscribe(value => this.canChangeCode = (value != null) && value.isAdmin )
   }

  ngOnInit(): void {
  }

  onBeachLoad(beach: Beach){
    this.partners = beach.partners;
    this.beach = beach;
    this.name = beach.name;
    this.code = beach.code;
    this.employeesNode = beach.employees.map((employee) => {
      return { data: {
          firstname: employee.firstname,
          lastname: employee.lastname
        }
      }
    })
  }


  canSubmit() {
    return this.name.length > 3 && ( this.beach?.name != this.name || this.beach?.code != this.code );
  }

  canSumbitRestaurant() {
    return this.restaurantCode.length > 4;
  }

  onSubmit() {
    const success = (value: Beach) => {
      this.beach!.name = value.name;
      this.beach!.code = value.code;
      this.loading = false;
      this.error = false;
    }

    const error = (error: any) => {
      this.loading = false;
      this.error = true;
      if ( error.status == 400 )
        this.errorValue = "La plage doit avoir un nom et un code !"
      else if ( error.status == 404 )
        this.errorValue = "Impossible de trouver votre plage !"
      else if ( error.status == 409 )
        this.errorValue = "Le code correspond déjà à un autre établissement !"
      else if ( error.status == 500 )
        this.errorValue = "Erreur lors de l'édition de la plage"
      else this.errorValue = "Erreur de communication avec le serveur."
    }

    this.loading = true;

    if ( !this.auth.isAdmin() )
      this.api.patchBeach(this.name).subscribe({
        next: success,
        error: error
      })
    else
      this.api.putBeach(this.name, this.code, this.beach!.id).subscribe({
        next: success,
        error: error
      })

  }

  onSubmitBeach() {
    this.beachLoading = true;
    this.api.addRestaurant(this.beach!.id, this.restaurantCode).subscribe(
      {
        next: (value) => {
        this.api.getBeachId(this.beach!.id).subscribe({
          next: this.onBeachLoad.bind(this),
          error:(error) =>  {
            this.router.navigate(["/home"]);
          }});

        this.loading = false;
        this.error = false;
      },
        error: (error) => {
          this.beachLoading = false;
          this.restaurantError = true;
          if ( error.status == 404 )
            this.restaurantErrorValue = "Le code ne correspond à aucun restaurant !"
          else if ( error.status == 409 )
            this.restaurantErrorValue = "Vous êtes déjà associé à ce restaurant !"
          else if ( error.status == 500 )
            this.restaurantErrorValue = "Erreur lors de l'ajout du restaurant."
          else this.restaurantErrorValue = "Erreur de communication avec le serveur."
        }
      }
    )
  }

  deletePartner(id: number){
    this.api.deletePartnerBeach(id, this.beach!.id ).subscribe({
      next: (value) => {
        this.partners = this.partners.filter(restaurant => restaurant.id != id);
      },
      error: console.log
    })
  }

  editPartner(id: number){
    this.router.navigate([`restaurant/${id}/edit`]);
  }

}

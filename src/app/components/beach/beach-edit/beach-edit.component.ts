import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Restaurant } from 'src/app/core/models/restaurant';
import { ApiService } from 'src/app/core/services/api.service';
import { TreeNode } from 'primeng/api';
import { Beach } from 'src/app/core/models/beach';


@Component({
  selector: 'app-beach-edit',
  templateUrl: './beach-edit.component.html',
  styleUrls: ['./beach-edit.component.scss']
})
export class BeachEditComponent implements OnInit {

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

  constructor(private router: Router, private route: ActivatedRoute, private api: ApiService) {
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
   }

  ngOnInit(): void {
  }

  onBeachLoad(beach: Beach){
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
    return this.name.length > 3 && this.beach?.name != this.name;
  }

  canSumbitRestaurant() {
    return this.restaurantCode.length > 4;
  }

  onSubmit() {
    this.loading = true;
    this.api.patchBeach(this.name).subscribe({
      next: (value) => {
        this.beach!.name = value.name;
        this.loading = false;
        this.error = false;
      },
      error: (error) => {
        this.loading = false;
        this.error = true;
        if ( error.status == 400 )
          this.errorValue = "La plage doit avoir un nom !"
        else if ( error.status == 404 )
          this.errorValue = "Impossible de trouver votre plage !"
        else if ( error.status == 500 )
          this.errorValue = "Erreur lors de l'édition de la plage"
        else this.errorValue = "Erreur de communication avec le serveur."
      }
    })
  }

  onSubmitBeach() {
    this.beachLoading = true;
    this.api.addRestaurant(this.beach!.id, this.restaurantCode).subscribe(
      {
        next: (value) => console.log(value),
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

}

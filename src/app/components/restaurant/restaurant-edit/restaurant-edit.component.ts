import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Restaurant } from 'src/app/core/models/restaurant';
import { ApiService } from 'src/app/core/services/api.service';
import { TreeNode } from 'primeng/api';


@Component({
  selector: 'app-restaurant-edit',
  templateUrl: './restaurant-edit.component.html',
  styleUrls: ['./restaurant-edit.component.scss']
})
export class RestaurantEditComponent implements OnInit {

  restaurant: Restaurant | null = null;

  employeesNode: TreeNode[] = [];
  cols = [
    { field: 'Nom', header: 'Prénom' },
    { field: 'lastname', header: 'Nom' },
  ];

  hide = true;
  loading = false;
  beachLoading = false;

  error = false;
  beachError = false;
  errorValue = "";
  beachErrorValue = "";

  name = "";
  code = "";
  beachCode = "";

  constructor(private router: Router, private route: ActivatedRoute, private api: ApiService) {
    route.paramMap.subscribe({
      next: (value) => {
        const idString = value.get("id");
        if ( !idString || isNaN(parseInt(idString)))
          router.navigate(["/home"]);

        else
        {
          const id = parseInt(idString);

          this.api.getRestaurantId(id).subscribe({
            next: this.onRestaurantLoad.bind(this),
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

  onRestaurantLoad(restaurant: Restaurant){
    this.restaurant = restaurant;
    this.name = restaurant.name;
    this.code = restaurant.code;
    this.employeesNode = restaurant.employees.map((employee) => {
      return { data: {
          firstname: employee.firstname,
          lastname: employee.lastname
        }
      }
    })
  }


  canSubmit() {
    return this.name.length > 3 && this.restaurant?.name != this.name;
  }

  canSumbitBeach() {
    return this.beachCode.length > 4;
  }

  onSubmit() {
    this.loading = true;
    this.api.patchRestaurant(this.name).subscribe({
      next: (value) => {
        this.restaurant!.name = value.name;
        this.loading = false;
        this.error = false;
      },
      error: (error) => {
        this.loading = false;
        this.error = true;
        if ( error.status == 400 )
          this.errorValue = "Le restaurant doit avoir un nom !"
        else if ( error.status == 404 )
          this.errorValue = "Impossible de trouver votre restaurant !"
        else if ( error.status == 500 )
          this.errorValue = "Erreur lors de l'édition du restaurant"
        else this.errorValue = "Erreur de communication avec le serveur."
      }
    })
  }

  onSubmitBeach() {
    this.beachLoading = true;
    this.api.addBeach(this.restaurant!.id, this.beachCode).subscribe(
      {
        next: (value) => console.log(value),
        error: (error) => {
          this.beachLoading = false;
          this.beachError = true;
          if ( error.status == 404 )
            this.beachErrorValue = "Le code ne correspond à aucune plage !"
          else if ( error.status == 409 )
            this.beachErrorValue = "Vous êtes déjà associé à cette plage !"
          else if ( error.status == 500 )
            this.beachErrorValue = "Erreur lors de l'ajout de la plage."
          else this.beachErrorValue = "Erreur de communication avec le serveur."
        }
      }
    )
  }

}

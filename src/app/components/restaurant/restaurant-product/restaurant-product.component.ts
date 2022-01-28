import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Beach } from 'src/app/core/models/beach';
import { Product } from 'src/app/core/models/product';
import { Restaurant } from 'src/app/core/models/restaurant';
import { ApiService } from 'src/app/core/services/api.service';

interface ProductDisplay {
    id: number
    name: string,
    price: number,
    imageURL: string
    beach: {
      id: number,
      name: string
    }
}

@Component({
  selector: 'app-restaurant-product',
  templateUrl: './restaurant-product.component.html',
  styleUrls: ['./restaurant-product.component.scss']
})


export class RestaurantProductComponent implements OnInit {

  products: ProductDisplay[] = []

  partners: Beach[] = [];
  restaurant: Restaurant | null = null;

  productName = "";
  productURL = "";

  error = false;
  errorValue = "";

  errorPublish = false;
  errorPublishValue = "";

  selectedPartner: Beach | null = null;
  selectedProduct: Product | null = null;
  price = 0;

  loading = false;

  constructor(private router: Router, private route: ActivatedRoute, private api: ApiService ) {
    route.paramMap.subscribe({
      next: (value) =>
      {
        const idString = value.get("id");
        if ( !idString || isNaN(parseInt(idString)))
          router.navigate(["/home"]);

        else
        {
          const id = parseInt(idString);
          this.loadRestaurant(id);
        }
      }
    });
  }

  ngOnInit(): void {
  }

  loadRestaurant(id: number) {
    this.api.getRestaurantId(id).subscribe(
      {
        next: this.onRestaurantLoad.bind(this),
        error:(error) => this.router.navigate(["/home"])
      });
  }

  onRestaurantLoad(restaurant: Restaurant){
    this.restaurant = restaurant;
    this.partners = restaurant.partners;

    this.products = restaurant.products.filter(product => product.beaches.length > 0).flatMap((product) =>
      product.beaches.map(beach =>
        { return {id: product.id, name: product.name, imageURL: product.imageUrl, price: beach.pricing!.price, beach: { id: beach.id, name: beach.name } } }
      )
    )
  }

  test(event: any){
    this.price = event.value;
  }

  canSubmitNewProduct() {
    return this.productName.length > 3 && this.productURL.length > 5;
  }

  canPublishProduct() {
    return ( this.selectedPartner != null ) && ( this.selectedProduct != null ) && this.price > 0;
  }

  onSubmitNewProduct() {
    this.loading = true;
    this.error = false;
    this.api.createNewProduct(this.restaurant!.id, this.productName, this.productURL).subscribe({
      next: (value) => {
        this.loadRestaurant(this.restaurant!.id);
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.error = true;
        if ( error.status == 409 )
          this.errorValue = "L'image n'est pas unique !"
        else if ( error.status == 500 )
          this.errorValue = "Erreur lors de l'ajout du produit "
        else this.errorValue = "Erreur de communication avec le serveur."
      }
    });
  }

  onPublishProduct() {
    this.loading = true;
    this.errorPublish = false;
    this.api.publishProductToBeach(this.restaurant!.id, this.selectedPartner!.id, this.selectedProduct!.id, this.price).subscribe({
      next: value => {
        this.loading = false;
        this.loadRestaurant(this.restaurant!.id)
      },
      error: error => {
        this.errorPublish = true;
        this.loading = false;
        if ( error.status == 404 )
          this.errorPublishValue = "Le produit ou la plage n'existe plus !"
        else if ( error.status == 500 )
          this.errorPublishValue = "Erreur lors de la publication du produit "
        else this.errorPublishValue = "Erreur de communication avec le serveur."
      }
    })
  }

  deleteProduct(productId: number) {
    this.error = false;
    this.api.deleteProduct(productId).subscribe({
      next: (value) => {
        this.loadRestaurant(this.restaurant!.id);
      },
      error: (error) => {
        this.error = true;
        if ( error.status == 404 )
          this.errorValue = "Le produit n'existe plus !"
        else if ( error.status == 500 )
          this.errorValue = "Erreur lors de la suppression du produit "
        else this.errorValue = "Erreur de communication avec le serveur."
      }
    })
  }

  deleteProductFromBeach(product: ProductDisplay) {
    this.api.deleteProductFromBeach(this.restaurant!.id, product.beach.id, product.id).subscribe({
      next: value => this.loadRestaurant(this.restaurant!.id),
      error: console.log
    })
  }

  onProductPriceEdit(product: ProductDisplay) {
    this.api.publishProductToBeach(this.restaurant!.id, product.beach.id, product.id, product.price).subscribe({
      next: (value) => {
        this.loadRestaurant(this.restaurant!.id);
      },
      error: console.log
    })
  }

  onProductPriceKeyUp(event: KeyboardEvent, product: ProductDisplay) {
    if ( event.code == "Enter")
      this.onProductPriceEdit(product);
  }
}

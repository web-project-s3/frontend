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
  imageUrl: string
  restaurant: {
    id: number,
    name: string
  }
}

@Component({
  selector: 'app-beach-product',
  templateUrl: './beach-product.component.html',
  styleUrls: ['./beach-product.component.scss']
})
export class BeachProductComponent implements OnInit {


  products: ProductDisplay[] = []

  partners: Restaurant[] = [];
  beach: Beach | null = null;

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
          this.loadBeach(id);
        }
      }
    });
  }

  ngOnInit(): void {
  }

  loadBeach(id: number) {
    this.api.getBeachId(id).subscribe(
      {
        next: this.onBeachLoad.bind(this),
        error:(error) => this.router.navigate(["/home"])
      });
  }

  onBeachLoad(beach: Beach){
    this.beach = beach;
    this.partners = beach.partners;
    this.api.getAllProductsOfBeach(beach.id).subscribe({
      next: this.onProductsLoad.bind(this),
      error: console.log
    })

    // this.products = beach.products.filter(product => product.beaches.length > 0).flatMap((product) =>
    //   product.beaches.map(beach =>
    //     { return {id: product.id, name: product.name, imageURL: product.imageUrl, price: beach.pricing!.price, beach: { id: beach.id, name: beach.name } } }
    //   )
    //)
  }

  onProductsLoad(products: Product[]) {
    this.products = products.map((product) => { return { ...product, price: product.BeachProduct!.price, } })
    debugger;
  }
}

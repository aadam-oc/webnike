import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ApiRestService } from '../../services/api-rest.service';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  productos: any[] = [];

  constructor(private apiService: ApiRestService) {}

  ngOnInit(): void {
    this.productos = this.apiService.obtenerProductos(); // Carga los productos
  }

  eliminarProducto(producto: any): void {
    this.apiService.eliminarProducto(producto);
    this.productos = this.apiService.obtenerProductos(); // Actualiza la lista
  }
}

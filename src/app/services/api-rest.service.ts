import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiRestService {
  private apiUrl = 'http://172.17.131.10:3000'; 

  constructor(private http: HttpClient) {}

  subirImagen(file: File): Observable<{ imageUrl: string }> {
    const formData = new FormData();
    formData.append('image', file);

    return this.http.post<{ imageUrl: string }>(`${this.apiUrl}/upload`, formData);
  }

  private productos: any[] = [];

  // Añadir producto
  añadirProducto(producto: any): void {
    this.productos.push(producto);
  }

  // Obtener productos
  obtenerProductos(): any[] {
    return this.productos;
  }

  //Obtiene producto por referencia
  obtenerProducto(referencia: number){
    return this.productos.find(p => p.referencia === referencia)
  }

  // Eliminar producto
  eliminarProducto(producto: any): void {
    this.productos = this.productos.filter((p) => p !== producto);
  }

  //Modifica producto 
  modificarProducto(producto: any): void {
    const index = this.productos.findIndex((p) => p.referencia === producto.referencia);//el findindex devualve el primer objeto del array que cumpla las caracteristicas en este caso que las referencias coincidan
    if (index !== -1) {
      this.productos[index] = producto;
    } else {
      console.error('Producto no encontrado para modificar.');
    }
  }

  //Comprueba que el nombre de producto exista
  existeNombreProducto(nombre: string, referenciaActual: number): boolean {
    return this.productos.some(p => p.nombre === nombre && p.referencia !== referenciaActual);//Some comprueba si alguno de los productos tenga un nombre igual pero una referencia distinta
  }
}

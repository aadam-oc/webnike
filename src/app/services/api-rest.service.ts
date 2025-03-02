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

  // Eliminar producto
  eliminarProducto(producto: any): void {
    this.productos = this.productos.filter((p) => p !== producto);
  }
}

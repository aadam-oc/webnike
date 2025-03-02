import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiRestService } from '../../services/api-rest.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {
  productForm: FormGroup;
  imagenUrl: string = ''; // URL de la imagen subida
  imagenSeleccionada: boolean = false; // Indica si hay una imagen en proceso

  constructor(private fb: FormBuilder, private apiService: ApiRestService) {
    this.productForm = this.fb.group({
      referencia: ['', [Validators.required, Validators.min(1), Validators.max(999999)]],
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      precio: ['', [Validators.required, Validators.min(0.01)]],
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      tipoProducto: ['', Validators.required],
      oferta: [false]
    });
  }

  ngOnInit(): void {}

  // 📌 Manejar la selección de la imagen
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      this.imagenSeleccionada = true; // Activamos el indicador de subida

      this.apiService.subirImagen(file).subscribe(response => {
        this.imagenUrl = response.imageUrl; // Guardamos la URL de la imagen
        this.imagenSeleccionada = false; // Subida completada
      });
    }
  }

  // 📌 Manejar el envío del formulario
  onSubmit(): void {
    if (this.productForm.valid && this.imagenUrl) {
      const producto = {
        referencia: this.productForm.value.referencia,
        nombre: this.productForm.value.nombre,
        precio: Number(this.productForm.value.precio), // Asegurar que es número
        descripcion: this.productForm.value.descripcion,
        tipoProducto: this.productForm.value.tipoProducto,
        oferta: this.productForm.value.oferta || false,
        imagen: this.imagenUrl
      };
  
      this.apiService.añadirProducto(producto);
      console.log('Producto añadido:', producto);
      
      // Resetear formulario
      this.productForm.reset();
      this.imagenUrl = '';
    } else {
      console.log('Formulario inválido o imagen no subida');
    }
  }
}

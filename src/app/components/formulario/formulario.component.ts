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
  imagenUrl: string = '';
  imagenSeleccionada: boolean = false;
  productoExistente: boolean = false;

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

  buscarProducto(): void {
    const referencia = this.productForm.get('referencia')?.value;

    if (referencia) {
      this.apiService.obtenerProductoPorReferencia(referencia).subscribe(producto => {
        if (producto) {
          this.productForm.patchValue({
            nombre: producto.nombre,
            precio: producto.precio,
            descripcion: producto.descripcion,
            tipoProducto: producto.tipoProducto,
            oferta: producto.oferta
          });
          this.imagenUrl = producto.imagen;
          this.productoExistente = true;
        } else {
          this.productoExistente = false;
        }
      });
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      this.imagenSeleccionada = true;

      this.apiService.subirImagen(file).subscribe(response => {
        this.imagenUrl = response.imageUrl;
        this.imagenSeleccionada = false;
      });
    }
  }

  onSubmit(): void {
    if (this.productForm.valid && this.imagenUrl) {
      const producto = {
        referencia: this.productForm.value.referencia,
        nombre: this.productForm.value.nombre,
        precio: Number(this.productForm.value.precio),
        descripcion: this.productForm.value.descripcion,
        tipoProducto: this.productForm.value.tipoProducto,
        oferta: this.productForm.value.oferta || false,
        imagen: this.imagenUrl
      };

      if (this.productoExistente) {
        this.apiService.modificarProducto(producto); 
        console.log('Producto modificado:', producto);
      } else {
        this.apiService.añadirProducto(producto);
        console.log('Producto añadido:', producto);
      }

      this.productForm.reset();
      this.imagenUrl = '';
      this.productoExistente = false;
    } else {
      console.log('Formulario inválido o imagen no subida');
    }
  }
}

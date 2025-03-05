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
      referencia: ['', [Validators.required, Validators.min(1), Validators.max(10)]], // Referencia de 1 a 10 dígitos
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]], // Nombre de 3 a 50 caracteres
      precio: ['', [Validators.required, Validators.min(0.01)]], // Precio mínimo 0.01
      descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]], // Descripción de 10 a 200 caracteres
      tipoProducto: ['', Validators.required], 
      oferta: [false]
    });
  }

  ngOnInit(): void {}

  buscarProducto(): void { 
    const referencia = this.productForm.get('referencia')?.value; //Recoge el valor de referencia 

    if (referencia) { //Si referencia existe recoge el producto del array y lo muestra en los inserts del formulario
      const producto = this.apiService.obtenerProducto(referencia); //Usa la funcion de la api para obtener el producto por la referencia

      if (producto) { //Si el producto existe muestra los datos en los inputs del formulario
        this.productForm.patchValue({ //Setea los valores de los inputs del formulario
          nombre: producto.nombre, 
          precio: producto.precio,
          descripcion: producto.descripcion,
          tipoProducto: producto.tipoProducto,
          oferta: producto.oferta
        });
        this.imagenUrl = producto.imagen; //Setea la imagen del producto en la variable imagenUrl
        this.productoExistente = true; //Setea la variable productoExistente a true ya que si entra aqui es que existe
      } else { //Si no existe el producto setea productoExistente a false para que onsubmit cree un nuevo producto
        this.productoExistente = false;
      }
    }
  }

  onFileSelected(event: any): void {//Esta funcion se ejecuta en el html cuando se selecciona una imagen
    const file: File = event.target.files[0];//Recoge el archivo seleccionado

    if (file) { //Si el archivo existe se sube a la api
      this.imagenSeleccionada = true; //Setea la variable imagenSeleccionada a true para que se muestre el texto de que se esta subiendo la imagen

      this.apiService.subirImagen(file).subscribe(response => { //Sube la imagen a la api y recoge la url de la imagen
        this.imagenUrl = response.imageUrl; //Setea la url de la imagen en la variable imagenUrl
        this.imagenSeleccionada = false; //Setea la variable imagenSeleccionada a false para que se muestre la vista previa de la imagen
      });
    }
  }

  onSubmit(): void { //Esta funcion se ejecuta cuando se pulsa el boton de submit
    if (this.productForm.valid && this.imagenUrl) { //Si el formulario es valido y la imagen esta subida
      const producto = { //Crea un objeto producto con los valores del formulario
        referencia: this.productForm.value.referencia,
        nombre: this.productForm.value.nombre,
        precio: Number(this.productForm.value.precio),
        descripcion: this.productForm.value.descripcion,
        tipoProducto: this.productForm.value.tipoProducto,
        oferta: this.productForm.value.oferta || false,
        imagen: this.imagenUrl
      };

      if (this.apiService.existeNombreProducto(producto.nombre, producto.referencia)) {
        alert('Error: Ya existe un producto con este nombre.');
        return; 
      }

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

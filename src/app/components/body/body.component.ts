import { Component } from '@angular/core';
import { ProductosComponent } from '../productos/productos.component';
import { FormularioComponent } from '../formulario/formulario.component';

@Component({
  selector: 'app-body',
  imports: [ProductosComponent, FormularioComponent],
  templateUrl: './body.component.html',
  styleUrl: './body.component.css'
})
export class BodyComponent {

}

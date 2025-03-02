import { Routes } from '@angular/router';
import { BodyComponent } from './components/body/body.component';
import { InicioComponent } from './inicio/inicio.component';
import { ProductosComponent } from './components/productos/productos.component';



export const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'inicio', component: InicioComponent },
  { path: 'productos', component: ProductosComponent },
  { path: 'body', component: BodyComponent },
  
];

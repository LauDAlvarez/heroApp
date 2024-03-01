import { Injectable } from "@angular/core"; 
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { environments } from '../../../environments/environments';
import { User } from "../interfaces/User.interfaces";
import { LoginPageComponent } from '../pages/login-page/login-page.component';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { Router } from "@angular/router";
import { ReturnStatement } from "@angular/compiler";

@Injectable({providedIn: 'root'})
export class AuthService{
    private baseUrl = environments.baseUrl;
    private user?: User;

    constructor(
        private http: HttpClient,
    ){}
    
    get currentUser(): User|undefined{
        if(!this.user)return undefined;
        
        return structuredClone(this.user); 
    }

    checkAuthentication(): Observable <Boolean>{
        if( !localStorage.getItem('token')) return of(false);

        const token = localStorage.getItem("token");
        
        return this.http.get<User> ( `${this.baseUrl}/users/1`)
            .pipe(
                tap( user => this.user = user),
                map( user => !!user ),
                catchError( (err) => of(false) )    
            );

    }

    login( email: string, password: string): Observable<User>{
        
        return  this.http.get<User>(`${this.baseUrl}/users/1`)
                .pipe(
                    tap( user =>{
                        this.user = user;
                        localStorage.setItem('token', user.id.toString());
                    })
                )      
    }
    logout(){
        this.user = undefined;
        localStorage.clear();
    }
}
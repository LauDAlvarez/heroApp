import { Injectable,} from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanMatch, Route, UrlSegment, RouterStateSnapshot, Router} from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { AuthService } from '../service/auth.service';



@Injectable({providedIn:'root'})
export class PublicGuard implements CanMatch, CanActivate{
    constructor(
        private authService: AuthService,
        private router: Router
    ){}

    private checkAuthStatus():Observable<boolean>{
        return this.authService.checkAuthentication()
        .pipe(
            tap( isAuthenticated => isAuthenticated?console.log(`Authenticated: ${isAuthenticated}`):console.log(`Authenticated: ${isAuthenticated}`)),
            tap( isAuthenticated =>{
                if(isAuthenticated){
                    this.router.navigate(['./'])
                }
            }),
            map( isAuthenticated =>  !isAuthenticated) 
        )
    }

    canMatch(route: Route, segments: UrlSegment[]):Observable<boolean>{
        return this.checkAuthStatus();
    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):Observable<boolean>{
        return this.checkAuthStatus();
    }
    
}
import { Injectable } from '@angular/core';
import { resolve } from 'url';
import { Promotion } from '../shared/promotion';
import { PROMOTIONS } from '../shared/promotions';
import {Dish} from '../shared/dish';
import { Observable, of } from 'rxjs';
import { delay, catchError, map } from 'rxjs/operators';
import { HttpClient  } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';

import { ProcessHTTPMsgService } from './process-httpmsg.service';



@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  constructor(private http: HttpClient,
    private processHTTPMsgService: ProcessHTTPMsgService) { }
  getPromotions(): Observable<Promotion[]> {
     return of(PROMOTIONS).pipe(delay(2000));
    ///return this.http.get<Promotion[]>(baseURL + 'promotions')
     /// .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getPromotion(id: string): Observable<Promotion> {
     return of(PROMOTIONS.filter((promo)=>{ promo.id === id} ) [0]).pipe(delay(2000));
    ///return this.http.get<Promotion>(baseURL + 'promotions/' + id)
     /// .pipe(catchError(this.processHTTPMsgService.handleError));
  }

  getFeaturedPromotion(): Observable<Promotion> {
    return of(PROMOTIONS.filter((promo)=> promo.featured)[0]).pipe(delay(2000));
    ///return this.http.get<Promotion[]>(baseURL + 'promotions?featured=true').pipe(map(promotions => promotions[0]))
    ///.pipe(catchError(this.processHTTPMsgService.handleError)); 
   }
}

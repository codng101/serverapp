import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subscriber, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Status } from '../enum/status.enum';
import { CustomResponse } from '../interface/custom-response';
import { Server } from '../interface/server';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
 

  private readonly apiUrl = "http://localhost:8080";

  constructor(private http: HttpClient) { }
  /**
  getServers(): Observable<CustomResponse>{
    return this.http.get<CustomResponse>('http://localhost:8080/server/list');
  }
  */

  servers$ = <Observable<CustomResponse>>this.http.get<CustomResponse>(`${this.apiUrl}/server/list`)
  .pipe(
    tap(console.log),
    catchError(this.handlerError)
  )

  save$ = (server : Server) => <Observable<CustomResponse>>
  this.http.post<CustomResponse>(`${this.apiUrl}/server/save`, server)
  .pipe(
    tap(console.log),
    catchError(this.handlerError)
  )

  ping$ = (ipAddresse : string) => <Observable<CustomResponse>>
  this.http.get<CustomResponse>(`${this.apiUrl}/server/save/${ipAddresse}`)
  .pipe(
    tap(console.log),
    catchError(this.handlerError)
  )

  filter$ = (status : Status, response: CustomResponse) => <Observable<CustomResponse>>
  new Observable<CustomResponse>(
    subscriber =>{
      console.log(response);
      subscriber.next(
        status === Status.ALL ? { ...response, message: `Servers filtered by ${status} status`} :
        { 
          ...response,
          message: response.data.servers
          .filter( server => server.status === status).length > 0 ? `Servers filtered by 
          ${status === Status.SERVER_UP  ? 'SERVER UP' : 'SERVER DOWN'} status` : `No server of ${Status} found`,
          data: {servers :response.data.servers
            .filter( server => server.status === status)}
        }
      );
      subscriber.complete();
    }
  )
  .pipe(
    tap(console.log),
    catchError(this.handlerError)
  )   

  delete$ = (serverId : number) => <Observable<CustomResponse>>
  this.http.delete<CustomResponse>(`${this.apiUrl}/server/delete/${serverId}`)
  .pipe(
    tap(console.log),
    catchError(this.handlerError)
  )

  private handlerError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    return throwError(`An error occured - Error code: ${error.status}`);
  }
}

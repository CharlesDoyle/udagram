import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,  HttpErrorResponse, HttpRequest, HttpEvent } from '@angular/common/http';
// environment variables are defined here
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { FeedItem } from '../feed/models/feed-item.model';
import { catchError, tap, map } from 'rxjs/operators';

const API_HOST = environment.apiHost; // our host variable (local or cloud host)

// Create an ApiService class with our httpOptions for headers, jwt tokens,
// and GET, POST methods, 
// and an upload method which makes GET, PUT and POST calls
// to post an image to our app (GET putSignedUrl, PUT the image in S3, 
// POST metadata to db) 

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  httpOptions = {
    headers: new HttpHeaders({'Content-Type': 'application/json'}) // set the type of headers
  }; // create a key:value for the header of the http request

  token: string; // create an empty token, in case nobody calls setAuthToken

  // construct the ApiService instance by passing an HttpClient arg
  // which has http.get() and http.post() 
  constructor(private http: HttpClient) {
  }

  handleError(error: Error) {
    alert(error.message);
  }

  // the first instance method
  // pass a jwt to this function and set the http header Authorization option 
  // to 'jwt header.payload.signature'
  setAuthToken(token) {
    this.httpOptions.headers = this.httpOptions.headers.append('Authorization', `jwt ${token}`);
    this.token = token;  // this is the instance of ApiService class
  }
  // make a GET request to an endpoint with the header options set, and then
  // pipe the response object to ApiService.extractData(), defined below
  get(endpoint): Promise<any> {
    const url = `${API_HOST}${endpoint}`; // build the url for the request
    // http.get() makes a GET request using the Angular service
    const req = this.http.get(url, this.httpOptions).pipe(map(this.extractData));

    return req
            .toPromise()
            .catch((e) => {
              this.handleError(e);
              throw e;
            });
  }
  // POST image metadata to my DB
  // data arg is an object with {caption: "Xander 0", url: "xander0.jpg"}
  post(endpoint, data): Promise<any> {
    const url = `${API_HOST}${endpoint}`;
    return this.http.post<HttpEvent<any>>(url, data, this.httpOptions)
            .toPromise()
            .catch((e) => {
              this.handleError(e);
              throw e;
            });
  }

  // upload method: ties together GET, PUT and POST 
  // use methods in this class to GET a putSignedUrl for the filename,
  // then PUT the image to my S3 bucket with the signed-url
  // then POST the metadata payload to my DB (caption and url fields)
  async upload(endpoint: string, file: File, payload: any): Promise<any> {
    // make a GET request to my server for a putSignedUrl
    // this.get() returns the object, and we extract the signed-url by obj.url
    const signed_url = (await this.get(`${endpoint}/signed-url/${file.name}`)).url;
    // build an HTTP PUT request with header, sent to the signed-url at my S3
    // file is the filename of the image, like xander0.jpg
    const headers = new HttpHeaders({'Content-Type': file.type});
    const req = new HttpRequest( 'PUT', signed_url, file,
                                  {
                                    headers: headers,
                                    reportProgress: true, // track progress
                                  });
    // send the PUT as a promise, and when it returns, POST the metadata
    return new Promise ( resolve => {
      // make the PUT request and get a response  
      this.http.request(req).subscribe((resp) => {
        // when the PUT response comes back from S3
        if (resp && (<any> resp).status && (<any> resp).status === 200) {
          // if the PUT is a 200, POST the metadata
          resolve(this.post(endpoint, payload)); 

        }
      });
    });
  }

  /// Utilities
  private extractData(res: HttpEvent<any>) {
    const body = res;
    return body || { };
  }
}

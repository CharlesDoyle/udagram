import { Injectable } from '@angular/core';
import { FeedItem, feedItemMocks } from '../models/feed-item.model';
import { BehaviorSubject } from 'rxjs';

import { ApiService } from '../../api/api.service';

// This FeedProviderService class is the high-level consumer of the ApiService
// FeedProviderService uses the ApiService to make 
// http GET, POST, PUT requests for FeedItem objects and images
// and then provides the returned data to the Views to display them
@Injectable({
  providedIn: 'root'
})
export class FeedProviderService {
  // make a class array for FeedItem objects returned from a GET /feed request
  // that will send the data to the Views for display
  currentFeed$: BehaviorSubject<FeedItem[]> = new BehaviorSubject<FeedItem[]>([]);

  constructor(private api: ApiService) { }

  // use the GET method in ApiService class on api.service.ts module
  // to get all FeedItem objects
  async getFeed(): Promise<BehaviorSubject<FeedItem[]>> {
    // GET the metadata of FeedItem objects from the DB
    const req = await this.api.get('/feed');
    // extract the records, which will be an array of FeedItem objects
    const items = <FeedItem[]> req.rows;
    // give our Views (our frontend) the new FeedItem objects
    this.currentFeed$.next(items);
    return Promise.resolve(this.currentFeed$); // return the feed of images to the Views
  }

  async uploadFeedItem(caption: string, file: File): Promise<any> {
    const res = await this.api.upload('/feed', file, {caption: caption, url: file.name});
    const feed = [res, ...this.currentFeed$.value];
    this.currentFeed$.next(feed);
    return res;
  }

}

// async getFeed() {
//   const url = `${API_HOST}/feed`;

//   const req = this.http.get(url, this.httpOptions).pipe(
//     map(this.extractData));
//     // catchError(this.handleError));
//   const resp = <any> (await req.toPromise());
//   return resp.rows;
// }

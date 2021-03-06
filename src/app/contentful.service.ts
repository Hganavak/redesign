import { Injectable } from '@angular/core';
import * as contentful from 'contentful';
import { environment } from 'src/environments/environment';
import { Observable, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ContentfulService {

  // Initialize Contentful client
  private client = contentful.createClient({
    space: environment.contentful.spaceId,
    accessToken: environment.contentful.token
  });

  constructor() { }

  getContent(contentId) {
    return from(this.client.getEntry(contentId)).pipe( // Convert the ContentfulClients promise object to an observable
      map(entry => entry.fields) // Strip the Contentful metadata and just leave the entry fields
    );
  }

  // Console log a piece of Content for testing
  logContent(contentId) {
    this.client.getEntry(contentId)
      .then(entry => console.log(entry));
  }

  // Get all entries of type
  getEntries(contentType: string, limit?: number) {
    return from(this.client.getEntries({ 'content_type': contentType, 'order': '-sys.createdAt', limit: limit})).pipe(
      map(entries => entries.items.map(entry => entry.fields))
    );
  }

  // Get blog post by its slug
  getBlogPostBySlug(slug) {
    return from(this.client.getEntries({
      'content_type': 'blogPost',
      'fields.slug[in]': slug,
      })).pipe(
        map(entries => entries.items[0].fields)
    );
  }

  // Get portfolio item by its slug
  getPortfolioItemBySlug(slug) {
    return from(this.client.getEntries({
      'content_type': 'portfolioItem',
      'fields.slug[in]': slug,
      })).pipe(
        map(entries => entries.items[0].fields)
    );
  }

}

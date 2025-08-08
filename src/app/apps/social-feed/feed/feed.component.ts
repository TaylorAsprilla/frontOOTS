import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { POSTS } from '../shared/data';
import { Comment, Post } from '../shared/social-feed.model';

@Component({
  selector: 'app-social-feeds',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit {


  socialFeeds: Post[] = [];

  constructor (private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    // get social feed data
    this._fetchData();
  }

  /**
   *  fetches social feed 
   */
  _fetchData(): void {
    this.socialFeeds = POSTS;
  }

  /**
   * returns the safe content which can be rendered
   * @param content string
   */
  getRenderedPostContent(content: string) {
    if (content.includes("iframe")) {
      return this.sanitizer.bypassSecurityTrustHtml(content);
    }
    return this.sanitizer.sanitize(1, content);
  }

  /**
   * toggle like
   * @param post post
   */
  toggleLike(post: Post) {
    post.isLiked = !post.isLiked;
  }

  /**
   * Comment
   * @param comment comment obj
   */
  toggleLikeOnComment(comment: Comment) {
    comment.isLiked = !comment.isLiked;
  }

}
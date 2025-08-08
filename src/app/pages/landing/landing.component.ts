import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/core/service/auth.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  backToTopButton: any;
  loggedInUser: any = {};

  constructor (
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this.authService.currentUser();

    let mybutton = document.getElementById("back-to-top-btn");
    window.addEventListener('scroll', () => {
      if (mybutton) {
        if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
          mybutton.style.display = "block";
        } else {
          mybutton.style.display = "none";
        }
      }
    });
  }

  ngAfterViewInit(): void {
    document.body.classList.add("pb-0");
  }

  ngOnDestroy(): void {
    document.body.classList.remove("pb-0");
  }

  /**
   * reach to top of web page
   */
  topFunction(): void {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

}

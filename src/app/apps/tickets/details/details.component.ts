import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { TICKETSLIST } from '../shared/data';
import { TicketDetails, TicketItem } from '../shared/tickets.model';

@Component({
  selector: 'app-ticket-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  selectedTicket!: TicketItem;
  ticketDetails!: TicketDetails;


  constructor (private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Tickets', path: '/' }, { label: 'Ticket Details', path: '/', active: true }];

    this.route.queryParams.subscribe(params => {
      if (params && params.hasOwnProperty('id')) {
        this.selectedTicket = TICKETSLIST.filter(x => String(x.id) === params['id'])[0];
      } else {
        this.selectedTicket = TICKETSLIST[0];
      }
    });

    this._fetchData();
  }

  /**
   * fetches ticket details for selected ticket
   */
  _fetchData(): void {
    this.ticketDetails = {
      id: this.selectedTicket.id,
      title: this.selectedTicket.subject,
      type: 'Payment',
      reported_by: {
        name: this.selectedTicket.requested_by.name,
        image: this.selectedTicket.requested_by.image,
      },
      assigned_to: {
        name: 'Thelma Fridley',
        image: this.selectedTicket.assignee,
      },
      created_on: {
        date: '10 Feb 2020',
        time: '1:37 PM',
      },
      updated_on: {
        date: '15 Feb 2020',
        time: '4:09 PM',
      },
      overview: 'This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer. Some quick example text to build on the card title and make up the bulk of the card\'s content.Some quick example text to build on the card title and make up.',
      discussion: [
        {
          avatar: 'assets/images/users/user-9.jpg',
          name: 'Jonathan Andrews',
          text: 'Nice work, makes me think of The Money Pit',
          time: '3 hours ago'
        },
        {
          avatar: 'assets/images/users/user-5.jpg',
          name: 'Thelma Fridley',
          text: 'It would be very nice to have.',
          time: '5 hours ago'
        },
        {
          avatar: 'assets/images/users/user-9.jpg',
          name: 'Jonathan Andrews',
          text: "i'm in the middle of a timelapse animation myself!(Very different though.) Awesome stuff.",
          time: '1 day ago'
        }
      ]
    }

  }

}

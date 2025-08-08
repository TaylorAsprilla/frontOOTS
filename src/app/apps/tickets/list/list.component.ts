import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Column } from 'src/app/shared/advanced-table/advanced-table.component';
import { SortEvent } from 'src/app/shared/advanced-table/sortable.directive';
import { BreadcrumbItem } from 'src/app/shared/page-title/page-title.model';
import { TICKETSLIST } from '../shared/data';
import { TicketItem } from '../shared/tickets.model';

@Component({
  selector: 'app-tickets-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  pageTitle: BreadcrumbItem[] = [];
  columns: Column[] = [];
  pageSizeOptions: number[] = [5, 10, 20];
  ticketList: TicketItem[] = [];

  @ViewChild('advancedTable') advancedTable: any;

  constructor (private router: Router, private route: ActivatedRoute, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.pageTitle = [{ label: 'Tickets', path: '/' }, { label: 'Ticket List', path: '/', active: true }];
    this._fetchData();
    this.initAdvancedTableData();
  }

  /**
   * fetches ticket list
   */
  _fetchData(): void {
    this.ticketList = TICKETSLIST;
  }

  /**
 * initialize advance table columns
 */
  initAdvancedTableData(): void {
    this.columns = [
      {
        name: 'id',
        label: 'ID',
        formatter: this.ticketIdFormatter.bind(this)
      },
      {
        name: 'requested_by',
        label: 'Requested By',
        formatter: this.ticketRequestedFormatter.bind(this)
      },
      {
        name: 'subject',
        label: 'Subject',
        formatter: (ticket: TicketItem) => ticket.subject
      },
      {
        name: 'assignee',
        label: 'Assignee',
        formatter: this.ticketAssigneeFormatter.bind(this),
        sort: false
      },
      {
        name: 'priority',
        label: 'Priority',
        formatter: this.ticketPriorityFormatter.bind(this)
      },
      {
        name: 'status',
        label: 'Status',
        formatter: this.ticketStatusFormatter.bind(this)
      },
      {
        name: 'created_date',
        label: 'Created Date',
        formatter: (ticket: TicketItem) => ticket.created_date
      },
      {
        name: 'due_date',
        label: 'Due Date',
        formatter: (ticket: TicketItem) => ticket.due_date
      },
      {
        name: 'Action',
        label: 'Action',
        width: 75,
        formatter: this.customerActionFormatter.bind(this),
        sort: false
      }]
  }

  /**
 *  handles operations that need to be performed after loading table
 */
  handleTableLoad(event: any): void {
    document.querySelectorAll('.ticket').forEach((e) => {
      e.addEventListener("click", () => {
        this.router.navigate(['../details'], { relativeTo: this.route, queryParams: { id: e.id } })
      });
    })
  }


  //formats id cell
  ticketIdFormatter(ticket: TicketItem): any {
    return this.sanitizer.bypassSecurityTrustHtml(`<b>${ticket.id}</b>`)
  }

  // formats requested by cell
  ticketRequestedFormatter(ticket: TicketItem): any {
    return this.sanitizer.bypassSecurityTrustHtml(
      `<a href="javascript: void(0);" class="text-body ticket" id="${ticket.id}">
        <img src="${ticket.requested_by.image}" alt="contact-img" title="contact-img" class="rounded-circle avatar-xs" />
        <span class="ms-2">${ticket.requested_by.name}</span>
         </a>`
    );
  }

  // formats assignee cell
  ticketAssigneeFormatter(ticket: TicketItem): any {
    return this.sanitizer.bypassSecurityTrustHtml(
      `  <a href="javascript: void(0);">
        <img src="${ticket.assignee}" alt="contact-img" title="contact-img" class="rounded-circle avatar-xs" />
        </a>`
    );
  }

  // formats ticket priority
  ticketPriorityFormatter(ticket: TicketItem): any {
    if (ticket.priority == "Low") {
      return this.sanitizer.bypassSecurityTrustHtml(
        ` <span class="badge bg-soft-secondary text-secondary">Low</span>`
      );
    }
    else if (ticket.priority == 'Medium') {
      return this.sanitizer.bypassSecurityTrustHtml(
        ` <span class="badge bg-soft-warning text-warning">Medium</span>`
      );
    }
    else {
      return this.sanitizer.bypassSecurityTrustHtml(
        ` <span class="badge bg-soft-danger text-danger">High</span>`
      );
    }

  }

  // formats ticket status
  ticketStatusFormatter(ticket: TicketItem): any {
    if (ticket.status == "Open") {
      return this.sanitizer.bypassSecurityTrustHtml(
        `<span class="badge bg-success">Open</span>`
      );
    }
    else {
      return this.sanitizer.bypassSecurityTrustHtml(
        `<span class="badge  bg-secondary text-light">Closed</span>`
      );
    }

  }

  // action cell formatter
  customerActionFormatter(): any {
    return this.sanitizer.bypassSecurityTrustHtml(
      ` <div class="btn-group dropdown" >
       <a href="javascript: void(0);" class="table-action-btn arrow-none btn btn-light btn-sm" ><i class="mdi mdi-dots-horizontal"></i></a>
       <div class="dropdown-menu dropdown-menu-end" >
        <a class="dropdown-item" href="javascript:void(0)"><i class="mdi mdi-pencil me-2 text-muted font-18 vertical-middle"></i>Edit Ticket</a>
        <a class="dropdown-item" href="javascript:void(0)"><i class="mdi mdi-check-all me-2 text-muted font-18 vertical-middle"></i>Close</a>
        <a class="dropdown-item" href="javascript:void(0)"><i class="mdi mdi-delete me-2 text-muted font-18 vertical-middle"></i>Remove</a>
        <a class="dropdown-item" href="javascript:void(0)"><i class="mdi mdi-star me-2 font-18 text-muted vertical-middle"></i>Mark as Unread</a>
        </div>
        </div>`
    );
  }

  /**
 * compares two cell value
 */
  compare(v1: any, v2: any): number {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  }

  /**
   * Sort the table data
   * @param event column name,direction
   */
  sort(event: SortEvent): void {
    if (event.direction === '') {
      this.ticketList = TICKETSLIST;
    } else {
      this.ticketList = [...this.ticketList].sort((a, b) => {
        let res: any;
        if (event.column === 'requested_by') {
          res = this.compare(a['requested_by']['name'], b['requested_by']['name']);
        }
        else {
          res = this.compare(a[event.column], b[event.column]);
        }

        return event.direction === 'asc' ? res : -res;
      });
    }
  }

  /**
 * Match table data with search input
 * @param row Table row
 * @param term Search the value
 */
  matches(row: TicketItem, term: string) {
    return row.requested_by.name?.toLowerCase().includes(term)
      || row.subject?.toLowerCase().includes(term)
      || row.priority?.toLowerCase().includes(term)
      || row.created_date?.toLowerCase().includes(term)
      || row.due_date?.toLowerCase().includes(term)
      || row.status?.toLocaleLowerCase().includes(term);
  }

  /**
   * Search Method
   */
  searchData(searchTerm: string): void {
    if (searchTerm === '') {
      this._fetchData();
    }
    else {
      let updatedData = TICKETSLIST;
      //  filter
      updatedData = updatedData.filter(ticket => this.matches(ticket, searchTerm));
      this.ticketList = updatedData;
    }

  }

}

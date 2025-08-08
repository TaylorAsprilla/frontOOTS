import { TimelineItem } from "./timeline.model";

export const TIMELINEDATA: TimelineItem[] = [
    {
        id: 1,
        day: 'Today',
        posts: [{
            id: 1,
            postedOn: '1 hour ago',
            time: '08:25 am',
            content: `<p class="mb-0">Dolorum provident rerum aut hic quasi placeat iure tempora laudantium ipsa ad debitis unde? </p>`,
        },
        {
            id: 2,
            postedOn: '2 hour ago',
            time: '08:25 am',
            content: `<p class="mb-0">consectetur adipisicing elit. Iusto, optio, dolorum <a href=""> John deon </a> provident rerum aut hic quasi placeat iure tempora laudantium </p>`,
        },
        {
            id: 3,
            postedOn: '10 hour ago',
            time: '08:25 am',
            content: `
                <p>3 new photo Uploaded on facebook fan page</p>
                <div class="timeline-album"> 
                   <a href="">  
                       <img alt="" src="../assets/images/small/img-1.jpg">  
                   </a> 
                   <a href="">  
                       <img alt="" src="../assets/images/small/img-2.jpg">  
                   </a> 
                    <a href="">
                        <img alt="" src="../assets/images/small/img-3.jpg">
                    </a>
                </div>
                `,
        },
        {
            id: 4,
            postedOn: '14 hour ago',
            time: '08:25 am',
            content: `<p class="mb-0">Outdoor visit at California State Route 85 with John Boltana & Harry Piterson regarding to setup a new show room.</p>`,
        },
        {
            id: 5,
            postedOn: '19 hour ago',
            time: '08:25 am',
            content: ` <p class="mb-0">Jonatha Smith added new milestone <span><a href=""> Pathek </a></span>Lorem ipsum dolor sit amet consiquest dio</p>`,
        }]
    },
    {
        id: 2,
        day: 'Yesterday',
        posts: [{
            id: 6,
            postedOn: '07 January 2018',
            time: '08:25 am',
            content: `<p class="mb-0">Montly Regular Medical check up at Greenland Hospital by the doctor <span><a href=""> Johm meon </a></span></p>`,
        },
        {
            id: 7,
            postedOn: '07 January 2018',
            time: '08:25 am',
            content: `<p class="mb-0">Download the new updates of Ubold admin dashboard</p>`,
        },
        {
            id: 8,
            postedOn: '07 January 2018',
            time: '08:25 am',
            content: `<p class="mb-0">Jonatha Smith added new milestone <span><a class="blue" href=""> crishtian </a></span>Lorem ipsum dolor sit amet consiquest dio</p>`,
        }]
    },
    {
        id: 3,
        day: 'Last Month',
        posts: [{
            id: 9,
            postedOn: '31 December 2017',
            time: '08:25 am',
            content: `<p class="mb-0">Download the new updates of Ubold admin dashboard</p>`,
        },
        {
            id: 10,
            postedOn: '16 Decembar 2017',
            time: '08:25 am',
            content: `<p class="mb-0">Jonatha Smith added new milestone <span><a href=""> prank </a></span>Lorem ipsum dolor sit amet consiquest dio</p>`,
        }]
    }
];
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-qr-detail',
  templateUrl: './qr-detail.page.html',
  styleUrls: ['./qr-detail.page.scss'],
})
export class QrDetailPage implements OnInit {
  touristicPlaceId: any;
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    const routeParams = this.route.snapshot.paramMap;
    this.touristicPlaceId = Number(routeParams.get('id'));
    console.log('ID FROM QR', this.touristicPlaceId);
  }

}

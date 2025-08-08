import { Component, Input, OnInit } from "@angular/core";
import { MemberInfo } from "../contacts/shared/contacts.model";
import { UsuarioInfoInterface } from "src/app/core/interface/usuario.interface";

@Component({
  selector: "app-contact-member-info",
  templateUrl: "./member-info.component.html",
  styleUrls: ["./member-info.component.scss"],
})
export class MemberInfoComponent implements OnInit {
  @Input() usuario: UsuarioInfoInterface = {};

  constructor() {}

  ngOnInit(): void {}
}

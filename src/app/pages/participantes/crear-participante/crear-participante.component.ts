import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { BreadcrumbItem } from "src/app/shared/page-title/page-title.model";

@Component({
  selector: "app-crear-participante",
  templateUrl: "./crear-participante.component.html",
  styleUrls: ["./crear-participante.component.scss"],
})
export class CrearParticipanteComponent implements OnInit {
  pageTitle: BreadcrumbItem[] = [];
  activeWizard1: number = 1;
  activeWizard2: number = 1;
  activeWizard3: number = 1;
  activeWizard4: number = 1;

  formularioForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.formularioForm = this.formBuilder.group({
      datosPersonales: this.formBuilder.group({
        primerNombre: ["", [Validators.required, Validators.maxLength(50)]],
        segundoNombre: ["", Validators.maxLength(50)],
        primerApellido: ["", [Validators.required, Validators.maxLength(50)]],
        segundoApellido: ["", Validators.maxLength(50)],
        celular: ["", [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
        email: ["", [Validators.required, Validators.email]],
        idTipoDocumento: ["", Validators.required],
        numeroDocumento: [
          "",
          [Validators.required, Validators.pattern(/^[0-9]{6,12}$/)],
        ],
        direccion: ["", [Validators.required, Validators.maxLength(200)]],
        ciudad: ["", [Validators.required, Validators.maxLength(50)]],
        fechaNacimiento: ["", [Validators.required, this.validateAge(18)]],
        afiliacionReligiosa: [""],
        fuenteReferido: [""],
        idGenero: ["", Validators.required],
        idEstadoCivil: ["", Validators.required],
        idEps: ["", Validators.required],
        idTipoVivienda: ["", Validators.required],
      }),

      composicionFamiliar: this.formBuilder.group({
        nombre: ["", Validators.required],
        fechaNacimiento: [],
        ocupacion: [],
        idParentesco: [],
        idGradoAcademico: [],
      }),
      motivoConsulta: this.formBuilder.group({
        motivo: [],
      }),
      situacionesIdentificadas: this.formBuilder.group({
        situaciones: [],
      }),
      intervencion: this.formBuilder.group({
        intervencion: [],
      }),
      planASeguir: this.formBuilder.group({
        planASeguir: [],
      }),

      historialAcademico: this.formBuilder.group({
        escolaridad: [""],
        gradoCompletado: [""],
        institucion: [""],
        profesion: [""],
        fuenteIngresos: [""],
        ingresoMensual: [""],
        historialOcupacional: [""],
        vivienda: [""],
      }),

      historialSaludFisica: this.formBuilder.group({
        condicionesFisicas: [""],
        recibeTratamiento: [""],
        tratamientoDetalle: [""],
        historialFamiliarPaterno: [""],
        historialFamiliarMaterno: [""],
        observacionesSaludFisica: [""],
      }),

      historialSaludMental: this.formBuilder.group({
        condicionesMentales: [""],
        recibeTratamientoMental: [""],
        tratamientoMentalDetalle: [""],
        historialMentalPaterno: [""],
        historialMentalMaterno: [""],
        observacionesSaludMental: [""],
      }),

      ponderacion: this.formBuilder.group({
        motivoConsulta: [""],
        factoresConcurrentes: [""],
        factoresCriticos: [""],
        analisisProblema: [""],
      }),

      planIntervencion: this.formBuilder.group({
        descripcion: [""],
      }),

      notasProgreso: this.formBuilder.array([this.crearNotaVacia()]),

      referidos: this.formBuilder.group({
        descripcion: [""],
      }),

      notaCierre: this.formBuilder.group({
        observaciones: [""],
      }),
    });
  }

  // Validación personalizada para edad mínima
  validateAge(minAge: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) return null;

      const birthDate = new Date(control.value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      return age >= minAge ? null : { underAge: { requiredAge: minAge } };
    };
  }

  crearNotaVacia(): FormGroup {
    return this.formBuilder.group({
      fecha: ["", Validators.required],
      hora: [""],
      tipoAbordaje: ["", Validators.required],
      proceso: [""],
      resumen: ["", Validators.required],
      observaciones: [""],
      acuerdos: [""],
    });
  }
  // Método para agregar notas de progreso
  agregarNota(): void {
    this.notasProgreso.push(this.crearNotaVacia());
  }

  // Eliminar nota
  eliminarNota(index: number): void {
    this.notasProgreso.removeAt(index);

    // Si no quedan notas, agregar una vacía
    if (this.notasProgreso.length === 0) {
      this.agregarNota();
    }
  }

  // Getter para facilitar el acceso a las notas
  get notasProgreso(): FormArray {
    return this.formularioForm.get("notasProgreso") as FormArray;
  }

  // goes to next wizard
  // gotoNext(): void {
  //   if (this.datosPersonales.valid) {
  //     if (this.composicionFamiliar.valid) {
  //       this.activeWizard4 = 3;
  //     } else {
  //       this.activeWizard4 = 2;
  //     }
  //   }
  // }

  markAllAsTouched(group: FormGroup | FormArray): void {
    Object.values(group.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markAllAsTouched(control);
      }
    });
  }

  onSubmit(): void {
    if (this.formularioForm.valid) {
      if (confirm("¿Está seguro de enviar el formulario?")) {
        console.log("Formulario enviado:", this.formularioForm.value);
        // Aquí iría la lógica para enviar los datos al servidor
      }
    } else {
      this.markAllAsTouched(this.formularioForm);
      alert("Por favor complete todos los campos requeridos correctamente.");
    }
  }
}

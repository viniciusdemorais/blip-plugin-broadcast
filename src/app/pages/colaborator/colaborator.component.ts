import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Colaborador } from '@app/models/Colaborador';
import { AreaService } from '@app/services/area.service';
import { Area } from '@app/models/Area';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { CidadeService } from '@app/services/cidade.service';
import { Cidade } from '@app/models/Cidade';
import { ColaboradorService } from '@app/services/colaborador.service';

@Component({
  selector: 'app-colaborator',
  templateUrl: './colaborator.component.html',
  styleUrls: ['./colaborator.component.scss']
})
export class ColaboratorComponent implements OnInit, OnDestroy {
  unsub = new Subject();
  personForm: FormGroup;

  loadingArea = false;
  loadingCidade = false;
  loadingColaborador = false;
  edit = false;

  titleForm: string;
  textForm: string;

  displayedColumns = ['nome', 'email', 'area', 'cidade', 'actions'];

  areas: Area[] = [];
  cidades: Cidade[] = [];
  colaboradores: Colaborador[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private areaService: AreaService,
    private cidadeService: CidadeService,
    private colaboradorService: ColaboradorService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.getAreas();
    this.getCidades();
    this.getColaboradores();
  }

  ngOnDestroy() {
    this.unsub.next();
    this.unsub.unsubscribe();
  }

  getAreas() {
    this.loadingArea = true;
    this.areaService
      .retrieveAreas()
      .pipe(
        takeUntil(this.unsub),
        finalize(() => {
          this.loadingArea = false;
        })
      )
      .subscribe(
        res => {
          this.areas = res.list;
        },
        err => {}
      );
  }

  getNameArea(id: number): string {
    if (this.areas.length > 0) {
      return this.areas.find(a => a.idArea === id).nome;
    }
  }

  getCidades() {
    this.loadingCidade = true;
    this.cidadeService
      .retrieveCidades()
      .pipe(
        takeUntil(this.unsub),
        finalize(() => {
          this.loadingCidade = false;
        })
      )
      .subscribe(
        res => {
          this.cidades = res.list;
        },
        err => {}
      );
  }

  getNameCidade(id: number): string {
    if (this.cidades.length > 0) {
      return this.cidades.find(c => c.idCidade === id).nome;
    }
  }

  getColaboradores() {
    this.loadingColaborador = true;
    this.colaboradorService
      .retrieveColaboradores()
      .pipe(
        takeUntil(this.unsub),
        finalize(() => {
          this.loadingColaborador = false;
        })
      )
      .subscribe(
        res => {
          this.colaboradores = res.list;
        },
        err => {}
      );
  }

  createForm() {
    this.personForm = this.formBuilder.group({
      idColaborador: [0, Validators.required],
      idCidade: [null, Validators.required],
      idArea: [null, Validators.required],
      nome: [null, Validators.required],
      email: [null, Validators.required]
    });
  }

  resetForm() {
    this.personForm.reset();
    Object.keys(this.personForm.controls).forEach(key => {
      this.personForm.controls[key].setErrors(null);
    });
  }

  fillForm(data: Colaborador) {
    Object.keys(this.personForm.controls).forEach(key => {
      if (this.personForm.controls[key]) {
        this.personForm.controls[key].patchValue(data[key]);
      }
    });
  }

  saveColaborador() {
    if (this.personForm.invalid) {
    } else {
      const data: Colaborador = this.personForm.value;
      this.loadingColaborador = true;
      this.colaboradorService
        .saveColaborador(data)
        .pipe(
          takeUntil(this.unsub),
          finalize(() => {
            this.loadingColaborador = false;
          })
        )
        .subscribe(
          res => {
            this.resetForm();
            this.edit = false;
            this.getColaboradores();
          },
          err => {}
        );
    }
  }

  addPerson() {
    this.personForm.controls.idColaborador.patchValue(0);
    this.titleForm = 'Adicionar Take.Ser';
    this.textForm = 'Cadastre os possíveis Take.Seres que podem ser participantes da entrevista.';
    this.edit = true;
  }

  editColaborador(id: number) {
    this.titleForm = 'Editar Take.Ser';
    this.textForm = 'Edite o Take.Ser que pode ser participante da entrevista.';
    const data: Colaborador = this.colaboradores.find(c => c.idColaborador === id);
    this.fillForm(data);
    this.edit = true;
  }

  deleteColaborador(id: number) {
    this.loadingColaborador = true;
    this.colaboradorService
      .deleteColaborador(id)
      .pipe(
        takeUntil(this.unsub),
        finalize(() => {
          this.loadingColaborador = false;
        })
      )
      .subscribe(
        res => {
          this.getColaboradores();
        },
        err => {}
      );
  }
}

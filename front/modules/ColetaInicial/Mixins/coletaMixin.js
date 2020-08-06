import { TimelineLite, Elastic } from "gsap"

export default {
  data(){
    return {
      // Faz o componente filho Aparecer / Esconder
      isShow: false,
      isAnimating: false,
      // local object variable to store form data
      formData: {},

      blipValues: {extras:{}},

      // Reactive object to be used for Provide/Inject
      formState: {
        activeField: 0,
        formLength: 0,
        isNext: true,
        isComplete: false,
        isValid: false,
        jumpedQuestion: []
      }
    }
  },
  computed: {
    activeFieldName() {
      return this.fields[this.dadosQuestoes[this.formState.activeField].name]
    },
    isCurrentFieldValid() {
      // return this.activeFieldName && this.activeFieldName.valid;
      //if (this.isLastField) {
        
      
      

      var allValid = true;
      var first = true;
      for (var prop in this.fields) {
        if (Object.prototype.hasOwnProperty.call(this.fields, prop)) {
            // do stuff
            if(first) {
              if(this.fields[prop].valid==false || this.fields[prop].valid==null){
                allValid=false;
              }
            } else {
              if((this.fields[prop].valid==false || this.fields[prop].valid==null) && this.fields[prop].validate==true){
                allValid=false;
              }
            }
            

            first = false;
        }
      }
      return allValid;

      //return this.activeFieldName && this.activeFieldName.valid
      //} else {
        //return true;
      //}
    },
    isLastField() {
      return this.formState.activeField < this.formState.formLength
    }
  },
  watch: {
    isLastField(newValue) {
      !newValue ? (this.formState.isComplete = true) : (this.formState.isComplete = false)
    },
    isCurrentFieldValid(newValue) {
      newValue ? (this.formState.isValid = true) : (this.formState.isValid = false)
    } 
  },
  methods: {
    checkNext() {
      var allValid = true;
      var first = true;
      var context = this;
      
      var loopFields = function(){
        for (var prop in context.fields) {
          if (Object.prototype.hasOwnProperty.call(context.fields, prop)) {
              // do stuff
              // console.log(context.fields[prop]);

              if(first) {
                if(context.fields[prop].valid==false || context.fields[prop].valid==null){
                  allValid=false;
                }
              } else {
                if((context.fields[prop].valid==false || context.fields[prop].valid==null) && context.fields[prop].validated==true){
                  allValid=false;
                }
              }
              

              first = false;
          }
        }
      }

      if(this.fields && this.fields["dependentes"]) {
        if(this.formData.dependentes && this.formData.dependentes.length>0) {
          for(var i=this.formData.dependentes.length-1;i>=0;i--){
            if(this.formData.dependentes[i].value==''){
              this.formData.dependentes.splice(i,1);
            }
          }
        }
        this.$validator.validate('dependente');

        // console.log('check is valid');
          //console.log(inputObj.key)
          
          var totalErrors;
          totalErrors = 0;
          for(var i=0;i<context.errors.items.length;i++) {
            if(context.errors.items[i].field.indexOf('dependentes_')) {
              totalErrors +=1 ;
            }
          }
          if(totalErrors>0) {
            window.localStorage.setItem("dependentesValid",false);
          } else {
            window.localStorage.setItem("dependentesValid",true);
          }

        this.$validator.validate('dependentes').then(function(){
          loopFields();  
          
          if(allValid) {
            context.proceed()
          } else {
            context.decline(".field-area")
          }

        });
      } else {
        loopFields(); 
        if(allValid) {
          context.proceed()
        } else {
          context.decline(".field-area")
        }
      }
    },
    next(){
      // console.log('nexttttt');
      this.isAnimating = true;
      //this.$validator.validate("dependente");
      this.formState.isNext = true;
      var checkresult;
      checkresult = this.checkNext();
      if(checkresult) {
        //this.proceed()
      } else {
        //this.decline(".field-area")
      }
      //this.isCurrentFieldValid ? this.proceed() : this.decline(".field-area")
    },
    back(){
      this.formState.isNext = false
      let prevQuestion = this.formState.activeField - 1;
      const hasQuestionJumped = this.formState.jumpedQuestion.indexOf(prevQuestion);
      if (hasQuestionJumped != -1) {
        if (this.formState.activeField > 0) {
          this.formState.activeField = this.formState.activeField - 2;
        }
        this.formState.jumpedQuestion.splice(hasQuestionJumped, 1);
      } else {
        this.formState.activeField > 0 ? this.formState.activeField-- : ""
      }
    },
    proceed() {
      if (this.formState.isComplete) {
        localStorage.removeItem("ColetaDados");
        // this.incluirSimulacao();
        this.$router.push('/planos');
      }
      this.isLastField ? this.formState.activeField++ : ""
    },
    decline(element) {
      this.triggerError();
      // Shake form area when the field is invalid
      var tl = new TimelineLite()
      tl.to(element, 0.1, { x: 30 })
      tl.to(element, 3, {
        x: 0,
        ease: Elastic.easeOut.config(0.9, 0.1)
      })
    },
    jumpQuestion(){
      if (this.formState.isNext) {
        this.formState.jumpedQuestion.push(this.formState.activeField);
        this.formState.activeField = this.formState.activeField + 1;
      }
    },
    triggerError(message = '', key = '') {
      let fieldName = '';
      let fieldActive = this.formState.activeField
      let alias = ''

      if (key) {
       fieldName = key;
      } else {
       fieldName = Object.keys(this.fields)[0];  
      }

      if(this.dadosQuestoes && this.dadosQuestoes[fieldActive] && this.dadosQuestoes[fieldActive]["alias"]) {
        alias = this.dadosQuestoes[fieldActive]["alias"];
        message = `Por favor, informe ${alias.toUpperCase()} antes de continuar`;
      } else if (message === '') {
        message = `Por favor, informe ${fieldName.toUpperCase()} antes de continuar`;
      }

      //if (fieldName !== "telefone") {
      const field = this.$validator.fields.find({ name: fieldName });
      this.errors.add({field: fieldName, id: field.id, msg: message});

      field.reset();
      this.$validator.validate(fieldName)
      //}
    }
  }
}
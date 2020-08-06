import Vue from 'vue'
import * as ptBr from 'vee-validate/dist/locale/pt_BR.js';
import VeeValidate, { Validator } from 'vee-validate';
import Dictionary from './dictionary.js'
import CpfValidator from './rules/cpf.js'
import NomeValidator from './rules/nome.js'
import NascimentoValidator from './rules/nascimento.js'
import CepValidator from './rules/cep.js'
import PhoneValidator from './rules/phoneValid.js'
import Phone from './rules/phone.js'
import DependentesValid from './rules/dependentesValid.js'
import DependenteValid from './rules/dependenteValid.js'
import MenorIdadValidator from './rules/menorIdade.js'
import EmailValid from './rules/emailValid.js'
import AlturaEPeso from './rules/alturaEpeso'
import SenhaValidator from './rules/senhaValid'

Validator.extend('cpf', CpfValidator);
Validator.extend('nome', NomeValidator);
Validator.extend('nascimento', NascimentoValidator);
Validator.extend('cep', CepValidator);
Validator.extend('phoneValid', PhoneValidator);
Validator.extend('phone',Phone);
Validator.extend('dependentesValid', DependentesValid);
Validator.extend('dependenteValid', DependenteValid);
Validator.extend('menorIdade', MenorIdadValidator);
Validator.extend('emailValid',EmailValid);
Validator.extend('alturaEpeso',AlturaEPeso);
Validator.extend('senhaValid',SenhaValidator);
// Vue.use(VeeValidate, {
//     errorBagName: 'vErrors'
// });
Vue.use(VeeValidate);
Validator.localize('pt_BR', ptBr);
Validator.localize(Dictionary);
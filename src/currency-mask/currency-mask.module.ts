import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { CurrencyMaskDirective } from "./currency-mask.directive";

@NgModule({
    imports: [CommonModule],
    declarations: [CurrencyMaskDirective],
    exports: [CurrencyMaskDirective]
})
export class CurrencyMaskModule { }
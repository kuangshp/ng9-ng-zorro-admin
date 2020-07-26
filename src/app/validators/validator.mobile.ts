import { FormControl } from '@angular/forms';
import { mobileReg } from '@app/constant';
// 校验手机号码
export const ValidatorsMobile = (control: FormControl): object => {
  if (control.value) {
    let valid = mobileReg.test(control.value);
    return valid ? null : { mobile: true };
  } else {
    return null;
  }
}

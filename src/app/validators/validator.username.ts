import { FormControl } from '@angular/forms';
import { usernameReg } from '@app/constant';
// 校验用户名
export const ValidatorsUsername = (control: FormControl): object => {
  if (control.value) {
    let valid = usernameReg.test(control.value);
    return valid ? null : { username: true };
  } else {
    return null;
  }
}

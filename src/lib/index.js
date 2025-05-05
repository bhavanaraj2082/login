// place files you want to import through the `$lib` alias in this folder.
import parsePhoneNumber from 'libphonenumber-js'

const phoneNumber = parsePhoneNumber('3361739314', 'US')

console.log(phoneNumber.isValid());
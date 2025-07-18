
import parsePhoneNumber from 'libphonenumber-js'

const phoneNumber = parsePhoneNumber('3361739314', 'US')

console.log(phoneNumber.isValid());
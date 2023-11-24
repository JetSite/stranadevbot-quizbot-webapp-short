import * as Yup from 'yup'
const phoneRegExp =
  /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{2}\)?)\s?-?\s?(\(?\d{2}\)?)?$/

export const callMeFormSchema = Yup.object().shape({
  tel: Yup.string()
    .matches(phoneRegExp, 'Неверный формат номера')
    .required('Поле обязательно'),
})

export const callMeInitialValues = { tel: '' }

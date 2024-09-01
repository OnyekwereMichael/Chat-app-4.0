import * as Yup from 'yup'
export const validation = Yup.object({
    name: Yup.string().min(3).required('Please Enter  name'),
    email: Yup.string().email('plaese Enter Valid email').required('Please enter email'),
    password: Yup.string().min(5).required('Please Enter Password'),
    cpassword: Yup.string().oneOf([Yup.ref('password')], 'password not matched').required('Please Enter Cpassword')
})
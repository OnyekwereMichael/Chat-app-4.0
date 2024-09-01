import { Container, Text, Box, Input, Stack, Button, Checkbox, Link, Flex, Image, } from '@chakra-ui/react'
import './login.css'
import image from '../../assets/assets'
import { useState } from 'react'
import { Form, Field, Formik } from 'formik'
import { validation } from '../../component/validation'
import { signUp , Login} from '../../config/Firebase'

const initialValues = {
  name: '',
  email: '',
  password: '',
  cpassword: '',
}

function login() {

  const [currstate, Setcurrstate] = useState('Sign up')

  const [userName, SetuserName] = useState('');
  const [userEmail, SetuserEmail] = useState('')
  const [userPassword, Setuserpassword] = useState('')

  const onSubmithandler = (event) => {
   event.preventDefault();

   if(currstate==='Sign up') {
     signUp(userName, userEmail, userPassword);
   }
   else{
     Login(userEmail, userPassword)
   }
  }
  return (
    <section className='loginBackground'>
      <Formik initialValues={initialValues} validationSchema={validation} >
        {({ errors }) => (
          <Flex align='center' justify='space-around' minH={{base: '80vh', lg: '100vh',}} wrap='wrap'>
            <Image src={image.PingMe} bg='white' alt="" w={{base: '50%', lg:'20%', md:'20%'}}/>
            <Form onSubmit={onSubmithandler}>
              <Text mb="13px" textAlign="left" fontWeight="500" fontSize="25px">{currstate}</Text>
              <Stack spacing={6}>
                {currstate === 'Sign up' ? <Field onChange={(e) => SetuserName(e.target.value)} value={userName} type="text" name='name' className="inputField" placeholder='Username' /> : null}
                <Field onChange={(e) => SetuserEmail(e.target.value)} value={userEmail}  type="email" name='email' className='inputField' placeholder='Email address' />
=                <Field onChange={(e) => Setuserpassword(e.target.value)} value={userPassword}  type="password" name='password' className='inputField' placeholder='Passowrd' />
              </Stack>

              <Button colorScheme="#077eff;" variant='solid' cursor="pointer" fontSize='16px' my={3} w={{base: '80vw', lg:'340px'}} p={6} fontWeight='400'          type='submit'>
                {currstate === 'Sign up' ? 'Create account' : 'Login now'}
              </Button>

              <Flex my='8px'>
                <Checkbox colorScheme='#077eff;'> </Checkbox>
                <Text color='gray' fontSize='14px'>Agree to the terms of use & privacy policy.</Text>
              </Flex>

              {currstate === 'Sign up' ? <Text textAlign='center' mt='10px' mx='20px' fontWeight='400' fontSize='14px'>Already have an account?  <Link className='login' color='#077eff;' onClick={() => Setcurrstate('Log in')} fontSize='14px'>Login here</Link></Text> :
                <Text mt='10px'fontSize='14px' textAlign='center' >Create an account?  <Link className='login' color='#077eff;' onClick={() => Setcurrstate('Sign up')} fontSize='14px'>Click here</Link></Text>}

            </Form>
          </Flex>
        )}

      </Formik>

    </section>
  )
}

export default login

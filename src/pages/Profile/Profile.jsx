import { Container, Text, Flex, Image, Heading, Box, Input, Textarea, Button, FormControl } from '@chakra-ui/react'
import './Profile.css'
import images from '../../assets/assets'
import { useContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '../../config/Firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import upload from '../../Strorage/Upload'
import { AppContext } from '../../context/Context'


function Profile() {
  const navigate = useNavigate()
  const [image, setImage] = useState(false)


  const [Bio, setBio] = useState('')
  const [Name, setName] = useState('')
  const [Avatar, setAvatar] = useState('')
  const [Uid, setUid] = useState('')
  const { setUserData } = useContext(AppContext)


  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid)
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef)

        if (docSnap.data().name) {
          setName(docSnap.data().name)
        }
        if (docSnap.data().Bio) {
          setBio(docSnap.data().Bio)
        }
        if (docSnap.data().avatar) {
          setAvatar(docSnap.data().avatar)
        }
      } else {
        navigate('/')
      }
    })
  }, [])

  const profileUpdate = async (e) => {
    e.preventDefault()
    try {
      if (!Avatar && !image) {
        toast.error('upload profile pic')
      }

      const docRef = doc(db, 'users', Uid)
      if (image) {
        const imageUrl = await upload(image);
        setAvatar(image)
        await updateDoc(docRef, {
          avatar: imageUrl,
          Bio: Bio,
          name: Name

        })
      } else {
        await updateDoc(docRef, {
          Bio: Bio,
          name: Name
        })
      }



      const snap = await getDoc(docRef);
      navigate('/chat')
      setUserData(snap.data())

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }


  return (
    <section>
      <Flex justify='center' align='center' h='100vh' flexDirection='column' className='loginBackground'>
        <Flex w={{ base: '90%', lg: '50%' }} bg='white' pt='15px' px='13px' borderRadius='15px' justifyContent='space-between' align='center' >
          <Box>
            <Heading fontSize='23px' fontWeight='500' my='20px' mx='20px'>Profile details</Heading>
            <Flex align='center' gap='10px' mt='20px' mx='20px'>
              <input type="file" id="avatar" accept="image/jpeg, image/png, image/svg" className="hidden_gallery" onChange={(e) => setImage(e.target.files[0])} />
              <label htmlFor="avatar">
                <Flex align='center' gap='10px'>
                  <Image boxSize='60px' objectFit='cover' src={image ? URL.createObjectURL(image) : images.avatar_icon} alt='Dan Abramov' borderRadius='50%' id='avatar' />
                  <Text color='gray' cursor='pointer' fontSize='17px' id='avatar'>upload profile image</Text>
                </Flex>
              </label>
            </Flex>

            <form onSubmit={profileUpdate}>
              <Flex flexDirection='column'>
                <Input w={{ base: '350px', lg: '330px' }} bg="transparent" outline="none" placeholder="Your name..." className="input" color='black' mb='10px' p='23px' onChange={(e) => setName(e.target.value)} value={Name} />

                <Textarea placeholder='Write profile bio' my='10px' w={{ base: '350px', lg: '330px' }} bg="transparent" outline="none" onChange={(e) => setBio(e.target.value)} value={Bio} />
                <Button colorScheme="#077eff;" fontWeight='400' variant='solid' cursor="pointer" fontSize='18px' my={3} w={{ base: '80vw', lg: '330px' }} p={6} type='submit'>
                  Save
                </Button>
              </Flex>
            </form>
          </Box>

          <Box pr='20px'>
            <Image boxSize='200px' objectFit='cover' src={image ? URL.createObjectURL(image) : images.logo_icon} alt='Dan Abramov' borderRadius='50%' id='avatar' display={{ base: 'none', lg: 'block' }} />
          </Box>
        </Flex>
      </Flex>
    </section>
  )
}

export default Profile;

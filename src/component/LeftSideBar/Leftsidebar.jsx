import { Text, Box, Flex, Grid, GridItem, Image, Container, Input, Heading, Button, HStack, SimpleGrid, Divider } from "@chakra-ui/react"
import images from '../../assets/assets'
import { useContext, useEffect, useState } from "react"
import { db, logOut } from "../../config/Firebase"
import { arrayUnion, collection, doc,  getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore"
import { AppContext } from "../../context/Context"
import { toast } from "react-toastify"



function Leftsidebar() {
    const [hoverBtn, SethoverBtn] = useState(false)
    const { ChatData, UserData} = useContext(AppContext)
    const [User, setUser] = useState(null);
    const [showUser, setshowUser] = useState(false)

    const inputHandler = async (e) => {
        try {
            const input = e.target.value
            if (input) {
                setshowUser(true)
                const userRef = collection(db, 'users')
                const q = query(userRef, where("username", "==", input.toLowerCase()))
                const querySnap = await getDocs(q)

                if (!querySnap.empty) {
                    setUser(querySnap.docs[0].data())
                } else {
                    setUser(null)
                }
            } else {
                setshowUser(false)
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message)
        }
    }



    // add the chat 
    const addChat = async () => {
        const messageRef = collection(db, 'message')
        const chatsRef = collection(db, 'chat')

        try {
            const newMessage = doc(messageRef)
            await setDoc(newMessage, {
                createdAt: serverTimestamp(),
                messages: []
            })

            //    reciever template 
            await updateDoc(doc(chatsRef, User.id), {
                chatsData:arrayUnion({
                    messageID: newMessage.id,
                    lastMessage: '',
                    Rid: UserData.id,
                    updatedAt: Date.now(),
                    messageSeen: true
                })
            })

            //    senders template 
            await updateDoc(doc(chatsRef, UserData.id), {
                chatsData:arrayUnion({
                    messageID: newMessage.id,
                    lastMessage: '',
                    Rid: User.id,
                    updatedAt: Date.now(),
                    messageSeen: true
                })

            })


        } catch (error) {
            console.error(error);
            toast.error(error.message)
        }
    }


    return (
        <section>
            <GridItem colSpan='2' bg='#001030;'>
                <Flex align='center' justify='space-between' mb='15px' py='20px' px='10px' mx='auto' cursor='pointer'>
                    <img src={images.logo} alt="" width='60%' />
                    <img src={images.menu_icon} alt="" width='12%' onClick={() => SethoverBtn(!hoverBtn)} />
                </Flex>

                <Flex justify='end' mx='10px'>
                    {hoverBtn ?
                        <Flex align='center' justify='center' flexDirection='column' background='white' color='black' zIndex='10' position='fixed' w='10%' mx='auto' p='10px' borderRadius='10px' top='12%'>
                            <Text mt='3px' cursor='pointer' onClick={() => navigate('/profile')}>Edit Profile</Text>
                            <Divider orientation='horizontal' my='10px' />
                            <Text my='3px' cursor='pointer' onClick={() => logOut()}>Logout</Text>
                        </Flex>
                        : ''}
                </Flex>

                <Flex align='center' justify='center' bg='#002670' w='330px' mx='auto' py='3px' px='10px' borderRadius='6px'>
                    <img src={images.search_icon} alt="" width='6%' />
                    <Input
                        w="330px"
                        bg="transparent"
                        border="none"
                        outline="none"
                        placeholder="Search For Freinds..."
                        className="input"
                        _hover={{}}
                        _focus={{ boxShadow: 'none' }}
                        color='white'
                        onChange={inputHandler}
                    />
                </Flex>


                <Flex flexDirection='column' h='75vh' overflowY='scroll' border='none' outline='none' mt='8px'>
                    {showUser && User
                        ? <Flex my='15px' gap='10px' px='15px' className="hover" onClick={addChat} >
                            <Image boxSize='50px' objectFit='cover' src={User.avatar} alt='Dan Abramov' borderRadius='50%' />
                            <Flex flexDirection='column'>
                                <Heading color='white' my='2px' fontSize='17px' fontWeight='500'>{User.name}</Heading>
                                <Text color='rgba(255, 255, 255, 0.686);' fontSize='15px'>Hey, There</Text>
                            </Flex>
                        </Flex>
              :
                        // : ChatData.map((item, i) => {
                        //     return (
                        //         <Flex my='15px' gap='10px' px='15px' className="hover" key={i}>
                        //             <Image boxSize='50px' objectFit='cover' src={item.UserData.avatar} alt='Dan Abramov' borderRadius='50%' />
                        //             <Flex flexDirection='column'>
                        //                 <Heading color='white' my='2px' fontSize='17px' fontWeight='500'>{item.UserData.name}</Heading>
                        //                 <Text color='rgba(255, 255, 255, 0.686);' fontSize='15px'></Text>
                        //             </Flex>
                        //         </Flex>
                        //     )
                        // })
""
                    }

                </Flex>
            </GridItem>
        </section>
    )
}

export default Leftsidebar

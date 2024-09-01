import { Text, Box, Flex, Grid, GridItem, Image, Container, Input, Heading, Button, HStack, SimpleGrid, Divider } from "@chakra-ui/react"
import images from '../../assets/assets'
import './Chat.css'
import { useContext, useEffect, useState } from "react"
import { db, logOut } from "../../config/Firebase"
import { useNavigate } from "react-router-dom"
import { arrayUnion, collection, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore"
import { AppContext } from "../../context/Context"
import { toast } from "react-toastify"
import upload from '../../Strorage/Upload'
function Chat() {
    const [hoverBtn, SethoverBtn] = useState(false)
    const navigate = useNavigate()

    // left side bar 
    const { UserData, chatData, SetMessagesID, setChatUser, chatUser, messagesID, setMessages, Messages } = useContext(AppContext)
    const [User, setUser] = useState('');
    const [showUser, setshowUser] = useState(false)
    const [loading, setLoading] = useState(true)
    const [input, setInput] = useState('')


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
            toast.error(error.code)
        }
    }


    // add the chat 
    const addChat = async () => {
        const messageRef = collection(db, 'message',)
        const chatRef = collection(db, "chat")

        try {
            const newMessage = doc(messageRef)
            await setDoc(newMessage, {
                createdAt: serverTimestamp(),
                messages: []
            })

            //    reciever template 
            await updateDoc(doc(chatRef, User.id), {
                chatsData: arrayUnion({
                    messageID: newMessage.id,
                    lastMessage: '',
                    Rid: UserData.id,
                    updatedAt: Date.now(),
                    messageSeen: true
                })
            })

            //    senders template 
            await updateDoc(doc(chatRef, UserData.id), {
                chatsData: arrayUnion({
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

    // loading function 
    useEffect(() => {
        if (UserData, chatData) {
            setLoading(false)
        }
    }, [UserData, chatData])


    // setchat function 
    const setChat = async (item) => {
        SetMessagesID(item.messageID)
        setChatUser(item)
    }

    // loading message 
    useEffect(() => {
        if (messagesID) {
            const unSubb = onSnapshot(doc(db, 'message', messagesID), (res) => {
                setMessages(res.data().messages.reverse())
                console.log(res.data().messages.reverse());
            })

            return () => {
                unSubb()
            }
        }
    }, [messagesID])
    // send message function 


    const sendMessage = async () => {
        try {
            if (input && messagesID) {
                await updateDoc(doc(db, 'message', messagesID), {
                    messages: arrayUnion({
                        Sid: UserData.id,
                        text: input,
                        createdAT: new Date()
                    })
                })

                const userIDS = [chatUser.Rid, UserData.id]

                userIDS.forEach(async (id) => {
                    const userChatRefs = doc(db, 'chat', id);
                    const userChatsSnap = await getDoc(userChatRefs)

                    if (userChatsSnap.exists) {
                        const userChatData = userChatsSnap.data()
                        const chatIndex = userChatData.chatsData.findIndex((c) => c.messageID === messagesID);
                        userChatData.chatsData[chatIndex].lastMessage = input.slice(0, 30)
                        userChatData.chatsData[chatIndex].updatedAt = Date.now()
                        if (userChatData.chatsData[chatIndex].Rid === UserData.id) {
                            userChatData.chatsData[chatIndex].messageSeen = false
                        }

                        await updateDoc(userChatRefs, {
                            chatsData: userChatData.chatsData
                        })
                    }
                })
            }
        } catch (error) {
            toast.error(error.message)
        }
        setInput('')
    }


    // send images 
    const sendImg = async (event) => {
        try {
            const fileUrl = await upload(event.target.files[0])
            if (fileUrl && messagesID) {
                await updateDoc(doc(db, 'message', messagesID), {
                    messages: arrayUnion({
                        Sid: UserData.id,
                        image: fileUrl,
                        createdAT: new Date()
                    })
                })

                const userIDS = [chatUser.Rid, UserData.id]

                userIDS.forEach(async (id) => {
                    const userChatRefs = doc(db, 'chat', id);
                    const userChatsSnap = await getDoc(userChatRefs)

                    if (userChatsSnap.exists) {
                        const userChatData = userChatsSnap.data()
                        const chatIndex = userChatData.chatsData.findIndex((c) => c.messageID === messagesID);
                        userChatData.chatsData[chatIndex].lastMessage = "image"
                        userChatData.chatsData[chatIndex].updatedAt = Date.now()
                        if (userChatData.chatsData[chatIndex].Rid === UserData.id) {
                            userChatData.chatsData[chatIndex].messageSeen = false
                        }

                        await updateDoc(userChatRefs, {
                            chatsData: userChatData.chatsData
                        })
                    }
                })
            }
        } catch (error) {

        }
    }

    const converTimeStamp = (timestamp) => {
        let date = timestamp.toDate()
        const hours = date.getHours()
        const minutes = date.getMinutes()

        if (hours > 12) {
            return hours - 12 + ':' + minutes + ' PM'
        } else {
            return hours + ':' + minutes + ' AM'

        }
    }


    return (
        <section bgGradient='linear-gradient(#596aff, #383699);'>
            {loading ?
                <Flex align='center' justify='center'  h='100vh'>
                    <Image src={images.PingMe} w='30%' h='30%'/>
                </Flex>
                :
                <Grid minH='100vh' templateColumns='repeat(8, 3fr)'>
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
                            {showUser && User ?
                                <Flex my='15px' gap='10px' px='15px' py='7px' className="hover" onClick={addChat}>
                                    <Image boxSize='50px' objectFit='cover' src={User.avatar} alt='Dan Abramov' borderRadius='50%' />
                                    <Flex flexDirection='column'>
                                        <Heading color='white' my='2px' fontSize='17px' fontWeight='500'>{User.name}</Heading>
                                        <Text color='rgba(255, 255, 255, 0.686);' fontSize='15px'>Hey, There</Text>
                                    </Flex>
                                </Flex>
                                : chatData && chatData.map((item, index) => (
                                    <Flex my='5px' gap='10px' px='15px' py='10px' key={index} className="hover" onClick={() => setChat(item)}>
                                        <Image boxSize='50px' objectFit='cover' src={item.userData.avatar} alt='Dan Abramov' borderRadius='50%' />
                                        <Flex flexDirection='column'>
                                            <Heading color='white' my='2px' fontSize='17px' fontWeight='500'>{item.userData.name}</Heading>
                                            <Text color='rgba(255, 255, 255, 0.686);' fontSize='15px'>{item.lastMessage}</Text>
                                        </Flex>
                                    </Flex>
                                ))
                            }

                        </Flex>
                    </GridItem>


                    <GridItem colSpan='4' bg='gray.100' >
                        {chatUser ?
                            <Box>
                                <Flex align='center' justify='space-between' px='10px' borderBottom='1px solid gray'  >
                                    <Flex align='center' gap='10px' px='5px'>
                                        <Image boxSize='60px' objectFit='cover' src={chatUser.userData.avatar} alt='Dan Abramov' borderRadius='50%' />
                                        <Text fontSize='20px' fontWeight='500'>{chatUser.userData.name}</Text>
                                    </Flex>
                                    <Image boxSize='50px' objectFit='cover' src={images.help_icon} alt='Dan Abramov' borderRadius='50%' w='8%' height='8%' />
                                </Flex>

                                <Box className="chat-msg" h='80vh'>
                                 {Messages.map((msg,i) => {
                                    return (
                                        <Box className={msg.Sid === UserData.id ? 's-msg' : 'r-msg'} p='8px'>
                                         {msg['image'] ? <Image boxSize='250px' src={msg.image} borderRadius='10px' border='none' outline='none'/> : <Text className={msg.Sid === UserData.id ? 's-msg' : 'r-msg'} fontSize='14px' p='8px' maxWidth='300px' fontWeight='300' color='white' borderRadius={msg.Sid === UserData.id ? 's-msg' : 'r-msg'} bg={msg.Sid === UserData.id ? `#077eff;` : `gray`} mb='30px'>{msg.text}.</Text>}
                                        <div>
                                            <img src={msg.Sid === UserData.id ? UserData.avatar : chatUser.userData.avatar} alt="" className="" />
                                            <Text fontWeight='600' fontSize='10px' mt='3px'>{converTimeStamp(msg.createdAT)}</Text>
                                        </div>
                                    </Box>
                                    )
                                 })}
                                    
                                </Box>


                                <Flex align='center' p='10px 12px' position='absolute' bg='white' bottom='0' left='0' right='0' w='630px' justify='center' mx='auto' boxShadow='md' shadow='md' >
                                    <input type="text" className="input" placeholder="Send a message.." onChange={(e) => setInput(e.target.value)} value={input} />
                                    <input onChange={sendImg} type="file" id="image" accept="image/jpeg, image/png, image/svg" className="hidden_gallery" />
                                    <label htmlFor="image">
                                        <img src={images.gallery_icon} width='60%' height='60%' />
                                    </label>
                                    <Image boxSize='60px' objectFit='cover' src={images.send_button} alt='Dan Abramov' w='5%' h='5%' onClick={sendMessage} />
                                </Flex>
                            </Box> :

                            <Flex flexDirection='column' justify='center' align='center' h='100vh'>
                                <Image boxSize='60px' objectFit='cover' src={images.logo_icon} alt='Dan Abramov' w='30%' h='30%' />
                                <Text color='#383838;' fontWeight='500' fontSize='20px'>Chat Anytime, Anywhere 😎</Text>
                            </Flex>
                        }
                    </GridItem>


                    <GridItem colSpan='2' bg='#001030;' flexDirection='column' minH='100vh' h='75vh' overflowY='scroll' border='none' outline='none'>
                        <Flex justify='center' align='center' h='50vh' flexDirection='column' borderBottom='2px solid #ffffff50'>
                            <Image boxSize='200px' objectFit='cover' src={UserData.avatar} alt='Dan Abramov' borderRadius='50%' />
                            <Heading color='white' my='8px' fontWeight='500' fontSize='32px'>{UserData.name}</Heading>
                            <Text color='rgba(255, 255, 255, 0.686);' textAlign='center'>{UserData.Bio}</Text>
                        </Flex>

                        <Box p='10px' overflowY='scroll'>
                            <Text fontSize='20px' color='white' py='15px'>Media</Text>
                            <SimpleGrid columns={3} spacing={4}>
                                <Image boxSize='200px' objectFit='cover' src={images.pic1} alt='Dan Abramov' w='100%' h='100%' borderRadius='3px' />
                                <Image boxSize='200px' objectFit='cover' src={images.pic2} alt='Dan Abramov' w='100%' h='100%' borderRadius='3px' />
                                <Image boxSize='200px' objectFit='cover' src={images.pic3} alt='Dan Abramov' w='100%' h='100%' borderRadius='3px' />


                            </SimpleGrid>
                        </Box>

                        <Flex justify='center' >
                            <Button colorScheme="blue" w='200px' position='absolute' bottom='20px' borderRadius='50px' onClick={() => logOut()}>Logout</Button>
                        </Flex>
                    </GridItem>
                </Grid>
            }
        </section>
    )
}

export default Chat

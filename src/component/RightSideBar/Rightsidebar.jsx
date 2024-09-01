import { Text, Box, Flex, Grid, GridItem, Image, Container, Input, Heading, Button, HStack, SimpleGrid, Divider } from "@chakra-ui/react"
import {  logOut } from "../../config/Firebase"
import images from '../../assets/assets'
import Chat from "../../pages/Chat/Chat"



function Rightsidebar() {
    return (
        <section>
            <GridItem  bg='#001030;' flexDirection='column' minH='100vh' h='75vh' overflowY='scroll' border='none' outline='none'>
                <Flex justify='center' align='center' h='50vh' flexDirection='column' borderBottom='2px solid #ffffff50'>
                    <Image boxSize='200px' objectFit='cover' src={images.profile_img2} alt='Dan Abramov' borderRadius='50%' />
                    <Heading color='white' my='8px' fontWeight='500' fontSize='32px'>Richard Sanford</Heading>
                    <Text color='rgba(255, 255, 255, 0.686);'>Hey, There i am using Chat app</Text>
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

        </section>
    )
}

export default Rightsidebar

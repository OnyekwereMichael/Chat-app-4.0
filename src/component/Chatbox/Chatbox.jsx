import { Text, Box, Flex, Grid, GridItem, Image, Container, Input, Heading, Button, HStack, SimpleGrid, Divider } from "@chakra-ui/react"
import images from '../../assets/assets'



function Chatbox() {
  return (
    <section>
         <GridItem  bg='gray.100' >
                            <Flex align='center' justify='space-between' px='10px' borderBottom='1px solid gray'  >
                                <Flex align='center' gap='10px' px='5px' py='8px'>
                                    <Image boxSize='60px' objectFit='cover' src={images.profile_img2} alt='Dan Abramov' borderRadius='50%' />
                                    <Text fontSize='20px' fontWeight='500'>Richard Sanford</Text>
                                </Flex>
                                <Image boxSize='50px' objectFit='cover' src={images.help_icon} alt='Dan Abramov' borderRadius='50%' w='8%' height='8%' />
                            </Flex>

                            <Box position='absolute' bottom='80px'>
                                <Flex className="s-mess" align='center' p='10px' >
                                    <Text fontSize='14px' bg='gray;' p='8px' maxWidth='300px' fontWeight='300' color='white' borderRadius='7px 7px 0px 7px'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</Text>
                                    <Flex flexDirection='column' >
                                        <Image boxSize='40px' objectFit='cover' src={images.profile_img} alt='Dan Abramov' w='10%' h='10%' borderRadius='50%' />
                                        <Text fontSize='12px'>2:30 pm</Text>
                                    </Flex>
                                </Flex>

                                <Flex className="s-mess" align='center' p='10px' >
                                    <Text fontSize='14px' bg='#3a36ff;' p='8px' maxWidth='300px' fontWeight='300' color='white' borderRadius='7px 7px 0px 7px'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</Text>
                                    <Flex flexDirection='column' >
                                        <Image boxSize='40px' objectFit='cover' src={images.profile_img} alt='Dan Abramov' w='10%' h='10%' borderRadius='50%' />
                                        <Text fontSize='12px'>2:30 pm</Text>
                                    </Flex>
                                </Flex>
                            </Box>

                            <Flex align='center' p='10px 12px' position='absolute' bg='white' bottom='0' left='0' right='0' w='710px' justify='center' mx='auto' boxShadow='md' shadow='md' >
                                <input type="text" className="input" placeholder="Send a message.." />
                                <input type="file" id="image" accept="image/jpeg, image/png, image/svg" className="hidden_gallery" />
                                <label htmlFor="image">
                                    <img src={images.gallery_icon} width='60%' height='60%' />
                                </label>
                                <Image boxSize='60px' objectFit='cover' src={images.send_button} alt='Dan Abramov' w='5%' h='5%' />
                            </Flex>
                        </GridItem>

    </section>
  )
}

export default Chatbox

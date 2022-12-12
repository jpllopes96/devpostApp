import React, { useContext, useState, useEffect} from 'react';
import { View, Text, Modal, Platform } from 'react-native';
import Header from '../../components/Header'
import { Container, Name, Email, Button, ButtonText, UploadButton, UploadText, Avatar, ModalContainer, ButtonBack, Input } from './styles';
import { AuthContext } from '../../contexts/auth';
import Feather from 'react-native-vector-icons/Feather'
import firestore from '@react-native-firebase/firestore'
import storage from '@react-native-firebase/storage'
import {launchImageLibrary} from 'react-native-image-picker';

export default function Profile(){
    const [nome, setNome] = useState(user?.name)
    const [url, setUrl] = useState(null)
    const {signOut, user, setUser, storageUser} = useContext(AuthContext)
    const [open, setOpen] = useState(false);

    useEffect(()=>{
        let isActive = true;
        async function loadAvatar(){
            try{
                if(isActive){
                    let response = await storage().ref('users').child(user?.uid).getDownloadURL();
                    setUrl(response)
                }

            }catch(err){
                console.log("Não encontramos foto")
            }
        }

        loadAvatar();

        return () => isActive = false
    }, [])
    
    async function updateProfile(){
        if(nome === '' ){
            return;
        }
        await firestore().collection('users').doc(user?.uid)
            .update({
                name: nome
            })
        
        const postDocs = await firestore().collection('posts')
        .where('userId', '==', user?.uid).get();

        postDocs.forEach( async doc => {
            await firestore().collection('posts').doc(doc.id)
            .update({
                autor: nome
            })
        })

        let data ={
            uid: user.uid,
            name: nome,
            email: user.email
        }
        setUser(data)
        storageUser(data)
        setOpen(false)
    }

    const uploadFile = () =>{
        const options ={
            noData: true,
            mediaType: 'photo'
        };

        launchImageLibrary(options, response => {
            if(response.didCancel){
                console.log("Cancelado")
            }else if(response.error){
                console.log("Erro")
            }else{
                console.log("Enviar pro firebase")
                uploadFileFirebase(response)
                .then(()=>{
                    uploadAvatarPosts();
                })
                setUrl(response.assets[0].uri)
            }
        })
    }

    const getFileLocalePath = (response) =>{
        return response.assets[0].uri
    }

    const uploadFileFirebase = async (response) =>{
        const fileSource = getFileLocalePath(response)
        // console.log(fileSource)
        const storageRef = storage().ref('users').child(user?.uid);

        return await storageRef.putFile(fileSource)
    }
    const uploadAvatarPosts = async () =>{
        const storageRef = storage().ref('users').child(user?.uid);
        const url = await storageRef.getDownloadURL()
        .then(async (image) =>{
            const postDocs = await firestore().collection('posts')
            .where('userId', '==', user.uid).get();

            postDocs.forEach(async  u =>{
                await firestore().collection('posts').doc(u.id).update({
                    avatarUrl: image
                })
            })
        })
        .catch ((error) =>{
            console.log(error)
        })
    }
    async function handleSignOut(){
        await signOut()
    }
    return(
        <Container>
            <Header />
            { url ? (
                <UploadButton onPress={ () => uploadFile() }>
                    <UploadText>+</UploadText>
                    <Avatar source={{uri: url}}/>
                </UploadButton>
            ) : (
            <UploadButton onPress={ () => uploadFile() }>
                <UploadText>+</UploadText>
                
            </UploadButton>
            )}
            <Name>{user?.name}</Name>
            <Email>{user?.email}</Email>
            <Button bg="#428cfd" onPress={ () => setOpen(true)}>
                <ButtonText color="#FFF">Atualizar Perfil</ButtonText>
            </Button>

            <Button bg="#DDD" onPress={handleSignOut}>
                <ButtonText color="#353840">Sair</ButtonText>
            </Button>

            <Modal visible={open} animationType="slide" transparent={true}>
                <ModalContainer behavior={Platform.OS === 'android' ? '' : 'padding' }>
                    <ButtonBack onPress={ () => setOpen(false)}>
                        <Feather name='arrow-left' size={22} color="#121212" />
                        <ButtonText color="#121212">Voltar</ButtonText>
                    </ButtonBack>
                    <Input 
                        placeholder={user?.name} 
                        value={nome} 
                        onChangeText={(text) => setNome(text)}
                    />
                    
                    <Button bg="#428cfd" onPress={ updateProfile}>
                        <ButtonText color="#FFF">Salvar</ButtonText>
                    </Button>
                </ModalContainer>

            </Modal>
        </Container>
    )
}
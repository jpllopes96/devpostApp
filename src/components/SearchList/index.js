import React from "react";
import { Container, Name } from "./styles";
import { useNavigation } from "@react-navigation/native";

export default function SearchList({data}){
    const navigation = useNavigation();
    return(
        <Container onPress={ () => navigation.navigate("PostsUsers", { title: data.name, userId: data.id})}>
            <Name>{data.name}</Name>
        </Container>
    )
}
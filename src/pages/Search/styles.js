import styled from "styled-components/native";

export const Container = styled.SafeAreaView`
    flex: 1;
    padding-top: 14px;
    background-color: #343840;
`;

export const AreaInput = styled.View`
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    background-color: #F1f1f1;
    margin: 10px;
    padding: 5px 10px;
    border-radius: 4px;
`;

export const Input = styled.TextInput`
    width: 90%;
    background-color: #F1f1f1;
    padding-left: 8px;
    height: 40px;
    font-size: 17px;
    color: #121212;
`;

export const List = styled.FlatList`
    flex: 1;

`;
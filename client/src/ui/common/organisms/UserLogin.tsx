import { gql, useMutation } from "@apollo/client";
import { SubmitHandler, useForm } from "react-hook-form";
import { useMessage } from "../../../contexts/MessageContext";
import Label from "../atoms/Label";
import { authLabel } from "../../../localization/auth";
import { useLang } from "../../../hooks/useLang";

const LOGIN_MUTATION = gql`
mutation Login($data:UserDTO!){
login(data: $data){
id
firstName
middleName
lastName
email
phoneNumber
tokens
message
}
}
`;

interface FormData {
    email: string;
    password: string;
}


const UserLogin = () => {
    const { setMessage } = useMessage();
    const {lang} = useLang()
    const { register, handleSubmit, reset } = useForm<FormData>({
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const [login, {data, loading, error}] = useMutation(LOGIN_MUTATION)

    const onSubmit: SubmitHandler<FormData> = async (formData) => {
        try {
            const response =await login({ variables: { data: formData } })
            console.log("🚀 ~ constonSubmit:SubmitHandler<FormData>= ~ response:", response)
            setMessage(data.login.message,"success")
        } catch (err) {
            console.log(err)
             if (error instanceof Error) {
               const graphqlError = error?.graphQLErrors?.[0]?.message;
               setMessage(graphqlError || "An error occured", "error");
             }
        }
    }

    return (
      <form action="" onSubmit={handleSubmit(onSubmit)}>
        <div>
                <Label name="email" label={authLabel.email[lang]} />
                
        </div>
      </form>
    );

}
import { Form, Field, FormElement, FieldWrapper, FormRenderProps } from '@progress/kendo-react-form';
//import { Error } from '@progress/kendo-react-labels';
import { Input } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import "@progress/kendo-theme-default/dist/all.css"
//import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


//import api_url  from '../readConfig';
import { APP_API_URL } from '../environment';
const loginUrl = APP_API_URL + "/jttcust/login"







export function Login() {
    const navigate = useNavigate();
    const goToHomePage = (userID : string) => {
        navigate('/home/' + userID  
        ); 
    };
    const handleSubmit = async (dataItem: { [Username: string]: any }) => {
        //console.log(APP_URL_TEST)
        const username = dataItem.Username as string;
        const response = await fetch(loginUrl + "/" + username)
        if (!response.ok){
            if (response.status != 404){
                alert(JSON.stringify("Error"))
            } else {
                alert(JSON.stringify("Bad Login Credentials"))
            }
        } else {
            //route to login
            //console.log(await response.text())
            const data : string = await response.text()
            goToHomePage(data);
        }
    }

    return(
        <Form
            onSubmit={handleSubmit}
            render={(formRenderProps: FormRenderProps) => (
                <FormElement style={{ maxWidth: 650 }}>
                    <fieldset className={'k-form-fieldset'}>
                        <legend className={'k-form-legend'}>Please login:</legend>
                        <FieldWrapper>
                            <div className="k-form-field-wrap">
                                <Field
                                    name={'Username'}
                                    component={Input}
                                    labelClassName={'k-form-label'}
                                    label={'Username'}
                                />
                            </div>
                        </FieldWrapper>

                    </fieldset>
                    <div className="k-form-buttons">
                        <Button disabled={!formRenderProps.allowSubmit}>Submit</Button>
                    </div>
                </FormElement>
            )}
        />
    );
}



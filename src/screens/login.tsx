import { Form, Field, FormElement, FieldWrapper, FormRenderProps } from '@progress/kendo-react-form';
import { Error } from '@progress/kendo-react-labels';
import { Input } from '@progress/kendo-react-inputs';
import { Button } from '@progress/kendo-react-buttons';
import "@progress/kendo-theme-default/dist/all.css"


const loginUrl = "http://localhost:8080/jttcust/login"
const handleSubmit = async (dataItem: { [Username: string]: any }) => {
    const username = dataItem.Username as string;
    console.log(username)
    const response = await fetch(loginUrl + "/" + username)
    console.log(response)
}





export function Login() {
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



import * as React from 'react';
import PageWrapper from '../../hoc/PageWrapper/PageWrapper';
import {FormWrapper} from '../../styles/LoginForm/FormFrame';
import {InnerFrame} from '../../styles/LoginForm/Frame';
import {SubmitButtonWrapper} from '../../styles/ForgotPassswordPage/SubmitButtonWrapper';
import {EmailLabel, Label} from '../../styles/ForgotPassswordPage/Label';
import {MessageWrapper} from '../../styles/LoginForm/MessageWrapper';
import {Message} from '../../styles/LoginForm/Message';
import {Button} from '../../styles/LoginForm/Button';
import {Wrapper} from '../../styles/LoginForm/Wrapper';
import {SectionTitle} from '../../styles/ForgotPassswordPage/SectionTitle';
import {DescriptionWrapper} from '../../styles/ForgotPassswordPage/DescriptionWrapper';
import {InputWrapper} from '../../styles/ForgotPassswordPage/InputWrapper';
import {Input} from '../../styles/ForgotPassswordPage/Input';
import {resetPasswordService} from '../../services/settingsService';
import mailRegex from '../../utils/Regex/mailRegex';
import {ResetPasswordRequest} from '../../dataModels/requests/ResetPasswordRequest';

export interface ForgotPasswordPageState {
    submitButtonDisabled: boolean,
    errorMessage: string | undefined,
}

export default class ForgotPasswordPage extends React.Component<undefined, ForgotPasswordPageState> {

    constructor(props: undefined) {
        super(props);
        this.state = {
            submitButtonDisabled: true,
            errorMessage: undefined,
        };
    }

    handleFormState = (event: any) => {
        event.preventDefault();
        this.setState({
            submitButtonDisabled: !event.currentTarget.reportValidity(),
        })
    };

    handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (mailRegex.test(event.currentTarget.email.value)) {
            this.resetPassword(event.currentTarget.email.value);
        } else {
            this.setState({
                errorMessage: 'Należy wprowadzić adres email',
            });
        }
    };

    resetPassword = (emailAddress: string) => {
        const request: ResetPasswordRequest = {
            body: {email: emailAddress,}
        };
        resetPasswordService(request)
            .then((res) => {
                this.setState({
                    errorMessage: res.body.message,
                })
            })
    };

    render() {
        return <PageWrapper>
            <Wrapper>
                <FormWrapper>
                    <InnerFrame>
                        <SectionTitle>
                            RESETOWANIE HASŁA
                        </SectionTitle>
                        <form onSubmit={this.handleSubmit}
                              onChange={this.handleFormState}>
                            <DescriptionWrapper>
                                <Label>
                                    Aby zresetować hasło, wpisz adres e-mail, na który zostało założone konto.
                                    <br/>Na ten adres zostanie wysłana wiadomość z linkiem pozwalacjącym na ustawienie
                                    nowego
                                    hasła.
                                </Label>
                            </DescriptionWrapper>
                            <InputWrapper>
                                <EmailLabel>E-mail:</EmailLabel>
                                <Input name="email"
                                       type="email"
                                       maxLength={30}
                                       required/>
                            </InputWrapper>
                            <MessageWrapper>
                                <Message>{this.state.errorMessage || ''}</Message>
                            </MessageWrapper>
                            <SubmitButtonWrapper>
                                <Button type='submit'
                                        value='RESETUJ HASŁO'
                                        disabled={this.state.submitButtonDisabled}/>
                            </SubmitButtonWrapper>
                        </form>
                    </InnerFrame>
                </FormWrapper>

            </Wrapper></PageWrapper>;
    }
};
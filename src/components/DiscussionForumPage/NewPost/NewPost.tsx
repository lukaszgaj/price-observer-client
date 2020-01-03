import React from "react";
import {AppState} from "../../../redux/store/storeDataModels/AppState";
import {Dispatch} from "redux";
import {connect} from "react-redux";
import {NewPostProps} from "./NewPostProps";
import {PostContainer} from "../../../styles/DiscussionPanel/Frame";
import {NewPostContainerTitle} from "../../../styles/DiscussionPanel/SectionTitle";
import {NewPostLinkInput, NewPostMessageInput} from "../../../styles/DiscussionPanel/NewPostMessageInput";
import {RowWrapper, SubmitButtonWrapper} from "../../../styles/DiscussionPanel/RowWrapper";
import {Button} from "../../../styles/DiscussionPanel/Button";
import {addDiscussionPost} from "../../../services/discussionPanelService";
import {DiscussionPost} from "../../../dataModels/Post";
import {NewPostState} from "./NewPostState";
import jwt_decode from "jwt-decode";
import {UserDetails} from "../../../dataModels/UserDetails";

class NewPost extends React.Component<NewPostProps, NewPostState> {

    constructor(props: NewPostProps) {
        super(props);
        this.state = {
            post: {
                userName: this.props.userName,
                date: 0,
                link: '',
                message: '',
            },
            submitButtonDisabled: true,
        }
    }

    addPost = () => {
        const post: DiscussionPost = {
            ...this.state.post,
            date: Date.now().valueOf()
        };
        addDiscussionPost({token: this.props.token, body: {post}})
            .then(() => {
                this.props.postAddedHandler();
            })
            .catch((error) => {
                alert(error)
            });
    };

    isURLSafe = (dangerousURL: string) => {
        const url = new URL(dangerousURL);
        return url.protocol === 'http:' || url.protocol === 'https:';
    };

    handleMessageChange = (event: any) => {
        this.setState({
            post: {...this.state.post, message: event.target.value},
        })
    };

    handleLinkChange = (event: any) => {
        this.setState({
            post: {...this.state.post, link: event.target.value},
        })
    };

    handleFormStateWithXSSProtection = (event: any) => {
        event.preventDefault();
        this.setState({
            submitButtonDisabled: event.currentTarget.reportValidity() && !this.isURLSafe(event.target.value),
        });
    };

    handleFormState = (event: any) => {
        event.preventDefault();
        this.setState({
            submitButtonDisabled: !event.currentTarget.reportValidity(),
        });
    };

    handleSubmit = (event: any) => {
        event.preventDefault();
        this.addPost();
    };

    render() {
        return <PostContainer>
            <NewPostContainerTitle>DODAJ POST</NewPostContainerTitle>
            <form
                onSubmit={this.addPost}
                onChange={this.props.xssProtected ? this.handleFormStateWithXSSProtection : this.handleFormState}
                onInvalid={(e: any) => e.preventDefault()}>
                <RowWrapper>
                    <NewPostMessageInput
                        onChange={this.handleMessageChange}
                        required/>
                </RowWrapper>
                <RowWrapper>
                    <div>Link do produktu:</div>
                    <NewPostLinkInput
                        onChange={this.handleLinkChange}
                        type='url'
                        required/>
                </RowWrapper>
                <SubmitButtonWrapper>
                    <Button
                        onClick={this.handleSubmit}
                        disabled={this.state.submitButtonDisabled}>
                        DODAJ
                    </Button>
                </SubmitButtonWrapper>
            </form>
        </PostContainer>;
    }
}


const mapStateToProps = (store: AppState) => {
    return {
        xssProtected: store.xssProtected,
        token: store.login.token!,
        userName: jwt_decode<UserDetails>(store.login.token!).name,
    };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        // sortingTypeChanged: (sortingType: SortingOptions): any => dispatch(sortingProductsTypeChanged(sortingType)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(NewPost);
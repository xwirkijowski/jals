import React from 'react';
import {
	Link,
	useLocation,
	useNavigate
} from "react-router-dom";
import {
	gql,
	useMutation
} from "@apollo/client";

import Container from "../components/Container";
import Button from '../components/Button';
import {
	Form,
	InputGroup,
	Input
} from '../components/Form';
import Notification from "../components/Notification";

// @todo Add Captcha to link generation form
// @todo Add Sentry integration

const Home = () => {
	const location = useLocation();
	const navigate = useNavigate();

	let message = (location.state && location.state.message) ? location.state.message : undefined;

	const [state, setState] = React.useState({
		linkToShorten: ''
	});

	const [addLink, { data, loading, error }] = useMutation(gql`
        mutation addLink($input: LinkInput!) {
            addLink(input: $input) {
                link {
                    _id
                    target
                    created
                }
            }
        }
	`, {
		variables: {
			input: {
				target: state.linkToShorten
			}
		}
	});

	return (
		<Container>
			{(loading) && <Notification color={"info"}>Shortening in progress...</Notification>}
			{(error) && <Notification color={"danger"}>Error! {error.message}</Notification>}
			{(data) && <Notification color={"success"}>Link created! Your short code: <Link to={`/${data.addLink.link._id}`}>{data.addLink.link._id}</Link></Notification>}
			{(message) && <Notification dismissible onClick={()=>navigate('/', {replace: true})} color={message.type}>{message.content}</Notification>}
			<h2>Paste the URL you want to shorten below</h2>
			<p className={`${'big'}`}>Your URL will be exchanged for a unique short URL code.</p>
			<Form onSubmit={e => { e.preventDefault(); addLink() }}>
				<InputGroup>
					<Input required type="text" value={state.url} onChange={(e) => setState({ ...state, linkToShorten: e.target.value })} placeholder="Your link..." />
					<Button disabled={(loading)} element="button" type="submit" label="Shorten" inline />
				</InputGroup>
			</Form>
			<p className={`${'disabled'}`}>
				We count each redirect your short URL has generated.<br/>
				You can see short URL statistics or target URL by adding a plus sign (+) at the end of your short URL.
			</p>
		</Container>
	)
};

export default Home;
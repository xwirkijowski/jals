import React from 'react';
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
import {Link} from "react-router-dom";


const Home = () => {
	const [formState, setFormState] = React.useState({
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
			"input": {
				"target": formState.linkToShorten
			}
		}
	});

	return (
		<Container>
			{(loading) && <Notification color={"info"}>Shortening in progress...</Notification>}
			{(error) && <Notification color={"danger"}>Error! {error.message}</Notification>}
			{(data) && <Notification color={"success"}>Link created! Your short code: <Link to={`/${data.addLink.link._id}`}>{data.addLink.link._id}</Link></Notification>}
			<h2>Paste the URL you want to shorten below</h2>
			<p className={`${'big'}`}>Your URL will be exchanged for a unique short URL code.</p>
			<Form onSubmit={e => { e.preventDefault(); addLink() }}>
				<InputGroup>
					<Input required type="text" value={formState.url} onChange={(e) => setFormState({ ...formState, linkToShorten: e.target.value })} placeholder="Your link..." />
					<Button disabled={(loading)} element="button" type="submit" label="Shorten" inline="true" />
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
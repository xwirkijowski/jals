import React, {useEffect} from 'react';
import {
	Navigate,
	useParams
} from "react-router-dom";
import {
	gql,
	useMutation,
	useQuery
} from "@apollo/client";

import Container from "../components/Container";
import Notification from "../components/Notification";
import Column from "../components/Column";
import CodeBlock from "../components/CodeBlock";
import Row from "../components/Row";

const Redirect = () => {
	const params = useParams();
	const isValid = (params._id && (/^[a-f\d]{24}$/i.test(params._id)));

	const { loading, error, data } = useQuery(gql`
        query GetLink($_id: ID!) {
            getLink(_id: $_id) {
                _id
                target
				flagCount
            }
        }
	`, {
		skip: !isValid,
		variables: {
			_id: params._id
		}
	});

	// @todo Replace when Client Hints out
	const clickData = navigator.userAgentData;

	const [addClick] = useMutation(gql`
        mutation addClick($input: ClickInput) {
            addClick(input: $input) {
                click {
                    _id
                }
            }
        }
	`, {
		variables: {
			input: {
				link: params._id,
				platform: clickData.platform,
				isMobile: clickData.mobile
			}
		},
		onCompleted: () => {
			if (!flagged) window.location.replace(data.getLink.target);
		}
	});

	useEffect(addClick, []);

	if (!isValid) return (<Navigate to="/" replace={true} state={{message:{type:'danger', content:'Oops! Looks like your short code is invalid :('}}}/>);

	if (loading) return (
		<Container>
			<h2>Retrieving data...</h2>
		</Container>
	);

	if (error) return (
		<Container>
			<Notification color={"danger"}>Error! {error.message}</Notification>
		</Container>
	);

	if (!data || !data.getLink) return (<Navigate to="/" replace={true} state={{message:{type:'danger', content:'Oops! Looks like your short code is invalid :('}}} />);

	const flagged = (data.getLink.flagCount > 5);

	if (flagged) return (
		<Container>
			<Notification dismissible={"Proceed"} onClick={()=>window.location.replace(data.getLink.target)} color="danger">This link was flagged multiple times. Please confirm if you want to continue at your own risk.</Notification>
			<Row>
				<Column>
					<h3>Target URL</h3>
					<CodeBlock>{data.getLink.target}</CodeBlock>
				</Column>
			</Row>
		</Container>
	);

	return (
		<Container>
			<h2>You will be redirected soon...</h2>
		</Container>
	)
};

export default Redirect;
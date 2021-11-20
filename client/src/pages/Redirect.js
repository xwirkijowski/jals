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

// @todo Add confirmation before proceeding to flagged links

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
			window.location.replace(data.getLink.target);
		}
	});

	useEffect(addClick, []);

	if (!isValid) return (<Navigate to="/" replace={true} />);

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

	if (!data || !data.getLink) return (<Navigate to="/" replace={true} />);

	return (
		<React.Fragment>
			<Container>
				<h2>You will be redirected soon...</h2>
			</Container>
		</React.Fragment>
	)
};

export default Redirect;